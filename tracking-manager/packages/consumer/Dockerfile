FROM golang:1.22-alpine AS builder


RUN echo "Installing system dependencies..." && \
    apk update && apk add --no-cache \
    bash \
    make \
    gcc \
    musl-dev \
    ca-certificates \
    tzdata \
    curl \
    xz

RUN curl -L -o /tmp/wkhtmltox.tar.xz https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download/0.12.6/wkhtmltox-0.12.6-1.alpine3.17_amd64.tar.xz && \
    tar -xJf /tmp/wkhtmltox.tar.xz -C /tmp && \
    cp /tmp/wkhtmltox/bin/wkhtmltopdf /usr/local/bin/ && \
    chmod +x /usr/local/bin/wkhtmltopdf && \
    wkhtmltopdf --version

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main .

FROM alpine:latest

RUN apk add --no-cache bash ca-certificates tzdata

WORKDIR /app

COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env
COPY --from=builder /usr/local/bin/wkhtmltopdf /usr/local/bin/wkhtmltopdf

EXPOSE 10000

CMD ["/app/main"]