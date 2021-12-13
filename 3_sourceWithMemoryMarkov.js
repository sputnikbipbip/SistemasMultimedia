'use strict'

const fs = require('fs')


//Random probability generator
function getRandomWithDecimal(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.random() * (max - min);
}

//Delimit states range
function mapStates(p) {
    const map = []
    let base = 0
    for(let i = 1; i < 8; i++) {
        if(i < 3 || i > 5) {
            map.push({
                    min : base.toFixed(2),
                    max : (((1-p)/4) + base).toFixed(2)
                })
            base += (1-p)/4
        }
        else {
            map.push({
                min : base.toFixed(2),
                max : ((p)/3 + base).toFixed(2)
            })
            base += (p)/3
        }
    }
    return map
}

function transitions(p) {
    const states = mapStates(p)
    console.log(`p = ${p}\n`)
    let result = [97]
    let breakRes = 0
    for (let i = 0; i < 255; i++) {
        let current = getRandomWithDecimal(0, 1).toFixed(2)
        switch (true) {
            case current >= states[0].min && current < states[0].max :
                breakRes = -3;
                break;
            case current >= states[1].min && current < states[1].max :
                breakRes = - 2;
                break;
            case current >= states[2].min && current < states[2].max :
                breakRes = - 1;
                break;
            case current >= states[3].min && current < states[3].max :
                breakRes = 0;
                break;
            case current >= states[4].min && current < states[4].max :
                breakRes = 1;
                break;
            case current >= states[5].min && current < states[5].max :
                breakRes = 2;
                break;
            case current >= states[6].min && current <= states[6].max :
                breakRes = 3;
                break;
            default:
                console.log(`Something went wrong`)
        }
        let aux = result[result.length - 1] + breakRes
        if (aux > 256 || aux < 0)
            aux %= 256
        result.push(aux)
    }
    return result
}

function entropyCal() {
    let p = 0.2
    for (let i = 0; i < 5; i++, p += 0.2) {
        let res =   (
                        (1-p) * Math.log2((1/(1-p/4))) 
                        + p * Math.log2((1/(p/3)))
                    )
        console.log(`entropy of p = ${p}\n \t${res}`)
    }
} 
//entropyCal()

function startSource() {
    const content = Buffer.from(transitions(getRandomWithDecimal(0, 1)))
 
    fs.writeFileSync('./ResultFiles/3_markovWithMemory.txt', content, 'utf-8', err => {
      if (err) {
        console.error(err)
        return
      }
    })
}
//startSource() 

