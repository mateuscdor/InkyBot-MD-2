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
    
    inky.ev.on('messages.upsert', (mek) => {
        const x = mek.messages[0]
        if (!x.message) return
        
        x.message = (Object.keys(x.message)[0] === 'ephemeralMessage') ? x.message.ephemeralMessage.message : x.message
        if (x.key && x.key.remoteJid === 'status@broadcast') return
        
        const m = smsg(inky, x)
	console.log(JSON.stringify(m, null, 2))
        require('./message/upsert')(inky, m, mek)
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
