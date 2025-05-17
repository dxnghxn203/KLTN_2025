package helper

import (
	"bytes"
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"log"
	"log/slog"
	"mime"
	"net/smtp"
	"os"
	"path/filepath"
)

func SendEmail(toEmail, subject, htmlContent string, attachments map[string][]byte) error {
	gmailUser := os.Getenv("GMAIL_USER")
	gmailPassword := os.Getenv("GMAIL_PASS")
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"
	from := gmailUser
	to := []string{toEmail}

	header := make(map[string]string)
	header["From"] = from
	header["To"] = toEmail
	header["Subject"] = subject
	header["MIME-Version"] = "1.0"

	var msg bytes.Buffer

	boundary := "my-boundary-779"

	if len(attachments) > 0 {
		header["Content-Type"] = "multipart/mixed; boundary=" + boundary
	} else {
		header["Content-Type"] = "text/html; charset=\"UTF-8\""
	}

	// Write headers in order
	for _, k := range []string{"From", "To", "Subject", "MIME-Version", "Content-Type"} {
		if v, ok := header[k]; ok {
			fmt.Fprintf(&msg, "%s: %s\r\n", k, v)
		}
	}
	fmt.Fprint(&msg, "\r\n")

	if len(attachments) > 0 {
		// multipart/mixed with attachments
		fmt.Fprintf(&msg, "--%s\r\n", boundary)
		fmt.Fprint(&msg, "Content-Type: text/html; charset=\"UTF-8\"\r\n\r\n")
		fmt.Fprint(&msg, htmlContent)
		fmt.Fprint(&msg, "\r\n")

		for filename, fileData := range attachments {
			fmt.Fprintf(&msg, "--%s\r\n", boundary)

			mimeType := mime.TypeByExtension(filepath.Ext(filename))
			if mimeType == "" {
				mimeType = "application/octet-stream"
			}

			fmt.Fprintf(&msg, "Content-Type: %s\r\n", mimeType)
			fmt.Fprintf(&msg, "Content-Disposition: attachment; filename=\"%s\"\r\n", filename)
			fmt.Fprintf(&msg, "Content-Transfer-Encoding: base64\r\n\r\n")

			encoded := encodeBase64(fileData)
			fmt.Fprint(&msg, encoded)
			fmt.Fprint(&msg, "\r\n")
		}
		fmt.Fprintf(&msg, "--%s--\r\n", boundary)
	} else {
		// no attachments, just HTML
		fmt.Fprint(&msg, htmlContent)
	}

	auth := smtp.PlainAuth("", gmailUser, gmailPassword, smtpHost)

	// Connect to the SMTP server
	client, err := smtp.Dial(smtpHost + ":" + smtpPort)
	if err != nil {
		return err
	}
	defer client.Quit()

	// Start TLS
	tlsconfig := &tls.Config{
		ServerName: smtpHost,
	}
	if err = client.StartTLS(tlsconfig); err != nil {
		return err
	}

	if err = client.Auth(auth); err != nil {
		return err
	}

	if err = client.Mail(from); err != nil {
		return err
	}
	for _, addr := range to {
		if err = client.Rcpt(addr); err != nil {
			return err
		}
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	_, err = w.Write(msg.Bytes())
	if err != nil {
		return err
	}
	err = w.Close()
	if err != nil {
		return err
	}

	log.Printf("Email sent to %s\n", toEmail)
	return nil
}

func encodeBase64(data []byte) string {
	const maxLineLength = 76
	encoded := base64.StdEncoding.EncodeToString(data)

	var buf bytes.Buffer
	for i := 0; i < len(encoded); i += maxLineLength {
		end := i + maxLineLength
		if end > len(encoded) {
			end = len(encoded)
		}
		buf.WriteString(encoded[i:end])
		buf.WriteString("\r\n")
	}
	return buf.String()
}

// Các hàm gửi email cụ thể tương tự Python, ví dụ:

func SendOtpEmail(email, otpCode string) error {
	slog.Info("Gửi email OTP đến:", "email", email)
	slog.Info("Mã OTP:", "otpCode", otpCode)
	subject := "Your OTP Code"
	htmlContent := fmt.Sprintf(`
        <html>
        <body>
            <h3>Mã OTP của bạn là: <strong>%s</strong></h3>
            <p>Mã chỉ có hiệu lực 5 phút</p>
        </body>
        </html>`, otpCode)

	return SendEmail(email, subject, htmlContent, nil)
}

func SendNewPasswordEmail(email, newPassword string) error {
	subject := "Mật khẩu mới của bạn"
	htmlContent := fmt.Sprintf(`
        <html>
        <body>
            <h3>Mật khẩu mới của bạn là: <strong>%s</strong></h3>
            <p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập để đảm bảo an toàn.</p>
        </body>
        </html>`, newPassword)

	return SendEmail(email, subject, htmlContent, nil)
}

func SendInvoiceEmail(email string, pdfBytes []byte, orderID string) error {
	subject := fmt.Sprintf("Hóa đơn mua hàng #%s", orderID)
	htmlContent := `
        <html>
        <body>
            <h3>Cảm ơn bạn đã mua hàng tại Medicare!</h3>
            <p>Hóa đơn mua hàng của bạn được đính kèm trong email này.</p>
        </body>
        </html>`

	attachments := map[string][]byte{
		fmt.Sprintf("%s.pdf", orderID): pdfBytes,
	}

	return SendEmail(email, subject, htmlContent, attachments)
}

func SendNewPharmacistEmail(email, otpCode, password string) error {
	subject := "Tài khoản dược sĩ của bạn đã được tạo"
	htmlContent := fmt.Sprintf(`
        <html>
        <body>
            <h3>Mã OTP của bạn là: <strong>%s</strong></h3>
            <p>Mã chỉ có hiệu lực 5 phút. Vui lòng xác thực tài khoản trước khi đăng nhập</p>
            <h3>Mật khẩu của bạn là: <strong>%s</strong></h3>
            <p>Vui lòng đăng nhập và đổi mật khẩu sau khi đăng nhập để đảm bảo an toàn.</p>
        </body>
        </html>`, otpCode, password)

	return SendEmail(email, subject, htmlContent, nil)
}
