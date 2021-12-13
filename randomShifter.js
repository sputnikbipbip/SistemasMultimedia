'use strict'

const zlib = require('zlib')  
const fs = require('fs')
const files = fs.readdirSync('./Files')

/**
 * L -> comprimento constante = 128 (tamanho da sequência)
 * Alfabeto = {0,1,2...255}
 * 
 * Posições na sequência
 * 0123.....127|128......255|256.......511
 * 
 * |ab()ufeufefuefbuebf|
 * a = 97 -> 7
 * b = 98 -> 7
 * 
 * número de shifts 
 * 
 * Número médio de bits =  #bits / 128
 * 
 */
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
    const result = Buffer.from(message)
    return result
}

function deflater(filename) {
    //original message
    const buffer = getSequence(filename)
    fs.writeFileSync('./ResultFiles/originalMessage.txt', buffer, 'utf-8', err => {
        if (err) {
          console.error(err)
          return
        }
    })
    const gzip = zlib.createGzip()
    const inp = fs.createReadStream('./ResultFiles/originalMessage.txt')
    const out = fs.createWriteStream('./ResultFiles/deflatedMessage.txt.gz')
    inp.pipe(gzip).pipe(out)
}

deflater("23961-8.txt")