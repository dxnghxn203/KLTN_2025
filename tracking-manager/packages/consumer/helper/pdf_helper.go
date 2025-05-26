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
	"unicode"
)

func GetWkhtmltopdfPath() (string, error) {
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

func removeVietnameseDiacritics(s string) string {
	var sb strings.Builder
	for _, r := range s {
		switch r {
		case 'á', 'à', 'ả', 'ã', 'ạ',
			'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ',
			'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ':
			sb.WriteRune('a')
		case 'Á', 'À', 'Ả', 'Ã', 'Ạ',
			'Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ',
			'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ':
			sb.WriteRune('A')
		case 'đ':
			sb.WriteRune('d')
		case 'Đ':
			sb.WriteRune('D')
		case 'é', 'è', 'ẻ', 'ẽ', 'ẹ',
			'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ':
			sb.WriteRune('e')
		case 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ',
			'Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ':
			sb.WriteRune('E')
		case 'í', 'ì', 'ỉ', 'ĩ', 'ị':
			sb.WriteRune('i')
		case 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị':
			sb.WriteRune('I')
		case 'ó', 'ò', 'ỏ', 'õ', 'ọ',
			'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ',
			'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ':
			sb.WriteRune('o')
		case 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ',
			'Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ',
			'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ':
			sb.WriteRune('O')
		case 'ú', 'ù', 'ủ', 'ũ', 'ụ',
			'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự':
			sb.WriteRune('u')
		case 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ',
			'Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự':
			sb.WriteRune('U')
		case 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ':
			sb.WriteRune('y')
		case 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ':
			sb.WriteRune('Y')
		default:
			if unicode.IsLetter(r) || unicode.IsNumber(r) || unicode.IsSpace(r) {
				sb.WriteRune(r)
			}
			// bỏ các ký tự khác (dấu câu, ký tự đặc biệt) nếu muốn
		}
	}
	return sb.String()
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
			removeVietnameseDiacritics(item.ProductName),
			item.Quantity,
			removeVietnameseDiacritics(item.Unit),
			item.OriginalPrice,
			item.Discount,
			float64(item.Quantity)*item.Price,
		))
	}

	productDiscount := productFeeBeforeDiscount - order.ProductFee
	shippingFeeDisplay := "Free"
	if order.ShippingFee > 0 {
		shippingFeeDisplay = fmt.Sprintf("%.0f", order.ShippingFee)
	}

	htmlContent := fmt.Sprintf(`
	<html>
      	<body>
        <h2>INVOICE</h2>
        <p><strong>Pharmacy:</strong> MEDICARE PHARMACY</p>
        <p><strong>Address:</strong> No.1 Vo Van Ngan, Linh Chieu Ward, Thu Duc, Ho Chi Minh City</p>
        <p><strong>Website:</strong> https://kltn-2025.vercel.app</p>
        <p><strong>Hotline:</strong> 18006928</p>
        <hr>
        <p><strong>Date:</strong> %s - <strong>Time:</strong> %s</p>
        <p><strong>Order:</strong> %s</p>
        <p><strong>Customer:</strong> %s</p>
        <hr>
        <h4>Product Details</h4>
        <table border="1" cellpadding="5" cellspacing="0" width="100%%">
          <tr>
            <th>Product Name</th>
            <th>Qty</th>
			<th>Unit</th>
            <th>Unit Price</th>
            <th>Discount</th>
            <th>Total</th>
          </tr>
          %s
        </table>
		<br>
		<p style="text-align: right;"><strong>Product Price:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Shipping Fee:</strong> %s</p>
		<p style="text-align: right;"><strong>Total Amount:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Product Discount:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Order Voucher Discount:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Shipping Voucher Discount:</strong> %.0f</p>
		<p style="text-align: right;"><strong>Amount Due:</strong> %.0f</p>
	  </body>
	</html>`,
		currentDate, currentTime, order.OrderId, order.PickTo.Name,
		itemsHTML.String(),
		productFeeBeforeDiscount, shippingFeeDisplay, order.BasicTotalFee+productDiscount,
		productDiscount, order.VoucherOrderDiscount, order.VoucherDeliveryDiscount, order.EstimatedTotalFee,
	)

	wkhtmltopdfPath, err := GetWkhtmltopdfPath()
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
