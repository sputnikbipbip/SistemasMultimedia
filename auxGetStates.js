function getStatesByByte (freqByByte, bytesFromFile) {
    let foundStates = {}
    for (const freqKey in freqByByte) {
        //if all ocurrences have been found, return
        let statesFound = 1
        let nOcurrences = 1
        foundStates[freqKey] = []
        foundStates[freqKey].push({
        key : freqKey,
        value : 1
        }) 
        for (let i = 0; i < bytesFromFile.length - 1 && statesFound <= freqByByte[freqKey]; i++) {
            if (bytesFromFile[i] == freqKey) {
                //check if the combination already is inserted
                let state = bytesFromFile[i+1]
                let index = foundStates[freqKey].findIndex(obj => obj.key == state)
                if (index == -1) {
                    foundStates[freqKey].push({
                        key : state,
                        value : 1
                    }) 
                } else {
                    foundStates[freqKey][index].value += 1
                }
                statesFound++
                nOcurrences++
            }
        }
        foundStates[freqKey].forEach(stateTransition => stateTransition.value /= nOcurrences)
    }
    return foundStates
} 