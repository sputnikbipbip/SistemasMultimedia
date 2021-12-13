'use strict'

const zlib = require('zlib')  
const fs = require('fs')
const files = fs.readdirSync('./Files')

let fileSize = 0

function getBuffer(filename) {
    const data  = fs.readFileSync(`./Files/${filename}`)
    fileSize = data.length
    return data
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getSequence(filename) {
    let data = getBuffer(filename)
    let random = getRandomInt(0, (fileSize-128))
    let message = ""
    for (let i = random; i < random + 128; i++) {
        message += String.fromCharCode(data[i])
    }
    return message
}

function deflater(filename) {
    //original message
    const message = getSequence(filename)
    fs.writeFileSync('./ResultFiles/7_originalMessage.txt', Buffer.from(message), 'utf-8', err => {
        if (err) {
          console.error(err)
          return
        }
    })
    zlib.deflate(message, (err, buffer) => {
        if (!err) {
            fs.writeFileSync('./ResultFiles/7_deflatedMessage.txt', buffer, err => {
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

deflater("23961-8.txt")