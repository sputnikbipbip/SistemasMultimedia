'use strict'

const fs = require('fs')
const files = fs.readdirSync('./Files');
let totalOcurrences = 0

function getBuffer(filename) {
    const data  = fs.readFileSync(`./Files/${filename}`)
    totalOcurrences = data.length
    return data
}

function getOcurrencesByByte(content) {
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

function getOcurrencesByBlocksOf2(content) {
    let blockOf2 = {}
    for (let i = 0, j = 1; j < content.length; i += 2, j += 2) {
        let block = content[i] + ',' + content[j]
        if (blockOf2[block] != undefined) {
            blockOf2[block] += 1
        } else {
            blockOf2[block] = 1
        }
    }
    return blockOf2
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

function analyseFiles(arr) {
    let counter = 0
    arr.forEach(filename => {
        //1a
        let fileBytes = getBuffer(filename)
        let ocurrencesByByte = getOcurrencesByByte(fileBytes)
        
        let sortedocurrencesByByte = sortObject(ocurrencesByByte)
        //console.log(sortedocurrencesByByte)
        let probabilityArray = probabiltyExtraction(sortedocurrencesByByte)
        let entropy = entropyCalculator(probabilityArray)
        
        //1b
        let nSymbols = getSymbolsWithHigherProb(probabilityArray)
        //console.log('nSymbTo to get 0,5 or more prob = ' + nSymbols)
        
        //1c
        let ocurrencesByBlockOf2 = getOcurrencesByBlocksOf2(fileBytes)
        let sortedOcurrencesByBlockOf2 = sortObject(ocurrencesByBlockOf2)
        let blockProb = probabiltyExtraction(sortedOcurrencesByBlockOf2)
        let blockEntropy = entropyCalculator(blockProb)
        console.log(`\n${filename}: \n\t Entropy of order 1 = ${entropy} \n\t Entropy of order 2 = ${blockEntropy}`)
    }) 
}

analyseFiles(files)


