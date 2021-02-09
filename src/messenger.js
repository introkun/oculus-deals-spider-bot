import TelegramBot from 'node-telegram-bot-api'

class Messenger {
    constructor(token, channel) {
        console.log('Initialising bot API...')
        this.channel = channel
        this.bot = new TelegramBot(token, {polling: false})
    }

    sendMessage(message) {
        this.bot.sendMessage(this.channel, message, {parse_mode: 'markdown'})
    }
}

export default Messenger