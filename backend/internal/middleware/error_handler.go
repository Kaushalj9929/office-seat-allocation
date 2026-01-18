package middleware

import (
	"net/http"
	"office-seat-allocation/backend/internal/utils"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Error ErrorDetail `json:"error"`
}

type ErrorDetail struct {
	Code    string   `json:"code"`
	Message string   `json:"message"`
	Details []string `json:"details,omitempty"`
}

func ErrorHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()

		if len(c.Errors) > 0 {
			err := c.Errors.Last().Err
			var code string
			var status int

			switch err {
			case utils.ErrNotFound:
				code = "NOT_FOUND"
				status = http.StatusNotFound
			case utils.ErrUnauthorized:
				code = "UNAUTHORIZED"
				status = http.StatusUnauthorized
			case utils.ErrForbidden:
				code = "FORBIDDEN"
				status = http.StatusForbidden
			case utils.ErrValidation:
				code = "VALIDATION_ERROR"
				status = http.StatusBadRequest
			case utils.ErrConflict:
				code = "CONFLICT"
				status = http.StatusConflict
			case utils.ErrCapacityExceeded:
				code = "CAPACITY_EXCEEDED"
				status = http.StatusBadRequest
			case utils.ErrInvalidAdvance:
				code = "INVALID_ADVANCE_NOTICE"
				status = http.StatusBadRequest
			default:
				code = "INTERNAL_ERROR"
				status = http.StatusInternalServerError
			}

			c.JSON(status, ErrorResponse{
				Error: ErrorDetail{
					Code:    code,
					Message: err.Error(),
				},
			})
		}
	}
}
