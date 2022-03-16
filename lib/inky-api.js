const { exec } = require('child_process')
const fs = require('fs')
const ytdl = require('ytdl-core')

const { getRandom } = require('./functions')

const ytmp3 = async(link) => {
    return new Promise((resolve, reject) => {
        var dl = ytdl(link)
        var nameMp3 = getRandom('.mp3')
        var nameMp4 = getRandom('.mp4')
        var wS = fs.createWriteStream(nameMp4)
        dl.pipe(wS)
        dl.on('end', function() {
            exec(`ffmpeg -i ${nameMp4} ${nameMp3}`, (err) => {
                fs.unlinkSync(nameMp4)
                if (err) return
                var result = fs.readFileSync(nameMp3)
                resolve(result)
                fs.unlinkSync(nameMp3)
            })
        })
    })
}

const ytmp4 = async(link) => {
    return new Promise((resolve, reject) => {
        var dl = ytdl(link)
        var name = getRandom('.mp4')
        var wS = fs.createWriteStream(name)
        dl.pipe(wS)
        dl.on('end', function() {
            var result = fs.readFileSync(name)
            resolve(result)
            fs.unlinkSync(name)
        })
    })
}

module.exports = { ytmp3, ytmp4 }
