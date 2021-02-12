import TelegramBot from 'node-telegram-bot-api'
import ConsoleLogger from './consoleLogger.js'

class Messenger {
    constructor(token, channel) {
        ConsoleLogger.log('Initialising bot API...')
        this.channel = channel
        this.bot = new TelegramBot(token, {polling: false})
    }

    async sendMessages(messages) {
        const promises = messages.map((el, index) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    ConsoleLogger.log(`Sending Telegram message #${index}`)
                    this.bot.sendMessage(this.channel, el, {parse_mode: 'markdown'}).then(resolve())
                  }, (index + 1) * 5 * 1000)
            })
        })

        Promise.all(promises).then('Bulk message sending finished')
    }
}

export default Messenger