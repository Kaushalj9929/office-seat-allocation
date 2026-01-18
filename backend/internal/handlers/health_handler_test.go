package handlers

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestHealthHandler(t *testing.T) {
	handler := NewHealthHandler()
	assert.NotNil(t, handler)
}
