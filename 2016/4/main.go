package main

import (
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
)

type Room struct {
	name     string
	sectorID int
	checksum string
}

func (r *Room) LetterCount() map[string]int {
	letterCount := make(map[string]int, 0)
	for _, letter := range r.name {
		letterCount[string(letter)]++
	}
	return letterCount
}

func (r *Room) Decode() string {
	decoded := make([]rune, len(r.name))
	for i, letter := range r.name {
		decoded[i] = shiftLetter(letter, r.sectorID)
	}
	return string(decoded)
}

func (r *Room) isValid() bool {
	letterCount := r.LetterCount()

	countToLetter := make(map[int][]string, 0)
	for letter, count := range letterCount {
		countToLetter[count] = append(countToLetter[count], letter)
		sort.Strings(countToLetter[count])
	}

	type Count = struct {
		count   int
		letters []string
	}
	counts := make([]Count, 0)
	for count, letters := range countToLetter {
		counts = append(counts, Count{count, letters})
	}
	sort.Slice(counts, func(i, j int) bool {
		return counts[i].count > counts[j].count
	})

	count := 0
	for _, c := range counts {
		for _, l := range c.letters {
			if r.checksum[count] != l[0] {
				return false
			}
			if count >= 4 {
				return true
			}
			if count >= len(r.checksum)-1 {
				return true
			}
			count++
		}
	}

	return true
}

func parseLine(s string) Room {
	s1 := strings.Split(s, "-")
	last := s1[len(s1)-1]
	words := s1[:len(s1)-1]
	secAndCheck := strings.Split(last, "[")
	sector := secAndCheck[0]
	sectorID, _ := strconv.Atoi(sector)
	checksum := secAndCheck[1]
	checksum = strings.Split(checksum, "]")[0]
	name := strings.Join(words, "")

	return Room{
		name:     name,
		sectorID: sectorID,
		checksum: checksum,
	}
}

func shiftLetter(c rune, times int) rune {
	// '-' was stripped out in parseLine
	if c == '-' {
		return ' '
	}
	return ((c - 'a' + rune(times)) % 26) + 'a'
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	rooms := make([]Room, len(lines))
	for i, l := range lines {
		rooms[i] = parseLine(l)
	}

	realRoomSectorIdSum := 0
	northPoleRoomSectorId := 0
	for _, r := range rooms {
		if r.isValid() {
			realRoomSectorIdSum += r.sectorID
			if strings.HasPrefix(r.Decode(), "north") {
				northPoleRoomSectorId = r.sectorID
			}

		}
	}

	fmt.Println(realRoomSectorIdSum)
	fmt.Println(northPoleRoomSectorId)
}
