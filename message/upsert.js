require('../config')
/*
    Librerias
*/
const { exec } = require('child_process')
const fs = require('fs')
const syntaxErr = require('syntax-error')
const util = require('util')

module.exports = inky = async(inky, m, mek) => {
	try {
		const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : ''
		
		const isCmd = body.startsWith(prefix)
		const command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
		
		const args = body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const senderNumber = m.sender.split('@')[0]
		const pushname = m.pushName ? m.pushName : 'Sin nombre'
		const groupMetadata = m.isGroup ? await inky.groupMetadata(m.chat) : ''
		const groupMembers = m.isGroup ? groupMetadata.participants : ''
		
		const isMe = m.sender.includes(inky.user.id)
		const isOwner = owner.includes(senderNumber)
		const isStaff = staff.includes(senderNumber) || isOwner || isMe
		
		const Json = (string) => {
			return JSON.stringify(string, null, 2)
		}
		
		switch (command) {

case 'menu':

break

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
						return m.reply(Json(eval(q)))
					}
					if (body.startsWith('>')) {
						let _syntax = ''
						let _return
						let _text = `(async () => { ${body.slice(1)} })()`
						try {
							_return = await eval(_text)
						} catch (e) {
							let err = await syntaxErr(_text, 'Sistema De Ejecución')
							if (err) _syntax = err + '\n\n'
							_return = e
						} finally {
							m.reply(_syntax + util.format(_return))
						}
					}
					if (body.startsWith('=>')){
						const Return = (sul) => {
							var sat = Json(sul)
							let bang = util.format(sat)
							if (sat == undefined){
								bang = util.format(sul)
							}
							return m.reply(bang)
						}
						try {
							m.reply(`${util.format(eval(`;(async () => {${body.slice(2)}})()`))}`)
						} catch(e){
							m.reply(String(e))
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
