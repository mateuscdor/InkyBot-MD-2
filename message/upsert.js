require('../config')
/*
    Librerias
*/
const { exec } = require('child_process')
const util = require('util')

module.exports = inky = async(inky, m, mek) => {
  try {
    const from = m.chat
    const quoted = m.quoted ? m.quoted : m
    const body = m.body
    
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
    const isStaff = staff.includes(senderNumber) || isMe
    
    if (!inky.public) {
			if (!isStaff) return
		}
    if (m.isBaileys) return
    
    switch (command) {
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
