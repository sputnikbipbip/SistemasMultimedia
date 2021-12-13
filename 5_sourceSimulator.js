'use strict'

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
        console.log(random + '\n')
        for (let j = 15; j >= 0; j--) {
            let bit = (random>>j) & 1
            if (bit) ++counter
        }
        producted.push(counter)
    }
    return producted
}

console.log(source())