package server

import (
	"fmt"
	"log/slog"
)

func Init() {
	r := NewRouter()
	port := "10001"
	slog.Info(fmt.Sprintf("Service running at: %s", port))
	r.Run(fmt.Sprintf(":%s", port))

}
