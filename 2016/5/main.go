package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
)

type Hash struct {
	count int
	hash  string
}

func getPassword(input string, difficulty int) string {
	count := 0
	hash := ""
	saneLimit := 1000000000
	difficultyString := strings.Repeat("0", difficulty)
	foundHashes := make([]Hash, 0)
	pwd := ""

	for count < saneLimit && len(foundHashes) < 8 {
		s := md5.Sum([]byte(fmt.Sprintf("%s%d", input, count)))
		hash = hex.EncodeToString(s[:])

		if strings.HasPrefix(hash, difficultyString) {
			foundHashes = append(foundHashes, Hash{count, hash})
			pwd = pwd + string(hash[5])
		}

		count++
	}

	return pwd
}

func getPassword2(input string, difficulty int) string {
	count := 0
	difficultyString := strings.Repeat("0", difficulty)
	foundChars := 0
	pwd := "________"

	for foundChars < 8 {
		s := md5.Sum([]byte(fmt.Sprintf("%s%d", input, count)))
		hash := hex.EncodeToString(s[:])

		if strings.HasPrefix(hash, difficultyString) {
			pos, err := strconv.Atoi(string(hash[5]))

			if err == nil && pos >= 0 && pos < 8 && pwd[pos] == '_' {
				foundChars++
				chars := []rune(pwd)
				chars[pos] = rune(hash[6])
				pwd = string(chars)
			}
		}

		count++
	}

	return pwd
}

func main() {
	pwd := getPassword2("uqwqemis", 5)

	fmt.Println(pwd)
}
