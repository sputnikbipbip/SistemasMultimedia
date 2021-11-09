'use strict'

const fs = require('fs')
let ocurrences = []
let size
let symbols = 0 

function getBuffer(filename) {
    const data  = fs.readFileSync(`./${filename}`)
    size = data.length
    return data
}

function processFile(content) {
    content.forEach(value => {
        let check = ocurrences[value]
        if (check == undefined) {
            symbols++
            ocurrences[value] = 1
        } else {
            ocurrences[value] += 1
        }
    })
    console.log(ocurrences)
}

function probabiltyExtraction () {
    console.log(size)
    return ocurrences.map(elem => {
        return elem/size
    })
}

function entropyCalculator () {
    let entropy = 0
    probabilityArray.forEach(prob => {
        entropy += prob * Math.log2(1/prob)
    })
    return entropy
}

//1a
let res = getBuffer("pdf.pdf")
processFile(res)
let probabilityArray = probabiltyExtraction()
let H = entropyCalculator()
console.log(H)

//1b
console.log(symbols)



