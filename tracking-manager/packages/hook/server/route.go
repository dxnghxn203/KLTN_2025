package server

import (
	"fmt"
	"hook/api"
	"hook/auth"
	"hook/pkg/rabbitmq"
	"hook/statics"
	"os"

	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {
	gin.SetMode(gin.ReleaseMode)
	router := gin.New()

	amqpURL := fmt.Sprintf("amqp://%s:%s@%s:%s/", os.Getenv("RABBITMQ_USER"), os.Getenv("RABBITMQ_PW"), os.Getenv("RABBITMQ_HOST"), os.Getenv("RABBITMQ_PORT"))
	queueName := statics.StatusQueueName
	queueRetryName := statics.StatusQueueNameRetry
	rabbitMq := rabbitmq.New(amqpURL, queueName, queueRetryName)
	apiHandler := api.NewAPI(rabbitMq)

	router.Use(gin.Recovery())

	jwtAuth, err := auth.NewJWTAuth()
	if err != nil {
		panic(fmt.Sprintf("Failed to initialize JWTAuth: %v", err))
	}

	router.GET("/api/v1/verify-api-key", func(c *gin.Context) {
		clientPublicKey := c.Query("verify_token")

		if clientPublicKey == "" {
			c.AbortWithStatusJSON(400, gin.H{"error": "Missing verify_token parameter"})
			return
		}

		if jwtAuth.VerifyPublicKey(clientPublicKey) {
			c.JSON(200, gin.H{"message": "Valid API Key"})
		} else {
			c.AbortWithStatusJSON(401, gin.H{"error": "Invalid API Key"})
		}
	})

	router.GET("/", func(c *gin.Context) {
		c.String(200, "%s", "medicare-hook")
	})

	apiKeyMiddleware := func(c *gin.Context) {
		clientPublicKey := c.Query("verify_token")
		if clientPublicKey == "" || !jwtAuth.VerifyPublicKey(clientPublicKey) {
			c.AbortWithStatusJSON(401, gin.H{"error": "Unauthorized"})
			return
		}

		c.Next()
	}

	authorizedHook := router.Group("api/v1/webhook")
	authorizedHook.Use(apiKeyMiddleware)

	authorizedHook.POST("/shipment/status", apiHandler.UpdateStatus)
	return router
}
