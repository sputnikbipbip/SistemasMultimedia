'use strict'

const fs = require('fs')
let totalOcurrences = 0

function getBuffer(filename) {
    const data  = fs.readFileSync(`./${filename}`)
    totalOcurrences = data.length
    return data
}

function processFile(content) {
    let ocurrences = {}
    content.forEach(byte => {
        let char = String.fromCharCode(byte)
        if (ocurrences[char] != undefined) {
            ocurrences[char] += 1
        } else {
            ocurrences[char] = 1
        }
    })
    return ocurrences
}

function sortObject(obj) {
    var arr = []
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            arr.push({
                'key': prop,
                'value': obj[prop]
            })
        }
    }
    arr.sort(function(a, b) { return b.value - a.value; })
    return arr
}

function probabiltyExtraction (arr) {
    return arr.map(elem => {
        return elem.value/totalOcurrences
    })
}

function entropyCalculator (arr) {
    let entropy = 0
    arr.forEach(prob => {
        entropy += prob * Math.log2(1/prob)
    })
    return entropy
}

function getSymbolsWithHigherProb (arr) {
    let sum = 0
    let nSymbols = 0
    for (let key in arr) {
        if (sum >= 0.5)
            break
        sum += arr[key]
        nSymbols++
    }
    return nSymbols 
}



//1a
let fileBytes = getBuffer("pdf.pdf")
let ocurrences = processFile(fileBytes)
let sortedOcurrences = sortObject(ocurrences)
console.log(sortedOcurrences)
let probabilityArray = probabiltyExtraction(sortedOcurrences)
let entropy = entropyCalculator(probabilityArray)
console.log('H = ' + entropy)

//1b
let nSymbols = getSymbolsWithHigherProb(probabilityArray)
console.log('nSymbTo to get 0,5 or more prob = ' + nSymbols)
