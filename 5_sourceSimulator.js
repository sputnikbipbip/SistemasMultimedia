'use strict'

const fs = require('fs')

let producted = []

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function source() {
    for (let i = 0; i < 2000; i++) {
        let random = getRandomInt(0, 65536)
        let counter = 0
        for (let j = 15; j >= 0; j--) {
            let bit = (random>>j) & 1
            if (bit) ++counter
        }
        producted.push(counter)
    }
    return producted
}

function main() {
    const content = Buffer.from(source())
    fs.writeFileSync('./ResultFiles/5_sourceSimulator.txt', content, err => {
      if (err) {
        console.error(err)
        return
      }
    })
}

main()
