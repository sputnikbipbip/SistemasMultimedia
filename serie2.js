'use strict'

const fs = require('fs')
const files = fs.readdirSync('./serie2Files');
const generator7 = require('./7_shortMessageGenerator')
const generator3 = require('./3_sourceWithMemoryMarkov')
const path = require('path')


/**
 * Increments by message size by 128 x nFiles
 * Writes the files generated in Results package
 * @param {Number} nFiles 
 * @param {string} filename -> file wich the generator should use
 */
function acquireDifferentFiles(filename, nFiles) {
    const minSize = 128
    for (let i = 1; i <= nFiles; ++i) {
        const message1 = generator7(filename, minSize * i)
        fs.writeFileSync(`./ResultFiles/${filename}_source7_size_${minSize * i}.txt`, Buffer.from(message1), 'utf-8', err => {
            if (err) {
              console.error(err)
              return
            }
        })
        const message2 = generator3(filename, minSize * i)
        fs.writeFileSync(`./ResultFiles/${filename}_source3_size_${minSize * i}.txt`, Buffer.from(message2), 'utf-8', err => {
            if (err) {
              console.error(err)
              return
            }
          })
    }
}

files.forEach(filename => {
    acquireDifferentFiles(filename, 16)
})