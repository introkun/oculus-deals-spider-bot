import TelegramBot from 'node-telegram-bot-api'
import Datastore from 'nedb'
import config from 'config'
import settings from "settings-store"

console.log('Initialising settings...')
const settingsOpts = {
  appName:       "oculus-deals-spider-bot",
  reverseDNS:    "com.oculus.deals.spider.bot",
  enableReloading: false
}
settings.init(settingsOpts)

const token = config.get('TelegramToken')
const telegramChannel = config.get('TelegramChannel')
const dbPath = config.get('DbPath')

console.log('Initialising bot API...')
const bot = new TelegramBot(token, {polling: false})

console.log('Initialising DB...')
let db = new Datastore({filename: dbPath, autoload: true, timestampData: true})

const docToString = (doc) => {
  let result = `*${doc.name}* \`-${doc.discountPercent}%\` `

  result += `(_${doc.priceCurrency}${doc.price}_ ➡ _${doc.salePriceCurrency}${doc.salePrice}_)`

  if (doc.url)
    result += `\n${doc.url}`

  return result
}

console.log('Looking for deals in DB...')
const dbLastCheckTime = settings.value("dbLastCheckTime", 0)
console.log(`dbLastCheckTime is ${dbLastCheckTime}`)
db.find({
  createdAt: {
    $gte: (new Date(dbLastCheckTime)).toISOString()
  } }, function (err, docs) {
  if (err) {
    console.log(`Error selecting from DB: ${err}`)
    return
  }

  console.log('Saving dbLastCheckTime...')
  settings.setValue("dbLastCheckTime", Date.now())

  console.log('Sending messages to Telegram channel...')
  docs.forEach(doc => {
    console.log(doc)
    bot.sendMessage(telegramChannel, '📉 ' + docToString(doc), {parse_mode: 'markdown'})
  })
})