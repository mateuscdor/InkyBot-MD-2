/*
    Libreria
*/
const {
    default: makeWASocket,
    useSingleFileAuthState,
    DisconnectReason,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage
} = require('@adiwajshing/baileys-md')
const { state, saveState } = useSingleFileAuthState('./session.json')
const fs = require('fs')
const P = require('pino')

/*
    Js
*/
const { smsg } = require('./lib/functions')

function nocache(module, cb = () => { }) {
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}
function uncache(module = '.') {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(module)]
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

const start = async() => {
	const inky = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		browser: ['InkyBot-MD','Safari','1.0.1'],
		auth: state,
		version: [2, 2204, 13]
	})
	
	require('./message/upsert.js')
	nocache('./message/upsert.js', module => console.log('El archivo upsert.js ha sido actualizado'))
	require('./lib/functions.js')
	nocache('./lib/functions.js', module => console.log('El archivo functions.js ha sido actualizado'))
	    
	inky.ev.on('messages.upsert', (mek) => {
		try {
			const x = mek.messages[0]
			if (!x.message) return
			
			x.message = (Object.keys(x.message)[0] === 'ephemeralMessage') ? x.message.ephemeralMessage.message : x.message
			if (x.key && x.key.remoteJid === 'status@broadcast') return
			
			const m = smsg(inky, x)
			require('./message/upsert')(inky, m, mek)
		} catch(e) {
			var isError = String(e)
			
			if (isError.includes('toString')) return
			
			console.log(isError)
		}
	})
	
	inky.ev.on('connection.update', async (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log('Bot Desconectado')
		}
	})
	
	inky.ev.on('creds.update', saveState)
	
	return inky
}

start()
