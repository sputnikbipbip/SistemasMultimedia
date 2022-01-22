'use strict'


const path = require('path');
const fs = require('fs'),
    PNG = require('pngjs').PNG;

let I1k = []
let I1i = []
let I1j = []
let I2k = []
let I2i = []
let I2j = []
let I1_I2 = []


/**
 * filePath1 must be the original png in order to calculate the e256 correctly
 * 
 * @param {string} filePath1 
 * @param {string} filePath2 
 * @returns 
 */
function getMSE(filePath1, filePath2) {
    var data = fs.readFileSync(filePath1, function(err, data){
        if(err) console.log(err)
        return data
      });;
    var png = PNG.sync.read(data);
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
          var idx = (png.width * y + x) << 2;
          I1k.push(png.data[idx])
          I1i.push(png.data[idx + 1])
          I1j.push(png.data[idx + 2])
        }
    }
    data = fs.readFileSync(filePath2, function(err, data){
        if(err) console.log(err)
        return data
      });
    png = PNG.sync.read(data);
    for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
          var idx = (png.width * y + x) << 2;
          I2k.push(png.data[idx])
          I2i.push(png.data[idx + 1])
          I2j.push(png.data[idx + 2])
          //e256 - updating current png to become e256 image file (original file - compressed file)
          png.data[idx] = (I1k[idx] - png.data[idx]) % 256 
          png.data[idx + 1] = (I1i[idx + 1] - png.data[idx + 1]) % 256
          png.data[idx + 2] = (I1j[idx] - I1j[idx + 2]) % 256
        }
    }
    /**E256 image*/
    let buffer = PNG.sync.write(png);
    let name = path.basename(filePath1).split('.').slice(0, -1)
    fs.writeFileSync(`./E256/${name}_e256.png`, buffer, err => {
        if (err) {
            console.error(err)
            return
        }
      })

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

/**
 * 
 * @param {Number} MSE 
 * @returns {string} PSNR
 */
function getPSNR(MSE) {
    return (10 * Math.log10((Math.pow(255, 2)) / MSE)) + ' dB'
}

/**
 * MSE and PSNR extraction,
 * every time the methods runs it generates an e256 file made by (firstImage - secondImage)
 */
let MSE = getMSE('./png_photos/kodim23original.png', './png_photos/kodim23uploaded.png')
let PSNR = getPSNR(MSE)
console.log(`MSE = ${MSE} \nPSNR = ${PSNR}`)

/**
 * get original pgn file by adding e256 from (original_WebP - loss_WebP)
 */
