package helper

import (
	"bytes"
	"encoding/base64"
	"fmt"
	"log/slog"
	"os"
	"path/filepath"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type SendEmailRequest struct {
	ToEmails         []string
	Subject          string
	HtmlContent      string
	PlainTextContent string
	Attachments      map[string][]byte
}

func SendEmail(req SendEmailRequest) error {
	apiKey := os.Getenv("SENDGRID_API_KEY")
	fromEmail := os.Getenv("SENDGRID_GMAIL")

	if apiKey == "" || fromEmail == "" {
		return fmt.Errorf("missing SendGrid configuration: API key or sender email not found")
	}

	m := mail.NewV3Mail()

	from := mail.NewEmail("Tracking Manager", fromEmail)
	m.SetFrom(from)

	m.Subject = req.Subject

	p := mail.NewPersonalization()
	for _, toEmail := range req.ToEmails {
		to := mail.NewEmail("", toEmail)
		p.AddTos(to)
	}
	m.AddPersonalizations(p)

	if req.HtmlContent != "" {
		m.AddContent(mail.NewContent("text/html", req.HtmlContent))
	}

	if req.PlainTextContent != "" {
		m.AddContent(mail.NewContent("text/plain", req.PlainTextContent))
	}

	if len(req.Attachments) > 0 {
		for filename, content := range req.Attachments {
			attachment := mail.NewAttachment()
			attachment.SetContent(encodeBase64(content))
			attachment.SetType(getContentType(filename))
			attachment.SetFilename(filename)
			attachment.SetDisposition("attachment")
			m.AddAttachment(attachment)
		}
	}

	client := sendgrid.NewSendClient(apiKey)
	response, err := client.Send(m)

	if err != nil {
		slog.Error("Failed to send email", "error", err)
		return err
	}

	if response.StatusCode >= 400 {
		slog.Error("SendGrid API error",
			"status_code", response.StatusCode,
			"body", response.Body)
		return fmt.Errorf("failed to send email: status code %d", response.StatusCode)
	}

	slog.Info("Email sent successfully",
		"to", req.ToEmails,
		"status_code", response.StatusCode)
	return nil
}
func getContentType(filename string) string {
	ext := filepath.Ext(filename)
	switch ext {
	case ".pdf":
		return "application/pdf"
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".txt":
		return "text/plain"
	default:
		return "application/octet-stream"
	}
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

	return SendEmail(SendEmailRequest{
		ToEmails:    []string{email},
		Subject:     subject,
		HtmlContent: htmlContent,
	})
}

func SendInvoiceEmail(email string, pdfBytes []byte, orderID string) error {
	subject := fmt.Sprintf("Hóa đơn mua hàng #%s", orderID)
	slog.Info("Gửi email hóa đơn đến:", "email", email)
	slog.Info("Hóa đơn ID:", "orderID", orderID)
	htmlContent := `
        <html>
        <body>
            <h3>Thank you for shopping at Medicare!</h3>
            <p>Your purchase invoice is attached to this email.</p>
        </body>
        </html>`

	attachments := map[string][]byte{
		fmt.Sprintf("%s.pdf", orderID): pdfBytes,
	}

	return SendEmail(SendEmailRequest{
		ToEmails:    []string{email},
		Subject:     subject,
		HtmlContent: htmlContent,
		Attachments: attachments,
	})
}
