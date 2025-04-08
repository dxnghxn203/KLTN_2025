package statics

var (
	StatusQueueName      = "UPDATE_STATUS"
	StatusQueueNameRetry = "UPDATE_STATUS_RETRY"
	StatusMapping        = map[string]string{
		"1": "waiting_to_pick",
		"2": "picking",
		"3": "delivering",
		"4": "delivery_success",
		"5": "delivery_fail",
		"6": "waiting_to_return",
		"7": "returned",
	}
)
