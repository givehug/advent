package main

import (
	"fmt"
	"os"
	"strconv"
	"strings"
)

type Command struct {
	name   string
	row    int
	col    int
	rotate int
	w      int
	h      int
}

func (cmd *Command) parse(s string) {
	split := strings.Split(s, " ")

	cmd.name = split[0]
	rowOrCol := split[1]

	if cmd.name == "rect" {
		dim := strings.Split(split[1], "x")
		cmd.w, _ = strconv.Atoi(dim[0])
		cmd.h, _ = strconv.Atoi(dim[1])
	} else if rowOrCol == "row" {
		cmd.name = "rotateRow"
		cmd.row, _ = strconv.Atoi(strings.Split(split[2], "=")[1])
		cmd.rotate, _ = strconv.Atoi(split[4])
	} else {
		cmd.name = "rotateCol"
		cmd.col, _ = strconv.Atoi(strings.Split(split[2], "=")[1])
		cmd.rotate, _ = strconv.Atoi(split[4])
	}
}

type Screen struct {
	screen [][]bool
	width  int
	height int
}

func NewScreen(width, height int) Screen {
	screen := make([][]bool, height)
	for i := range screen {
		screen[i] = make([]bool, width)
	}
	return Screen{screen, width, height}
}

func (s *Screen) rect(w, h int) {
	for row := 0; row < h; row++ {
		for col := 0; col < w; col++ {
			s.screen[row][col] = true
		}
	}
}

func (s *Screen) rotateRow(row, by int) {
	for i := 0; i < by; i++ {
		tmp := s.screen[row][len(s.screen[row])-1]
		for col := len(s.screen[row]) - 1; col > 0; col-- {
			s.screen[row][col] = s.screen[row][col-1]
		}
		s.screen[row][0] = tmp
	}
}

func (s *Screen) rotateCol(col, by int) {
	for i := 0; i < by; i++ {
		tmp := s.screen[len(s.screen)-1][col]
		for row := len(s.screen) - 1; row > 0; row-- {
			s.screen[row][col] = s.screen[row-1][col]
		}
		s.screen[0][col] = tmp
	}
}

func (s *Screen) processCommand(cmd Command) {
	switch cmd.name {
	case "rect":
		s.rect(cmd.w, cmd.h)
	case "rotateRow":
		s.rotateRow(cmd.row, cmd.rotate)
	case "rotateCol":
		s.rotateCol(cmd.col, cmd.rotate)
	}
}

func (s *Screen) countLit() int {
	count := 0
	for _, row := range s.screen {
		for _, col := range row {
			if col {
				count++
			}
		}
	}
	return count
}

func (s *Screen) print() {
	for _, row := range s.screen {
		for _, col := range row {
			if col {
				fmt.Print("@")
			} else {
				fmt.Print(" ")
			}
		}
		fmt.Println()
	}
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	commands := make([]Command, len(lines))
	for i, line := range lines {
		commands[i].parse(line)
	}

	s := NewScreen(50, 6)
	for _, cmd := range commands {
		s.processCommand(cmd)
	}

	s.print()
}
