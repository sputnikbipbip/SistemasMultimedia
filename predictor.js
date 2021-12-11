'use strict'

const fs = require('fs')
const files = fs.readdirSync('./Files')

/**
 * err = x(n) - pi(x(n))
 * p(sem x(n-i)) = 0
 * p0 = x(n-1)
 * p1 = 2x(n-1) - x(n-2)
 * p2 = x(n-2)
 * p3 = x(n-1) + x(n-2) - x(n-3)
 */
let fileNSymbols = 0
let smaller = [0,0,0,0]
let bigger = [0,0,0,0]
let aux = {}

function getBuffer(filename) {
    const data  = fs.readFileSync(`./Files/${filename}`)
    fileNSymbols = data.length
    return data
}

function predictor(data) {
    let predictor = new Array(4);
    let err = new Array(4)
    for (let i = 0; i < predictor.length; i++) {
        predictor[i] = []
        err[i] = []
    }
    predictor[0].push(0)

    predictor[1].push(0)
    predictor[1].push(0)

    predictor[2].push(0)
    predictor[2].push(0)

    predictor[3].push(0)
    predictor[3].push(0)
    predictor[3].push(0)
    
    for (let i = 0; i < fileNSymbols; i++) {

        if (i > 0) {
            predictor[0].push(data[i-1])
        }
        if (i > 1) {
            predictor[1].push((2 * (data[i-1])) - (data[i-2]))
            predictor[2].push(data[i-2])
            
        }
        if (i > 2) {
            predictor[3].push((data[i-1]) + (data[i-2]) - (data[i-3]))
        }

        if (aux[Math.abs(data[i] - predictor[1][i])] == undefined)
            aux[Math.abs(data[i] - predictor[1][i])] = 1
        else
            aux[Math.abs(data[i] - predictor[1][i])]++


        for (let j = 0; j < 4; j++) {
          
            if (bigger[j] < (data[i] - predictor[j][i])) 
                bigger[j] = (data[i] - predictor[j][i])
                
            if (smaller[j] > (data[i] - predictor[j][i])) 
                smaller[j] = (data[i] - predictor[j][i])
        }

        err[0].push(data[i] - predictor[0][i])
        err[1].push(data[i] - predictor[1][i])
        err[2].push(data[i] - predictor[2][i]) 
        err[3].push(data[i] - predictor[3][i])
    }
    return err
}

function analyseFiles(arr) {
    /*
    arr.forEach(filename => {
        let data = getBuffer(filename)
        let errorArrays = predictor(data)
        console.log(`\nfilename =  ${filename}`)
        for (let i = 0; i < 4; i++) {
            console.log(`
            original #bits = ${fileNSymbols * 8}
            array = ${errorArrays[i]} 
            smaller = ${smaller[i]} 
            bigger = ${bigger[i]} 
            Predictor = P${i}`)
            // \n ${res[3]}
        }
        smaller = [0,0,0,0]
        bigger = [0,0,0,0]        
    })
    */
    let data = getBuffer(arr)
    let errorArrays = predictor(data)
    console.log(`\nfilename =  ${arr}`)
    console.log(`
        original #bits = ${fileNSymbols * 8}
        smaller = ${smaller[1]} 
        bigger = ${bigger[1]} 
        Predictor = P${1}
        array = ${JSON.stringify(aux)} `)
    smaller = [0,0,0,0]
    bigger = [0,0,0,0]   
}
/** Valor absoluto - bit já reservado para sinal
 * 0   - 15    _> 5
 * 16  - 31    _> 6
 * 32  - 63    _> 7
 * 64  - 127   _> 8     
 * 128 - 255   _> 9
 * 256 - 511   _> 10
 * 512 - 1023  _> 11
 */

analyseFiles("23961-8.txt")