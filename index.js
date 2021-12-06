'use strict'

const fs = require('fs')
const files = fs.readdirSync('./Files');
let totalOcurrences = 0
let markovEntropy = 0

function getBuffer(filename) {
    const data  = fs.readFileSync(`./Files/${filename}`)
    totalOcurrences = data.length
    return data
}

function getOcurrencesByByte(content) {
    let ocurrences = {}
    content.forEach(byte => {
        //let char = String.fromCharCode(byte)
        if (ocurrences[byte] != undefined) {
            ocurrences[byte] += 1
        } else {
            ocurrences[byte] = 1
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

function probabiltyExtraction (arr, order) {
    return arr.map(elem => {
        return elem.value/ (totalOcurrences / order)
    })
}

function entropyCalc (arr) {
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

//2
function getStatesByByte (bytesFromFile) {
    let foundStates = {}
    for (let i = 0, j = 1; j <= bytesFromFile.length - 1; i++, j++) {
        if (foundStates[bytesFromFile[i]]) {
            //check if the combination already is inserted
            foundStates[bytesFromFile[i]].ocurrences += 1
            let state = bytesFromFile[i+1]
            let index = foundStates[bytesFromFile[i]].states.findIndex(obj => obj.key == state)
            if (index == -1) {
                foundStates[bytesFromFile[i]].states.push({
                    key : state,
                    value : 1 
                }) 
            } else {
                foundStates[bytesFromFile[i]].states[index].value += 1
            }
        } else {
            foundStates[bytesFromFile[i]] = {}
            foundStates[bytesFromFile[i]].ocurrences = 1
            foundStates[bytesFromFile[i]].states = []
            foundStates[bytesFromFile[i]].states.push({
                key : bytesFromFile[i+1],
                value : 1
            }) 
        }
    }
    //set states transition probs and calculate markov entropy
    for (const prop in foundStates) {
        let stateEntropy = 0
        let stateProb = 0
        for (let i = 0; i < foundStates[prop].states.length; i++) {
            let nTransitionsToTheState = foundStates[prop].states[i].value
            //prop calculation = nTransitions to this state / nOcurrences 
            foundStates[prop].states[i].value = nTransitionsToTheState / foundStates[prop].ocurrences
            if (!(prop == foundStates[prop].states[i].key)) {
                let prob = foundStates[prop].states[i].value
                stateEntropy += prob * Math.log2(1/prob)
            } 
            //transition to the same state <=> stateProb
            else {
                stateProb = foundStates[prop].states[i].value
            }
        }
        markovEntropy += stateEntropy * stateProb
    }
    return foundStates
}   

//1
function analyseFiles(arr) {
    arr.forEach(filename => {
        //1a
        let fileBytes = getBuffer(filename)
        let ocurrencesByByte = getOcurrencesByByte(fileBytes)
        
        let sortedocurrencesByByte = sortObject(ocurrencesByByte)
        //console.log(sortedocurrencesByByte)
        let probabilityArray = probabiltyExtraction(sortedocurrencesByByte, 1)
        let entropy = entropyCalc(probabilityArray)
        
        //1b
        let nSymbols = getSymbolsWithHigherProb(probabilityArray)
        //console.log('nSymbTo to get 0,5 or more prob = ' + nSymbols)
        
        //1c
        let ocurrencesByBlockOf2 = getOcurrencesByBlocksOf2(fileBytes)
        let sortedOcurrencesByBlockOf2 = sortObject(ocurrencesByBlockOf2)
        let blockProb = probabiltyExtraction(sortedOcurrencesByBlockOf2, 2)
        let blockEntropy = entropyCalc(blockProb)

        //2
        getStatesByByte(getBuffer(filename))
        console.log(
            `\n${filename}: 
            \n\t Entropy of order 1 = ${entropy} 
            \n\t Entropy of order 2 = ${blockEntropy}
            \n\t Markov entropy of order 1 = ${markovEntropy}`
        )
    }) 
}
analyseFiles(files)
/*
//2 markov algorithm
let fileBytes = getBuffer('rfc7932.txt')
let stateByChar = getStatesByByte(fileBytes)
let objectStringified = JSON.stringify(stateByChar, null, "  ")
console.log(objectStringified)
console.log(markovEntropy)
*/

module.exports = {
    
}