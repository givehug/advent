package main

import (
	"fmt"
	"os"
	"strings"
)

func parseLine(line string) (key, left, right string) {
	key = line[:3]
	left = line[7:10]
	right = line[12:15]
	return
}

func countSteps(network map[string][2]string, instructions string, key string) int {
	steps := 0
	for {
		for _, turn := range instructions {
			if turn == 'L' {
				key = network[key][0]
			} else if turn == 'R' {
				key = network[key][1]
			} else {
				panic("Unknown turn")
			}
			steps++
			if key[2] == 'Z' {
				return steps
			}
		}
	}
}

func allSame(x []int) bool {
	for i := 1; i < len(x); i++ {
		if x[i] != x[0] {
			return false
		}
	}
	return true
}

func countStepsP2(network map[string][2]string, instructions string) int {
	var keys []string
	for key := range network {
		if key[2] == 'A' {
			keys = append(keys, key)
		}
	}

	originalSteps := make([]int, len(keys))
	steps := make([]int, len(keys))
	for i, key := range keys {
		originalSteps[i] = countSteps(network, instructions, key)
		steps[i] = originalSteps[i]
	}

	// looking for LCM
	for {
		smallestIndex := 0
		for i := range steps {
			if i == 0 {
				continue
			}
			if steps[i] < steps[smallestIndex] {
				smallestIndex = i
			}
		}
		steps[smallestIndex] += originalSteps[smallestIndex]
		if allSame(steps) {
			return steps[0]
		}
	}
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	instructions := lines[0]

	network := make(map[string][2]string)
	for _, line := range lines[2:] {
		key, left, right := parseLine(line)
		network[key] = [2]string{left, right}
	}

	steps := countStepsP2(network, instructions)

	fmt.Println(steps)
}
