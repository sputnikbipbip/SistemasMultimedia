'use strict'

let I1k = []
let I1i = []
let I1j = []
let I2k = []
let I2i = []
let I2j = []
let I1_I2 = []

const fs = require('fs'),
    PNG = require('pngjs').PNG;

function getMSE() {
    var data = fs.readFileSync('./png_photos/kodim23original.png');
    var png = PNG.sync.read(data);
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
          var idx = (png.width * y + x) << 2;
          I1k.push(png.data[idx])
          I1i.push(png.data[idx + 1])
          I1j.push(png.data[idx + 2])
        }
    }
    data = fs.readFileSync('./png_photos/kodim23uploaded.png');
    png = PNG.sync.read(data);
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
          var idx = (png.width * y + x) << 2;
          I2k.push(png.data[idx])
          I2i.push(png.data[idx + 1])
          I2j.push(png.data[idx + 2])
        }
    }
    for (let i = 0; i < I1k.length; i++) {
        I1_I2.push((I1i[i] - I2i[i]) + (I1j[i] - I2j[i]) + (I1k[i] - I2k[i]))
    }
    let Somatory = 0
    I1_I2.forEach(index => {
        Somatory += Math.pow(index, 2)
    })
    let N = 3 * png.width * png.height
    return Somatory / N
}

function getPSNR(MSE) {
    return (10 * Math.log10((Math.pow(255, 2)) / MSE)) + ' dB'
}

let MSE = getMSE()
let PSNR = getPSNR(MSE)
console.log(`MSE = ${MSE} \nPSNR = ${PSNR}`)
