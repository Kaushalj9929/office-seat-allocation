package utils

import "errors"

var (
	ErrNotFound          = errors.New("resource not found")
	ErrUnauthorized      = errors.New("unauthorized")
	ErrForbidden         = errors.New("forbidden")
	ErrValidation        = errors.New("validation error")
	ErrConflict          = errors.New("resource already exists")
	ErrInternalServer    = errors.New("internal server error")
	ErrCapacityExceeded  = errors.New("capacity exceeded")
	ErrInvalidAdvance    = errors.New("2-day advance notice required")
)
