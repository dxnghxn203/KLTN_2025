FROM golang:1.22-alpine AS builder

RUN echo "Installing system dependencies..." && \
    apk update && \
    apk add --no-cache bash make gcc musl-dev

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main .

# Final image with wkhtmltopdf
FROM ubuntu:22.04

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && \
    apt-get install -y \
        wkhtmltopdf \
        ca-certificates \
        tzdata \
        bash && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/main /app/main
COPY --from=builder /app/.env /app/.env

EXPOSE 10000

CMD ["/app/main"]
