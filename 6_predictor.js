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
let errorOcurrences = {
    0 : {},
    1 : {},
    2 : {},
    3 : {}
}

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
        for (let j = 0; j < 4; j++) {
            //error frequency
            if (errorOcurrences[j][Math.abs(data[i] - predictor[j][i])] == undefined)
                errorOcurrences[j][Math.abs(data[i] - predictor[j][i])] = 1
            else
                errorOcurrences[j][Math.abs(data[i] - predictor[j][i])]++

            // max and min value found
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
    arr.forEach(filename => {
        let data = getBuffer(filename)
        let errorArrays = predictor(data)
        console.log(`\nfilename =  ${filename}`)
        /** Valor absoluto - bit já reservado para sinal
         * 0   - 15    _> 5
         * 16  - 31    _> 6
         * 32  - 63    _> 7
         * 64  - 127   _> 8     
         * 128 - 255   _> 9
         * 256 - 511   _> 10
         * 512 - 1023  _> 11
         */
        
        for (let i = 0; i < 4; i++) {
            let nBitsAfterPrediction = [0,0,0,0]
            let keys = Object.keys(errorOcurrences[i])
            for (let k = 0; k < keys.length; k++) {
                switch (true) {
                    case keys[k] >= 0 && keys[k] < 16 :
                        nBitsAfterPrediction[i] += 5 * errorOcurrences[i][keys[k]]
                        break;
                    case keys[k] >= 16 && keys[k] < 32 :
                        nBitsAfterPrediction[i] += 6 * errorOcurrences[i][keys[k]]
                        break;
                    case keys[k] >= 32 && keys[i] < 62 :
                        nBitsAfterPrediction[i] += 7 * errorOcurrences[i][keys[k]]
                        break;
                    case keys[k] >= 64 && keys[i] < 128 :
                        nBitsAfterPrediction[i] += 8 * errorOcurrences[i][keys[k]]
                        break;
                    case keys[k] >= 128 && keys[i] < 256 :
                        nBitsAfterPrediction[i] += 9 * errorOcurrences[i][keys[k]]
                        break;
                    case keys[k] >= 256 && keys[i] < 512 :
                        nBitsAfterPrediction[i] += 10 * errorOcurrences[i][keys[k]]
                        break;
                    case keys[k] >= 512 && keys[k] < 1024 :
                        nBitsAfterPrediction[i] += 11 * errorOcurrences[i][keys[k]]
                        break;
                    default:
                        console.log(`Something went wrong`)
                }
            }
            console.log(`
            original #bits = ${fileNSymbols * 8}
            after    #bits = ${nBitsAfterPrediction[i]}
            smaller = ${smaller[i]} 
            bigger = ${bigger[i]} 
            Predictor = P${i}
            compression percentage = ${((fileNSymbols * 8) / nBitsAfterPrediction[i]).toFixed(2)}`)
            // \n ${res[3]}
            //array = ${errorArrays[i]} 
        }
        smaller = [0,0,0,0]
        bigger = [0,0,0,0]
        //frequency of the results from the symbols less the predictor
        errorOcurrences = {
            0 : {},
            1 : {},
            2 : {},
            3 : {}
        }
               
    })
}


analyseFiles(files)