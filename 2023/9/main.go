package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

func parseLine(line string) []int {
	strs := strings.Split(line, " ")
	nums := make([]int, len(strs))
	for i, str := range strs {
		nums[i], _ = strconv.Atoi(str)
	}
	return nums
}

func buildHistory(nums []int) [][]int {
	history := [][]int{nums}
	for {
		lastRow := history[len(history)-1]
		newRow := make([]int, len(lastRow)-1)

		shouldContinue := false
		for i := range newRow {
			diff := lastRow[i+1] - lastRow[i]
			newRow[i] = int(diff)
			if diff != 0 {
				shouldContinue = true
			}
		}

		history = append(history, newRow)

		if !shouldContinue {
			return history
		}
	}
}

func fillInPlaceholders(history [][]int) [][]int {
	// append zeros to each row
	for i := range history {
		history[i] = append(history[i], 0)
	}

	// do calcs
	for i := len(history) - 2; i >= 0; i-- {
		row := history[i]
		nextRow := history[i+1]
		row[len(row)-1] = row[len(row)-2] + nextRow[len(nextRow)-1]
	}

	return history
}

func fillInPlaceholdersPart2(history [][]int) [][]int {
	// prepend zeros to each row
	for i := range history {
		history[i] = append([]int{0}, history[i]...)
	}

	// do calcs
	for i := len(history) - 2; i >= 0; i-- {
		row := history[i]
		nextRow := history[i+1]
		row[0] = row[1] - nextRow[0]
	}

	return history
}

func getNextValue(history [][]int) int {
	return history[0][len(history[0])-1]
}

func getNextValuePart2(history [][]int) int {
	return history[0][0]
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	sum := 0
	for _, line := range lines {
		nums := parseLine(line)
		h := buildHistory(nums)
		p := fillInPlaceholdersPart2(h)
		v := getNextValuePart2(p)
		sum += v
	}

	fmt.Println(sum)
}
