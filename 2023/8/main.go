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

// func countSteps(network map[string][2]string, instructions string) int {
// 	key := "AAA"
// 	steps := 0
// 	for {
// 		for _, turn := range instructions {
// 			if turn == 'L' {
// 				key = network[key][0]
// 			} else if turn == 'R' {
// 				key = network[key][1]
// 			} else {
// 				panic("Unknown turn")
// 			}
// 			steps++
// 			if key == "ZZZ" {
// 				return steps
// 			}
// 		}
// 	}
// }

func countStepsP2(network map[string][2]string, instructions string) int {
	var keys []string
	for key := range network {
		if key[2] == 'A' {
			keys = append(keys, key)
		}
	}

	steps := 0
	for {
		for _, turn := range instructions {
			shouldContinue := false
			for i, key := range keys {
				nextKey := ""
				if turn == 'L' {
					nextKey = network[key][0]
				} else if turn == 'R' {
					nextKey = network[key][1]
				} else {
					panic("Unknown turn")
				}
				if nextKey[2] != 'Z' {
					shouldContinue = true
				}
				keys[i] = nextKey
			}
			steps++
			if !shouldContinue {
				return steps
			}
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
