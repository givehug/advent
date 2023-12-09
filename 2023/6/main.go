package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parseLine(line string) []int {
	strs := strings.Split(line, " ")
	var nums []int
	for _, str := range strs {
		if num, err := strconv.Atoi(str); err == nil {
			nums = append(nums, num)
		}
	}
	return nums
}

func parseLinePart2(line string) []int {
	strs := strings.Split(line, " ")
	conc := ""
	for _, str := range strs {
		if _, err := strconv.Atoi(str); err == nil {
			conc += str
		}
	}
	result := []int{0}
	result[0], _ = strconv.Atoi(conc)
	return result
}

func travel(speed int, time int) int {
	return speed * time
}

func testAllSpeeds(maxTime int, recordDistance int) []int {
	var distances []int
	speed := 1
	for {
		time := maxTime - speed
		dist := travel(speed, time)
		if dist > recordDistance {
			distances = append(distances, dist)
		}
		speed++
		if speed > maxTime {
			break
		}
	}
	return distances
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	times := parseLinePart2(lines[0])
	distances := parseLinePart2(lines[1])

	result := 1
	for i := range times {
		testResults := testAllSpeeds(times[i], distances[i])
		winCount := len(testResults)
		result *= winCount
	}

	fmt.Println(result)
}
