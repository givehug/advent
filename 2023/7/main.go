package main

import (
	"os"
	"slices"
	"strconv"
	"strings"
)

var cardsValues = map[byte]int{
	'A': 13,
	'K': 12,
	'Q': 11,
	'J': 10,
	'T': 9,
	'9': 8,
	'8': 7,
	'7': 6,
	'6': 5,
	'5': 4,
	'4': 3,
	'3': 2,
	'2': 1,
}

type Hand string

type CardCount map[rune]int

type HandWithBid struct {
	hand      Hand
	jokerHand Hand // with Joker rule applied
	bid       int
}

func countCards(hand Hand) (CardCount, rune) {
	cardCount := CardCount{}
	mostFrequent := '_'
	mostFrequentCount := 0
	for _, card := range hand {
		newCount := cardCount[card] + 1
		cardCount[card]++
		if newCount > mostFrequentCount && card != 'J' {
			mostFrequent = card
			mostFrequentCount = newCount
		}
	}
	return cardCount, mostFrequent
}

func isFiveOfAKind(hand Hand) bool {
	return hand[0] == hand[1] && hand[1] == hand[2] && hand[2] == hand[3] && hand[3] == hand[4]
}

func isFourOfAKind(hand Hand) bool {
	cards, _ := countCards(hand)
	for _, count := range cards {
		if count == 4 {
			return true
		}
	}
	return false
}

func isFullHouse(hand Hand) bool {
	cards, _ := countCards(hand)
	for _, count := range cards {
		if count < 2 || count > 3 {
			return false
		}
	}
	return true
}

func isThreeOfAKind(hand Hand) bool {
	cards, _ := countCards(hand)
	if len(cards) != 3 {
		return false
	}
	for _, count := range cards {
		if count != 1 && count != 3 {
			return false
		}
	}
	return true
}

func isTwoPair(hand Hand) bool {
	cards, _ := countCards(hand)
	if len(cards) != 3 {
		return false
	}
	for _, count := range cards {
		if count != 1 && count != 2 {
			return false
		}
	}
	return true
}

func isOnePair(hand Hand) bool {
	cards, _ := countCards(hand)
	if len(cards) != 4 {
		return false
	}
	for _, count := range cards {
		if count != 1 && count != 2 {
			return false
		}
	}
	return true
}

func applyJokerRule(hand Hand) Hand {
	if !strings.Contains(string(hand), "J") {
		return hand
	}
	if isFiveOfAKind(hand) {
		return hand
	}
	_, mostFrequent := countCards(hand)
	return Hand(strings.ReplaceAll(string(hand), "J", string(mostFrequent)))
}

func handValue(hand Hand) int {
	if isFiveOfAKind(hand) {
		return 7
	}
	if isFourOfAKind(hand) {
		return 6
	}
	if isFullHouse(hand) {
		return 5
	}
	if isThreeOfAKind(hand) {
		return 4
	}
	if isTwoPair(hand) {
		return 3
	}
	if isOnePair(hand) {
		return 2
	}
	return 1
}

func compareHands(hand1 HandWithBid, hand2 HandWithBid) int {
	hand1Value := handValue(hand1.jokerHand)
	hand2Value := handValue(hand2.jokerHand)
	if hand1Value > hand2Value {
		return 1
	}
	if hand1Value < hand2Value {
		return -1
	}
	for i := 0; i < 5; i++ {
		value1 := cardsValues[hand1.hand[i]]
		value2 := cardsValues[hand2.hand[i]]
		if value1 > value2 {
			return 1
		}
		if value1 < value2 {
			return -1
		}
	}
	panic("equal hands" + string(hand1.hand) + " " + string(hand2.hand))
}

func parseLine(line string) (hand Hand, bid int) {
	strs := strings.Split(line, " ")
	hand = Hand(strs[0])
	bid, _ = strconv.Atoi(strs[1])
	return hand, bid
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	withJokerRule := true // p1 or p2

	if withJokerRule {
		cardsValues['J'] = 0
	}

	handsAndBids := make([]HandWithBid, len(lines))
	for i, line := range lines {
		hand, bid := parseLine(line)
		hwb := HandWithBid{
			hand:      hand,
			jokerHand: hand,
			bid:       bid,
		}
		if withJokerRule {
			hwb.jokerHand = applyJokerRule(hwb.hand)
		}
		handsAndBids[i] = hwb
	}

	slices.SortStableFunc(handsAndBids, compareHands)

	result := 0
	for i, hab := range handsAndBids {
		mul := i + 1
		result += mul * hab.bid
	}

	println(result)
}
