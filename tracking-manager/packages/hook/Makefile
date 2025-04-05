# .PHONY: install format test clean build run api-doc modelgen codegen-help codegen dbmodelgen
.PHONY: run

# Set default env as develop.
ifeq ($(ENV),)
ENV := develop
endif

-include .env

# ROLES := admin customer

# # Declare directories
# API_DOC_DIR := ./docs

install:
	go mod download
	go install github.com/cosmtrek/air@v1.45.0
# 	go install github.com/volatiletech/sqlboiler/v4@v4.15.0
# 	go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@v1.15.0

run:
	air -c .air.toml

format:
	go fmt ./...
