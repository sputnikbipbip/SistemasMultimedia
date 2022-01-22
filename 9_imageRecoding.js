'use strict'


const path = require('path');
const fs = require('fs'),
    PNG = require('pngjs').PNG;

let I1k = []
let I1i = []
let I1j = []
let MSE = 0
let SNR = 0

/**
 * advances first position of the arrays 
 */
function emptyArrays() {
    I1k = []
    I1i = []
    I1j = []
    return
}

/**
 * filePath1 must be the original png in order to calculate the e256 correctly
 * 
 * @param {string} filePath1 
 * @param {string} filePath2 
 * @returns 
 */
function getMSE(filePath1, filePath2) {
    let numeradorMSE = 0
    let numeradorSNR = 0
    let data = fs.readFileSync(filePath1, function(err, data){
        if(err) console.log(err)
        return data
      });;
    let png = PNG.sync.read(data);
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            let idx = (png.width * y + x) << 2;
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
    let counter = 0
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++, counter++) {
            let idx = (png.width * y + x) << 2;
            //e256 - updating current png to become e256 image file (original file - compressed file)
            png.data[idx] = (I1k[counter] - png.data[idx]) % 256 
            png.data[idx + 1] = (I1i[counter] - png.data[idx + 1]) % 256
            png.data[idx + 2] = (I1j[counter] - png.data[idx + 2]) % 256
            //(SSS[I1(k,i,j)-I2(k,i,j)])
            numeradorMSE += (
                Math.pow((I1k[counter] - png.data[idx]), 2) + 
                Math.pow((I1i[counter] - png.data[idx + 1]), 2) + 
                Math.pow((I1j[counter] - png.data[idx + 2]), 2))
            numeradorSNR += (
                Math.pow(I1k[counter], 2) + 
                Math.pow(I1i[counter], 2) + 
                Math.pow(I1j[counter], 2)
                )
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
    let denominadorMSE = 3 * png.width * png.height
    //reset result array
    emptyArrays()
    MSE = numeradorMSE / denominadorMSE
    SNR = (numeradorSNR / denominadorMSE) / MSE
}

/**
 * (WebP with loss) + e256 (WebP lossless - WebP with loss)
 * result is saved in <xxx_q_30_inverted>.png
 * @param {string} filePath1 
 * @param {string} filePath2 
 * @returns 
 */
function getOriginalPNG(filePath1, filePath2) {
    let data = fs.readFileSync(filePath1, function(err, data){
        if(err) console.log(err)
        return data
      });;
    let png = PNG.sync.read(data);
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
    let counter = 0
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++, counter++) {
            let idx = (png.width * y + x) << 2;
            png.data[idx] = I1k[counter] + png.data[idx]
            png.data[idx + 1] = I1i[counter] + png.data[idx + 1]
            png.data[idx + 2] = I1j[counter] + png.data[idx + 2]
        }
    }
    /**E256 image*/
    let buffer = PNG.sync.write(png);
    let name = path.basename(filePath1).split('.').slice(0, -1)
    fs.writeFileSync(`./WebPWithLoss_&_e256/${name}_inverted.png`, buffer, err => {
        if (err) {
            console.error(err)
            return
        }
      })
    emptyArrays()
}

/**
 * 
 * @param {Number} MSE 
 * @returns {string} PSNR
 */
function getPSNR(MSE) {
    return (10 * Math.log10(
        Math.pow(
            (Math.pow(2, 24) - 1), 2) / MSE)
        ) + ' dB'
}

/**
 * MSE and PSNR extraction,
 * every time the methods runs it generates an e256 file made by (firstImage - secondImage)
 */
getMSE('./png_photos/kodim23original.png', './png_photos/kodim23uploaded.png')
let PSNR = getPSNR(MSE)
console.log(`'./png_photos/kodim23original.png' _> './png_photos/kodim23uploaded.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)

getMSE('./png_photos/kodim01.png', './png_photos/kodim01_q_30.png')
PSNR = getPSNR(MSE)
console.log(`'./png_photos/kodim01.png' _> './png_photos/kodim01_q_30.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)

getMSE('./png_photos/kodim02.png', './png_photos/kodim02_q_30.png')
PSNR = getPSNR(MSE)
console.log(`'./png_photos/kodim02.png' _> './png_photos/kodim02_q_30.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)

getMSE('./png_photos/kodim03.png', './png_photos/kodim03_q_30.png')
PSNR = getPSNR(MSE)
console.log(`'./png_photos/kodim03.png' _> './png_photos/kodim03_q_30.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)

getMSE('./png_photos/kodim06.png', './png_photos/kodim06_q_30.png')
PSNR = getPSNR(MSE)
console.log(`'./png_photos/kodim06.png' _> './png_photos/kodim06_q_30.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)

getMSE('./png_photos/kodim17.png', './png_photos/kodim17_q_50.png')
PSNR = getPSNR(MSE)
console.log(`'./png_photos/kodim17.png' _> './png_photos/kodim17_q_50.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)

/**WebP with loss vs JPEG */
getMSE('./png_photos/kodim01.png', './png_photos/kodim01_jpeg.png')
PSNR = getPSNR(MSE)
console.log(`'./WebP/kodim01.jpeg' _> './png_photos/kodim01_jpeg.png'\n SNR = ${SNR} \nPSNR = ${PSNR}\n`)



/**
 * get original pgn file by adding e256 from (original_WebP - loss_WebP)
 */
/*
//get e256 from kodim01
getMSE('./WebP/kodim01.png', './WebP/kodim01_q_30.png')
//result + WebP with loss
getOriginalPNG('./E256/kodim01_e256.png', './WebP/kodim01_q_30.png')

//get e256 from kodim02
getMSE('./WebP/kodim02.png', './WebP/kodim02_q_30.png')
//result + WebP with loss
getOriginalPNG('./E256/kodim02_e256.png', './WebP/kodim02_q_30.png')

//get e256 from kodim03
getMSE('./WebP/kodim03.png', './WebP/kodim03_q_30.png')
//result + WebP with loss
getOriginalPNG('./E256/kodim03_e256.png', './WebP/kodim03_q_30.png')

//get e256 from kodim06
getMSE('./WebP/kodim06.png', './WebP/kodim06_q_30.png')
//result + WebP with loss
getOriginalPNG('./E256/kodim06_e256.png', './WebP/kodim06_q_30.png')

//get e256 from kodim17
getMSE('./WebP/kodim17.png', './WebP/kodim17_q_50.png')
//result + WebP with loss
getOriginalPNG('./E256/kodim17_e256.png', './WebP/kodim17_q_50.png')
*/