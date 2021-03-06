require('../config')
/*
    Librerias
*/

const { downloadContentFromMessage } = require('@adiwajshing/baileys-md')
const { exec } = require('child_process')
const fs = require('fs')
const util = require('util')
const ytdl = require('ytdl-core')
const yts = require('yt-search')

/*
	Js
*/
const { exifImageToWebp, exifVideoToWebp, imageToWebp, videoToWebp, ytmp3, ytmp4 } = require('../lib/inky')
const Json = (string) => {
	return JSON.stringify(string, null, 2)
}

module.exports = inky = async(inky, m, mek) => {
	try {
		const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
		
		const isCmd = body.startsWith(prefix)
		const command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
		
		const args = body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const senderNumber = m.sender.split('@')[0]
		const botNumber = inky.user.id.split(':')[0]
		const pushname = m.pushName ? m.pushName : 'Sin nombre'
		const groupMetadata = m.isGroup ? await inky.groupMetadata(m.chat) : ''
		const groupMembers = m.isGroup ? groupMetadata.participants : ''
		
		const isMe = m.sender.includes(botNumber)
		const isOwner = owner.includes(senderNumber)
		const isStaff = staff.includes(senderNumber) || isOwner || isMe
		
		const downloadMediaMessage = async(message) => {
			if (m.quoted.mtype === 'imageMessage') {
				var stream = await downloadContentFromMessage(message, 'image')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				return buffer
			}
		}
		
		const replyAud = (aud) => {
			inky.sendMessage(m.chat, { audio: aud, mimetype: 'audio/mp4' }, { quoted: m })
		}
		const replyS = (stik) => {
			inky.sendMessage(m.chat, { sticker: stik }, { quoted: m })
		}
		const replyVid = (vid, teks) => {
			inky.sendMessage(m.chat, { video: vid, caption: teks }, { quoted: m })
		}
		
		switch (command) {

case 'hidetag':
if (!q || m.quoted == null) return
var jids = []
var teks = q ? q : m.quoted.text
groupMembers.map(v => jids.push(v.id))
m.reply(teks, m.chat, jids)
break

			default:
				if (isStaff) {
					if (body.startsWith('x')) {
						try {
							m.reply(Json(eval(q)))
						} catch(e) {
							m.reply(String(e))
						}
					}
					if (body.startsWith('=>')) {
						try {
							m.reply(eval(String(body.slice(2))))
						} catch(e) {
							m.reply(String(e))
						}
					}
					if (body.startsWith('>')){
						try {
							var value = await eval(`(async() => {${body.slice(1)}})()`)
							m.reply(util.format(value))
						} catch(e){
							m.reply(util.format(e))
						}
					}
					if (body.startsWith('$')) {
						exec(body.slice(1), (err, stdout) => {
							if (err) return m.reply(err)
							if (stdout) return m.reply(stdout)
						})
					}
				}
		}
	} catch (e) {
		var isError = String(e)
		m.reply(isError)
	}
}
