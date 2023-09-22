package main

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
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

	for count < saneLimit && len(foundHashes) < 8 {
		s := md5.Sum([]byte(fmt.Sprintf("%s%d", input, count)))
		hash = hex.EncodeToString(s[:])

		if strings.HasPrefix(hash, difficultyString) {
			foundHashes = append(foundHashes, Hash{count, hash})
		}

		count++
	}

	pwd := ""
	for _, v := range foundHashes {
		pwd = pwd + string(v.hash[5])
	}

	return pwd
}

func main() {
	pwd := getPassword("abc", 5)

	fmt.Println(pwd)
}
