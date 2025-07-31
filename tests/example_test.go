package example

import (
	"testing"
)

// TestFunctionality tests the main functionality of the generic function
func TestFunctionality(t *testing.T) {
	tests := []struct {
		name     string
		input    []int
		expected []int
	}{
		{"Empty slice", []int{}, []int{}},
		{"Single element", []int{1}, []int{1}},
		{"Multiple elements", []int{1, 2, 3}, []int{1, 2, 3}},
		{"Negative elements", []int{-1, -2, -3}, []int{-1, -2, -3}},
		{"Mixed elements", []int{-1, 0, 1}, []int{-1, 0, 1}},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := GenericFunction(tt.input)
			if !equal(result, tt.expected) {
				t.Errorf("expected %v, got %v", tt.expected, result)
			}
		})
	}
}

// TestErrorHandling tests the error handling of the generic function
func TestErrorHandling(t *testing.T) {
	tests := []struct {
		name     string
		input    []int
		expectErr bool
	}{
		{"Nil input", nil, true},
		{"Invalid input type", []int{1, 2, 'a'}, true}, // Assuming the function should only accept int
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := GenericFunctionWithErrorHandling(tt.input)
			if (err != nil) != tt.expectErr {
				t.Errorf("expected error: %v, got: %v", tt.expectErr, err != nil)
			}
		})
	}
}

// equal checks if two slices are equal
func equal(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

// TestSetupTeardown tests setup and teardown functionality
func TestSetupTeardown(t *testing.T) {
	// Setup
	setup := func() []int {
		return []int{1, 2, 3}
	}
	teardown := func() {
		// Cleanup logic here
	}

	t.Run("Test with setup and teardown", func(t *testing.T) {
		defer teardown()
		input := setup()
		expected := []int{1, 2, 3}
		result := GenericFunction(input)
		if !equal(result, expected) {
			t.Errorf("expected %v, got %v", expected, result)
		}
	})
}