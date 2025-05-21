package helper

import (
	"bytes"
	"consumer/models"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

func getWkhtmltopdfPath() (string, error) {
	if runtime.GOOS == "windows" {
		exePath, err := os.Getwd()
		if err != nil {
			return "", err
		}
		return filepath.Join(exePath, "statics", "wkhtmltopdf", "bin", "wkhtmltopdf.exe"), nil
	}
	// Linux macOS: mặc định
	defaultPath := "/usr/bin/wkhtmltopdf"
	if _, err := os.Stat(defaultPath); err == nil {
		return defaultPath, nil
	}
	// Thử tìm wkhtmltopdf trong PATH
	path, err := exec.LookPath("wkhtmltopdf")
	if err != nil {
		return "", fmt.Errorf("wkhtmltopdf không được cài đặt trên hệ thống")
	}
	return path, nil
}

func ExportInvoiceToPDF(order models.Orders) ([]byte, error) {
	now := time.Now()
	currentDate := now.Format("02/01/2006")
	currentTime := now.Format("15:04:05")

	var itemsHTML strings.Builder
	productFeeBeforeDiscount := 0.0

	for _, item := range order.Product {
		productFeeBeforeDiscount += item.OriginalPrice * float64(item.Quantity)
		itemsHTML.WriteString(fmt.Sprintf(`
					<tr>
						<td>%s</td>
						<td style="text-align: center;">%d</td>
						<td style="text-align: center;">%s</td>
						<td style="text-align: center;">%0f</td>
						<td style="text-align: center;">%.0f%%</td>
						<td style="text-align: center;">%.0f</td>
					</tr>`,
			item.ProductName,
			item.Quantity,
			item.Unit,
			item.OriginalPrice,
			item.Discount,
			float64(item.Quantity)*item.Price,
		))
	}

	productDiscount := productFeeBeforeDiscount - order.ProductFee
	shippingFeeDisplay := "Miễn phí"
	if order.ShippingFee > 0 {
		shippingFeeDisplay = fmt.Sprintf("%.0f", order.ShippingFee)
	}

	htmlContent := fmt.Sprintf(`
    <html>
      <body>
        <h2>HÓA ĐƠN BÁN LẺ</h2>
        <p><strong>Nhà thuốc:</strong> NHÀ THUỐC MEDICARE</p>
        <p><strong>Địa chỉ:</strong> Số 1 Võ Văn Ngân, phường Linh Chiểu, Thủ Đức, TP Hồ Chí Minh</p>
        <p><strong>Website:</strong> https://kltn-2025.vercel.app</p>
        <p><strong>Hotline:</strong> 18006928</p>
        <hr>
        <p><strong>Ngày:</strong> %s - <strong>Giờ:</strong> %s</p>
        <p><strong>Đơn hàng:</strong> %s</p>
        <p><strong>Khách hàng:</strong> %s</p>
        <hr>
        <h4>Chi tiết sản phẩm</h4>
        <table border="1" cellpadding="5" cellspacing="0" width="100%%">
          <tr>
            <th>Tên sản phẩm</th>
            <th>SL</th>
			<th>Đơn vị</th>
            <th>Đơn giá</th>
            <th>Giảm giá</th>
            <th>Thành tiền</th>
          </tr>
          %s
        </table>
		<br>
		<p style="text-align: right;"><strong>Giá sản phẩm:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Phí vận chuyển:</strong> %s</p>
		<p style="text-align: right;"><strong>Tổng tiền:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Giảm giá sản phẩm:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Voucher giảm giá đơn hàng:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Voucher Giảm giá phí vận chuyển:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Tiền phải trả:</strong> %.0f</p>
	  </body>
	</html>`,
		currentDate, currentTime, order.OrderId, order.PickTo.Name,
		itemsHTML.String(),
		productFeeBeforeDiscount, shippingFeeDisplay, order.BasicTotalFee+productDiscount,
		productDiscount, order.VoucherOrderDiscount, order.VoucherDeliveryDiscount, order.EstimatedTotalFee,
	)

	wkhtmltopdfPath, err := getWkhtmltopdfPath()
	if err != nil {
		return nil, err
	}

	args := []string{
		"--encoding", "UTF-8",
		"--enable-local-file-access",
		"--page-size", "A5",
		"--margin-top", "10mm",
		"--margin-bottom", "10mm",
		"--margin-left", "10mm",
		"--margin-right", "10mm",
		"-", // Đọc HTML từ stdin
		"-", // Ghi PDF ra stdout
	}

	cmd := exec.Command(wkhtmltopdfPath, args...)

	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}

	if err := cmd.Start(); err != nil {
		return nil, err
	}

	// Gửi html content vào stdin
	_, err = stdin.Write([]byte(htmlContent))
	if err != nil {
		return nil, err
	}
	stdin.Close()

	err = cmd.Wait()
	if err != nil {
		return nil, fmt.Errorf("lỗi wkhtmltopdf: %s, chi tiết: %s", err, errBuf.String())
	}

	return outBuf.Bytes(), nil
}
