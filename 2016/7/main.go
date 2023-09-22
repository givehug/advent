package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

func parseLine(s string) ([]string, []string) {
	rgx := regexp.MustCompile(`\[(.*?)\]`)

	rsInside := rgx.FindAllStringSubmatch(s, 10)
	insideBrackets := make([]string, 0)
	for _, r := range rsInside {
		insideBrackets = append(insideBrackets, r[1])
	}

	outBrackets := rgx.Split(s, 10)

	return outBrackets, insideBrackets
}

func hasAbba(s string) bool {
	for i := 0; i < len(s)-3; i++ {
		if s[i] == s[i+3] && s[i+1] == s[i+2] && s[i] != s[i+1] {
			return true
		}
	}
	return false
}

func getAba(s string) []string {
	result := make([]string, 0)
	for i := 0; i < len(s)-2; i++ {
		if s[i] == s[i+2] && s[i] != s[i+1] {
			result = append(result, s[i:i+3])
		}
	}
	return result
}

func abaToBab(aba string) string {
	return string([]byte{aba[1], aba[0], aba[1]})
}

func supportsTLS(s string) bool {
	out, in := parseLine(s)

	for _, x := range in {
		if hasAbba(x) {
			return false
		}
	}

	for _, x := range out {
		if hasAbba(x) {
			return true
		}
	}

	return false
}

func supportsSSL(s string) bool {
	out, in := parseLine(s)
	abas := make([]string, 0)

	for _, x := range out {
		abas = append(abas, getAba(x)...)
	}

	for _, aba := range abas {
		bab := abaToBab(aba)
		for _, x := range in {
			if strings.Contains(x, bab) {
				return true
			}
		}
	}

	return false
}

func main() {
	input, _ := os.ReadFile("input.txt")
	lines := strings.Split(string(input), "\n")

	tlsCount := 0
	for _, l := range lines {
		if supportsTLS(l) {
			tlsCount++
		}
	}

	sslCount := 0
	for _, l := range lines {
		if supportsSSL(l) {
			sslCount++
		}
	}

	fmt.Println(tlsCount)
	fmt.Println(sslCount)
}
