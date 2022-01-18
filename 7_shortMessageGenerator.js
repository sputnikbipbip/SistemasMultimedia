'use strict'

const zlib = require('zlib')  
const fs = require('fs')
const files = fs.readdirSync('./Files')
const path = require('path')

let fileSize = 0

/*
function getBuffer(filename) {
    const data  = fs.readFileSync(`./Files/${filename}`)
    fileSize = data.length
    return data
}
*/

function getBuffer(filename) {
    const data  = fs.readFileSync(`./serie2Files/${filename}`)
    fileSize = data.length
    return data
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * 
 * @param {string} filename 
 * @param {Number} messageSize 
 * @returns 
 */
function getSequence(filename, messageSize) {
    let data = getBuffer(filename)
    let random = getRandomInt(0, (fileSize - messageSize))
    let message = ""
    for (let i = random; i < random + messageSize; i++) {
        message += String.fromCharCode(data[i])
    }
    return message
}

function deflater(filename) {
    //original message
    const message = getSequence(filename, 128)
    fs.writeFileSync(`./ResultFiles/${filename}_original.txt`, Buffer.from(message), 'utf-8', err => {
        if (err) {
          console.error(err)
          return
        }
    })
    zlib.deflate(message, (err, buffer) => {
        if (!err) {
            fs.writeFileSync(`./ResultFiles/${filename}_deflated.txt`, buffer, err => {
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

module.exports = getSequence

//deflater("23961-8.txt")