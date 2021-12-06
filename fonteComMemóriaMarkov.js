'use strict'

//Random probability generator
function getRandomIntInclusive(min, max) {
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
                    min : base,
                    max : ((1-p)/4) + base
                })
            base += (1-p)/4
        }
        else {
            map.push({
                min : base,
                max : (p)/3 + base
            })
            base += (p)/3
        }
    }
    return map
}

function transitions(p) {
    const states = mapStates(p)
    let result = ['a']
    let breakRes = 0
    for (let i = 0; i < 256; i++) {
        let current = getRandomIntInclusive(0, 1)
        console.log(states[0].max)
        switch (current) {
            case (current >= states[0].min && current < states[0].max):
                breakRes = -3
                break
            case (current >= states[1].min && current < states[1].max):
                breakRes = - 2
                break
            case (current >= states[2].min && current < states[2].max):
                breakRes = - 1
                break
            case (current >= states[3].min && current < states[3].max):
                breakRes = 0
                break
            case (current >= states[4].min && current < states[4].max):
                breakRes = + 1
                break
            case (current >= states[5].min && current < states[5].max):
                breakRes = + 2
                break
            case (current >= states[6].min && current <= states[6].max):
                breakRes = + 3
                break
            default:
                console.log(`Something went wrong`)
        }
        let aux = result[result.length - 1] + breakRes
        if (aux > 256 || aux < 0)
            aux %= 256
        result.push(String.fromCharCode(aux))
    }
    return result
}

console.log(transitions(getRandomIntInclusive(0, 1)))