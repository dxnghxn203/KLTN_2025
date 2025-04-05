package statics

var (
	StatusQueueName      = "UPDATE_STATUS"
	StatusQueueNameRetry = "UPDATE_STATUS_RETRY"
	StatusMapping        = map[string]string{
		"0":  "created",
		"1":  "waiting_to_pick",
		"2":  "picking",
		"3":  "delivering",
		"4":  "delivery_success",
		"5":  "delivery_part_success",
		"6":  "delivery_part_waiting_to_return",
		"7":  "delivery_part_returned",
		"8":  "delivery_fail",
		"9":  "waiting_to_return",
		"10": "returned",
		"11": "canceled",
	}
)
