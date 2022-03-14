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
const pino = require('pino')

/*
    Js
*/
const { smsg } = require('./lib/functions')

const start = async() => {
  const inky = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['InkyBot-MD','',''],
    auth: state,
    version: [2, 2204, 13]
  })
  
  inky.ev.on('messages.upsert', (mek) => {
    try {
      const x = mek.messages[0]
      if (!x.message) return
      
      x.message = (Object.keys(x.message)[0] === 'ephemeralMessage') ? x.message.ephemeralMessage.message : x.message
      if (x.key && x.key.remoteJid === 'status@broadcast') return
      
      const m = smsg(inky, x)
      require('./message/upsert')(inky, m, mek)
    } catch (e) {
      var isError = String(e)
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
