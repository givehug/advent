package main

import (
	"fmt"
	"math"
	"strconv"
	"strings"
)

const (
	DirectionUp    Direction = "up"
	DirectionDown  Direction = "down"
	DirectionLeft  Direction = "left"
	DirectionRight Direction = "right"
)

const (
	TurnLeft  Turn = "L"
	TurnRight Turn = "R"
)

type Direction = string

type Turn = string

type Instruction struct {
	turn   Turn
	blocks int
}

func getNextDirection(d Direction, t Turn) Direction {
	if t == TurnLeft {
		switch d {
		case DirectionUp:
			return DirectionLeft
		case DirectionLeft:
			return DirectionDown
		case DirectionDown:
			return DirectionRight
		case DirectionRight:
			return DirectionUp
		}
	}
	if t == TurnRight {
		switch d {
		case DirectionUp:
			return DirectionRight
		case DirectionLeft:
			return DirectionUp
		case DirectionDown:
			return DirectionLeft
		case DirectionRight:
			return DirectionDown
		}
	}
	return d
}

func parseInstruction(s string) (Turn, int) {
	blocks, _ := strconv.Atoi(s[1:])
	turn := Turn(s[0:1])
	return turn, blocks
}

func main() {
	input := strings.Split(`R8, R4, R4, R8`, ", ")

	instructions := make([]Instruction, len(input))
	for i, s := range input {
		turn, blocks := parseInstruction(s)
		instructions[i] = Instruction{turn, blocks}
	}

	type Location [2]int
	locationHistory := make(map[Location]bool)
	loc := Location{0, 0}
	d := DirectionUp

Outer:
	for _, ins := range instructions {
		d = getNextDirection(d, ins.turn)

		for b := 0; b < ins.blocks; b++ {
			switch d {
			case DirectionUp:
				loc[1] += 1
			case DirectionDown:
				loc[1] -= 1
			case DirectionLeft:
				loc[0] -= 1
			case DirectionRight:
				loc[0] += 1
			}

			if _, ok := locationHistory[loc]; ok {
				break Outer // visited twice
			}
			locationHistory[loc] = true
		}

	}

	blocksAway := math.Abs(float64(loc[0])) + math.Abs(float64(loc[1]))

	fmt.Println(blocksAway)
}
