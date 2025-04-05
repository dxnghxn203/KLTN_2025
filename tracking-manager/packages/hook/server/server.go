package server

import (
	"fmt"
	"log/slog"
	"os"
)

func Init() {
	r := NewRouter()
	slog.Info(fmt.Sprintf("Service running at: %s", os.Getenv("MEDICARE_PORT")))
	r.Run(fmt.Sprintf(":%s", os.Getenv("MEDICARE_PORT")))

}
