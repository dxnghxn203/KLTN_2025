package api

import (
	"encoding/json"
	"hook/models"
	"hook/pkg/rabbitmq"
	"log/slog"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

var timeString = time.Now().Format(time.RFC3339Nano)

type MedicareAPI struct {
	statusQueue *rabbitmq.RabbitMQ
}

func (spx *MedicareAPI) UpdateStatus(c *gin.Context) {
	var model models.UpdateOrderStatusReq
	if err := c.ShouldBindJSON(&model); err != nil {
		slog.Error("can't parser req body err SC", "err", err)
		c.JSON(http.StatusPreconditionFailed, gin.H{"result": false, "msg": err.Error()})
		return
	}
	j, _ := json.Marshal(model)
	slog.Info("receive the msg SC", "mess", string(j), "time", timeString)

	modelMedicare, err := model.Mapping()
	if err != nil {
		slog.Error("push msg error SC", "error", err.Error(), "time", timeString)
		c.JSON(http.StatusBadRequest, gin.H{"result": false, "msg": err.Error()})
		return
	}

	if err := spx.statusQueue.Publish(modelMedicare); err != nil {
		slog.Error("push msg error SC", "mess", err.Error(), "time", timeString)
		c.JSON(http.StatusInternalServerError, gin.H{"result": false, "msg": "service unavailable"})
		return
	}

	j, _ = json.Marshal(modelMedicare)
	slog.Info("push msg done SC", "mess", string(j), "time", timeString)
	c.JSON(http.StatusOK, gin.H{"result": true, "msg": "Cập nhật trạng thái đơn hàng thành công"})
}
