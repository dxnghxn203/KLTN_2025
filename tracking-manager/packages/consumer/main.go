package main

import (
	"context"
	"encoding/json"
	"log"
	"os"

	amqp "github.com/rabbitmq/amqp091-go"
	"github.com/redis/go-redis/v9"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TrackingEvent struct {
	EventType string                 `json:"event_type"`
	Data      map[string]interface{} `json:"data"`
	Timestamp string                 `json:"timestamp"`
}

func main() {
	ctx := context.Background()

	// Connect to Redis
	rdb := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST") + ":6379",
		DB:   0,
	})

	// Connect to MongoDB
	mongoClient, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_URI")))
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}
	defer mongoClient.Disconnect(ctx)

	collection := mongoClient.Database("tracking_db").Collection("events")

	// Connect to RabbitMQ
	conn, err := amqp.Dial(os.Getenv("RABBITMQ_URL"))
	if err != nil {
		log.Fatalf("Failed to connect to RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Failed to open channel: %v", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"tracking_events",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to declare queue: %v", err)
	}

	msgs, err := ch.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Failed to register consumer: %v", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			var event TrackingEvent
			if err := json.Unmarshal(d.Body, &event); err != nil {
				log.Printf("Error parsing message: %v", err)
				continue
			}

			// Process event from Redis
			eventKey := "event:" + event.Timestamp
			val, err := rdb.Get(ctx, eventKey).Result()
			if err == nil {
				log.Printf("Found in Redis: %s", val)
			}

			// Process event from MongoDB
			var result TrackingEvent
			err = collection.FindOne(ctx, map[string]string{
				"event_type": event.EventType,
				"timestamp":  event.Timestamp,
			}).Decode(&result)
			if err == nil {
				log.Printf("Found in MongoDB: %+v", result)
			}

			log.Printf("Processed event: %+v", event)
		}
	}()

	log.Println("Consumer started. Waiting for messages...")
	<-forever
}
