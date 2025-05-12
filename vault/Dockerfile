FROM hashicorp/vault:latest

COPY ./vault.hcl /vault/config/vault.hcl

EXPOSE 8200

CMD ["vault", "server", "-config=/vault/config/vault.hcl"]
