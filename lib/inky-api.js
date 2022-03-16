const { exec } = require('child_process')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const ytdl = require('ytdl-core')

const { getRandom } = require('./functions')

const imageToWebp = (media) => {
    var nameWebp = getRandom('.webp')
    var nameJpg = getRandom('.jpg')
    fs.writeFileSync(nameJpg, media)
    return new Promise((resolve, reject) => {
        ffmpeg(nameJpg)
            .on('error', () => {
            fs.unlinkSync(nameJpg)
        })
            .on('end', () => {
            fs.unlinkSync(nameJpg)
            var result = fs.readFileSync(nameWebp)
            resolve(result)
            fs.unlinkSync(nameWebp)
        })
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
            ])
            .toFormat('webp')
            .save(nameWebp)
    })
}

const videoToWebp = (media) => {
    var nameWebp = getRandom('.webp')
    var nameMp4 = getRandom('.mp4')
    fs.writeFileSync(nameMp4, media)
    return new Promise((resolve, reject) => {
        ffmpeg(nameMp4)
            .on('error', () => {
            fs.unlinkSync(nameMp4)
        })
            .on('end', () => {
            fs.unlinkSync(nameMp4)
            var result = fs.readFileSync(nameWebp)
            resolve(result)
            fs.unlinkSync(nameWebp)
        })
            .addOutputOptions([
                "-vcodec",
                "libwebp",
                "-vf",
                "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                "-loop",
                "0",
                "-ss",
                "00:00:00",
                "-t",
                "00:00:05",
                "-preset",
                "default",
                "-an",
                "-vsync",
                "0"
            ])
            .toFormat('webp')
            .save(nameWebp)
    })
}

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

module.exports = { imageToWebp, videoToWebp, ytmp3, ytmp4 }
