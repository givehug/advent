package main

import (
	"fmt"
	"math"
	"strings"
)

const (
	MoveUp    Move = "U"
	MoveRight Move = "R"
	MoveDown  Move = "D"
	MoveLeft  Move = "L"
)

type Move = string

var keypad = [][]rune{
	{' ', ' ', '1', ' ', ' '},
	{' ', '2', '3', '4', ' '},
	{'5', '6', '7', '8', '9'},
	{' ', 'A', 'B', 'C', ' '},
	{' ', ' ', 'D', ' ', ' '},
}

type Key struct {
	value rune
	_row  int
	_col  int
}

func clamp(n, from, to int) int {
	return int(math.Max(math.Min(float64(n), float64(to)), float64(from)))
}

func (k *Key) move(m Move) {
	_row := k._row
	_col := k._col

	switch m {
	case MoveUp:
		_row -= 1
	case MoveDown:
		_row += 1
	case MoveLeft:
		_col -= 1
	case MoveRight:
		_col += 1
	}

	_row = clamp(_row, 0, 4)
	_col = clamp(_col, 0, 4)
	value := keypad[_row][_col]

	// revert to prev postion
	if value != ' ' {
		k.value = value
		k._row = _row
		k._col = _col
	}
}

func parseLine(s string) []Move {
	return strings.Split(s, "")
}

func main() {
	input := `ULL
	RRDDD
	LURDL
	UUUUD`
	lines := strings.Split(input, "\n")

	movesList := make([][]Move, len(lines))
	for i, line := range lines {
		movesList[i] = parseLine(line)
	}

	code := ""
	key := Key{'5', 2, 0}
	for _, ml := range movesList {
		for _, move := range ml {
			key.move(move)
		}
		code += fmt.Sprintf("%c", key.value)
	}

	fmt.Println(code)
}
