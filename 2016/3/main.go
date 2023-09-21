package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Triangle struct {
	l, w, h int
}

func (t *Triangle) isValid() bool {
	return t.l+t.w > t.h && t.l+t.h > t.w && t.w+t.h > t.l
}

func parseLine(s string) (l, w, h int) {
	sides := strings.Fields(strings.TrimSpace(s))
	l, _ = strconv.Atoi(sides[0])
	w, _ = strconv.Atoi(sides[1])
	h, _ = strconv.Atoi(sides[2])
	return l, w, h
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	triangles := make([]Triangle, len(lines))

	ls := make([]int, 3)
	hs := make([]int, 3)
	ws := make([]int, 3)

	for i, line := range lines {
		x1, x2, x3 := parseLine(line)

		if i%3 == 0 {
			ls[0] = x1
			ls[1] = x2
			ls[2] = x3
		} else if i%3 == 1 {
			ws[0] = x1
			ws[1] = x2
			ws[2] = x3
		} else {
			hs[0] = x1
			hs[1] = x2
			hs[2] = x3
			triangles[i-2] = Triangle{ls[0], ws[0], hs[0]}
			triangles[i-1] = Triangle{ls[1], ws[1], hs[1]}
			triangles[i] = Triangle{ls[2], ws[2], hs[2]}
		}
	}

	validCount := 0
	for _, t := range triangles {
		if t.isValid() {
			validCount++
		}
	}

	fmt.Println(validCount)
}
