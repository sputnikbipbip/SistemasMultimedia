'use strict'

const fs = require('fs')
const files = fs.readdirSync('./serie2Files');
const dictionaries = fs.readdirSync('./Dictionaries');
const generator7 = require('./7_shortMessageGenerator')
const generator3 = require('./3_sourceWithMemoryMarkov')
const path = require('path')
const zlib = require('zlib');  


/**
 * Increments message size by 128 x nFiles
 * Writes the files generated in Results package
 * @param {Number} nFiles 
 * @param {string} filename -> file wich the generator should use
 */
function acquireDifferentFiles(filename, nFiles) {
    //const minSize = 127
    const minSize = 1024
    for (let i = 1; i <= nFiles; ++i) {
        const message1 = generator7(filename, minSize * i)
        fs.writeFileSync(`./Dictionaries/${filename}_source7_size_${minSize * i}.txt`, Buffer.from(message1), 'utf-8', err => {
            if (err) {
              console.error(err)
              return
            }
        })
      
        const message2 = generator3(filename, minSize * i)
        fs.writeFileSync(`./Dictionaries/${filename}_source3_size_${minSize * i}.txt`, Buffer.from(message2), 'utf-8', err => {
            if (err) {
              console.error(err)
              return
            }
          })
    }
}

/**
 * 
 * @param {string} dictionary 
 */
function deflateWithDictionary(dictionary, filename) {
  const data = fs.readFileSync(`./serie2Files/${filename}`)
  zlib.deflate(data, {dictionary: fs.readFileSync(`./Dictionaries/${dictionary}`)}, (err, buffer) => {
    if (!err) {
        fs.writeFileSync(`./DeflatedFiles/${dictionary}_deflated.txt`, buffer, err => {
            if (err) {
                console.error(err)
                return
            }
        })
    } 
    else {
      console.log(err);
    }
  });
}

function brotliCompress(filename) {
  const data = fs.readFileSync(`./serie2Files/${filename}`, 'utf8', function(err, data){
    if(err) console.log(err)
    return data
  });
  zlib.brotliCompress(data, (err, buffer) => {
    if(!err) {
      fs.writeFileSync(`./BrotliFiles/${filename}_brotli.txt`, buffer, err => {
        if (err) {
            console.error(err)
            return
        }
      })
    }
    else {
        console.log(err);
    }
  });
}

files.forEach(filename => {
    acquireDifferentFiles(filename, 16)

    dictionaries.forEach(dic => {
      deflateWithDictionary(dic, filename)
    })
    brotliCompress(filename)
})



