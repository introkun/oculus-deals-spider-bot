import TelegramBot from 'node-telegram-bot-api'

let delaySec = 5
const delay = interval => {
    console.log(`interval = ${interval}`)
    return new Promise(resolve => setTimeout(resolve, interval))
}

class Messenger {
    constructor(token, channel) {
        console.log('Initialising bot API...')
        this.channel = channel
        this.bot = new TelegramBot(token, {polling: false})
    }

    async sendMessage(message) {
        await delay(delaySec * 1000)
        delaySec += 10
        this.bot.sendMessage(this.channel, message, {parse_mode: 'markdown'})
    }
}

export default Messenger