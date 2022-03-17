/*
    Libreria
*/
const { downloadContentFromMessage, proto } = require('@adiwajshing/baileys-md')

const downloadMediaMessage = async (message) => {
	let mime = (message.msg || message).mimetype || ''
        let messageType = mime.split('/')[0].replace('application', 'document') ? mime.split('/')[0].replace('application', 'document') : mime.split('/')[0]
        let extension = mime.split('/')[1]
        const stream = await downloadContentFromMessage(message, messageType)
        let buffer = Buffer.from([])
        for await(const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
	}
	return buffer
}

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

const smsg = (conn, m, hasParent) => {
	if (!m) return m
	let M = proto.WebMessageInfo
	if (m.key) {
		m.id = m.key.id
		m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16
		m.chat = m.key.remoteJid
		m.fromMe = m.key.fromMe
		m.isGroup = m.chat.endsWith('@g.us')
		m.sender = m.fromMe ? (conn.user.id.split(":")[0]+'@s.whatsapp.net' || conn.user.id) : (m.key.participant || m.key.remoteJid)
	}
	if (m.message) {
		m.mtype = Object.keys(m.message)[0]
		m.body = m.message.conversation || m.message[m.mtype].caption || m.message[m.mtype].text || (m.mtype == 'listResponseMessage') && m.message[m.mtype].singleSelectReply.selectedRowId || (m.mtype == 'buttonsResponseMessage') && m.message[m.mtype].selectedButtonId || m.mtype
		m.msg = m.message[m.mtype]
		if (m.mtype === 'ephemeralMessage') {
			smsg(conn, m.msg)
			m.mtype = m.msg.mtype
			m.msg = m.msg.msg
		}
		if (m.mtype === 'viewOnceMessage') {
			smsg(conn, m.msg.message)
			m.mtype = m.msg.mtype
			m.msg = m.msg.msg
		}
		let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null
		m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
		if (m.quoted) {
			let type = Object.keys(m.quoted)[0]
			m.quoted = m.quoted[type]
			if (['productMessage'].includes(type)) {
				type = Object.keys(m.quoted)[0]
				m.quoted = m.quoted[type]
			}
			if (typeof m.quoted === 'string') m.quoted = {
				text: m.quoted
			}
			m.quoted.id = m.msg.contextInfo.stanzaId
			m.quoted.chat = m.msg.contextInfo.remoteJid || m.chat
			m.quoted.isBaileys = m.quoted.id ? m.quoted.id.startsWith('BAE5') && m.quoted.id.length === 16 : false
			m.quoted.sender = m.msg.contextInfo.participant.split(':')[0] || m.msg.contextInfo.participant
			m.quoted.fromMe = m.quoted.sender === (conn.user && conn.user.id)
			m.quoted.text = m.quoted.text || m.quoted.caption || ''
			m.quoted.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []
			let vM = m.quoted.fakeObj = M.fromObject({
				key: {
					remoteJid: m.quoted.chat,
					fromMe: m.quoted.fromMe,
					id: m.quoted.id
				},
				message: quoted,
				...(m.isGroup ? { participant: m.quoted.sender } : {})
			})
			m.quoted.download = () => downloadMediaMessage(m.quoted)
		}
	}
	m.text = (m.mtype == 'listResponseMessage' ? m.msg.singleSelectReply.selectedRowId : '') || m.msg.text || m.msg.caption || m.msg || ''
	
	m.reply = (text, chatId, mention) => conn.sendMessage(chatId ? chatId : m.chat, { text: text, contextInfo: { mentionedJid: mention ? mention : [m.sender] } }, { quoted: m, detectLinks: false })
	
	return m
}

module.exports = { getRandom, smsg }
