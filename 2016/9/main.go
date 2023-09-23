package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"
)

type Stringy struct {
	str       string
	pos       int
	out       string
	createdAt int64
	timestamp int64
}

func NewStringy(s string) *Stringy {
	return &Stringy{
		str:       s,
		out:       s,
		createdAt: time.Now().UnixMilli(),
		timestamp: time.Now().UnixMilli(),
	}
}

func (s *Stringy) reset() {
	s.str = s.out
	s.out = ""
	s.pos = 0
}

func (s *Stringy) logProgress(count int) {
	if time.Now().UnixMilli()-s.timestamp > 5000 {
		s.timestamp = time.Now().UnixMilli()
		fmt.Println("still going...", (time.Now().UnixMilli()-s.createdAt)/1000, "seconds", len(s.out))
	}
}

func (s *Stringy) decompress() {
	count := 0

	for true {
		count++
		s.logProgress(count)

		open := strings.IndexRune(s.out, '(')
		closed := strings.IndexRune(s.out, ')')

		if open == -1 || closed == -1 {
			return
		}

		marker := s.out[open+1 : closed]

		x := strings.IndexRune(marker, 'x')
		length, _ := strconv.Atoi(marker[:x])
		times, _ := strconv.Atoi(marker[x+1:])

		s.out = s.out[:open] + strings.Repeat(s.out[closed+1:closed+1+length], times) + s.out[closed+1+length:]
	}
}

func main() {
	input, _ := os.ReadFile("input.txt")

	s := NewStringy(string(input))
	// s := NewStringy("X(8x2)(3x3)ABCY")

	s.decompress()

	fmt.Println(len(s.out))
}
