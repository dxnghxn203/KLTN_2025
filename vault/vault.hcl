listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1
}

storage "file" {
  path = "/vault/data"
}

seal "transit" {
  address = "http://127.0.0.1:8200"
  token   = "6rFNG2xa/x9B6DnArtP3WG/BSxfbuRnbKrGmk+Sebjc="
}

api_addr = "http://127.0.0.1:8200"

ui = true
