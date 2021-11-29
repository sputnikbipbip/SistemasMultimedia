'use strict'

for (let i = 0; i < 256; i++) {
    console.log((i - 1) % 256)
    console.log((i - 2) % 256)
    console.log((i - 3) % 256)
    console.log(i % 256)
    console.log((i + 1) % 256)
    console.log((i + 2) % 256)
    console.log((i + 3) % 256)
}