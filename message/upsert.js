require('../config')
/*
    Librerias
*/
const { exec } = require('child_process')
const fs = require('fs')
const util = require('util')

module.exports = inky = async(inky, m, mek) => {
	try {
		const from = m.chat
		const quoted = m.quoted ? m.quoted : m
		const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
		
		const isCmd = body.startsWith(prefix)
		const command = isCmd ? body.slice(1).trim().split(' ').shift().toLowerCase() : ''
		
		const args = body.trim().split(/ +/).slice(1)
		const q = args.join(' ')
		const isGroup = m.isGroup
		const sender = m.sender
		const senderNumber = sender.split('@')[0]
		const pushname = m.pushName ? m.pushName : 'Sin nombre'
		
		const isMe = sender.includes(inky.user.id)
		const isOwner = owner.includes(senderNumber)
		const isStaff = staff.includes(senderNumber) || isOwner || isMe
		
		switch (command) {

case 'reset':
m.reply('Por favor espere')
process.send('reset')
break

			default:
				if (isStaff) {
					if (body.startsWith('=>')) {
						function Return(sul) {
							var sat = JSON.stringify(sul, null, 2)
							var bang = util.format(sat)
							if (sat == undefined) {
								bang = util.format(sul)
							}
							return m.reply(bang)
						}
						try {
							m.reply(util.format(eval(`(async () => { return ${body.slice(2)} })()`)))
						} catch (e) {
							m.reply(String(e))
						}
					}
					if (body.startsWith('>')) {
						try {
							let evaled = await eval(body.slice(1))
							if (typeof evaled !== 'string') evaled = util.inspect(evaled)
							m.reply(evaled)
						} catch (e) {
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
	} catch(e) {
		var isError = String(e)
		m.reply(isError)
	}
}
