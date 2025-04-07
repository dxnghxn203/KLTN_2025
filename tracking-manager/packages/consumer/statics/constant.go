package statics

var (
	CreateOrderQueueName            = "CREATE_ORDER"
	CreateOrderQueueNameRetry       = "CREATE_ORDER_RETRY"
	UpdateQueueName                 = "UPDATE_STATUS"
	UpdateQueueNameRetry            = "UPDATE_STATUS_RETRY"
	MaxRetry                  int64 = 3
	RetryInSeconds                  = "5"
)
