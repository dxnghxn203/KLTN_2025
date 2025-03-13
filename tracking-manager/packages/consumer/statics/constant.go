package statics

var (
	CreateOrderQueueName               = "CREATE_ORDER"
	CreateOrderQueueNameRetry          = "CREATE_ORDER_RETRY"
	CreateTrackingQueueName            = "CREATE_TRACKING"
	CreateTrackingQueueNameRetry       = "CREATE_TRACKING_RETRY"
	MaxRetry                     int64 = 3
	RetryInSeconds                     = "5"
)
