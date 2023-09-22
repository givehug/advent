package main

import (
	"fmt"
	"os"
	"strings"
)

type LetterCount map[rune]int

func (lc LetterCount) leastCommon() rune {
	min := 100000
	var minLetter rune
	for letter, count := range lc {
		if count < min {
			min = count
			minLetter = letter
		}
	}
	return minLetter
}

func (lc LetterCount) mostCommon() rune {
	max := 0
	var maxLetter rune
	for letter, count := range lc {
		if count > max {
			max = count
			maxLetter = letter
		}
	}
	return maxLetter
}

type PositionalLetterCount struct {
	letterCount []LetterCount
}

func (plc *PositionalLetterCount) countMore(s string) {
	for i, char := range s {
		if i >= len((*plc).letterCount) {
			(*plc).letterCount = append((*plc).letterCount, make(LetterCount))
		}
		n := (*plc).letterCount[i][char] + 1
		(*plc).letterCount[i][char] = n
	}
}

func (plc *PositionalLetterCount) joinMostCommon() string {
	result := ""
	for _, lc := range plc.letterCount {
		result += string(lc.mostCommon())
	}
	return result
}

func (plc *PositionalLetterCount) joinLeastCommon() string {
	result := ""
	for _, lc := range plc.letterCount {
		leastCommon := lc.leastCommon()
		result += string(leastCommon)
	}
	return result
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	plc := PositionalLetterCount{}
	for _, l := range lines {
		plc.countMore(l)
	}

	mostCommon := plc.joinMostCommon()
	leastCommon := plc.joinLeastCommon()

	fmt.Println(mostCommon, leastCommon)
}
