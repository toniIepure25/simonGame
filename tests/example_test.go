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

// TestEdgeCases tests edge cases for the generic function
func TestEdgeCases(t *testing.T) {
	tests := []struct {
		name     string
		input    []int
		expected []int
	}{
		{"Large numbers", []int{1000000, 2000000, 3000000}, []int{1000000, 2000000, 3000000}},
		{"Very large slice", make([]int, 1000000), make([]int, 1000000)},
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

// Helper function to compare slices
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