package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"tracking-consumer/pkg/database"
	"tracking-consumer/queue"

	log "github.com/sirupsen/logrus"
	"github.com/subosito/gotenv"
)

func init() {
	err := gotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	log.SetFormatter(&log.JSONFormatter{})
	log.SetOutput(os.Stdout)
}

func main() {
	quit := make(chan bool)
	manager := &queue.Manager{Quit: quit}
	ctx, cancelF := context.WithCancel(context.Background())
	err := database.ConnectDB()
	if err != nil {
		slog.Error("Không thể kết nối đến mongodb.")
		slog.Info(err.Error())
	}

	err = database.ConnectRedis()
	if err != nil {
		slog.Error("Không thể kết nối đến redis.")
		slog.Info(err.Error())
	}

	wg := sync.WaitGroup{}
	manager.Run(
		ctx,
		cancelF,
		&wg,
		queue.NewCreateQueue(),
	)
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		log.Info("worker is shutting down")
		defer close(sigs)
		cancelF()
		quit <- true
	}()
	<-quit
	wg.Wait()
}
