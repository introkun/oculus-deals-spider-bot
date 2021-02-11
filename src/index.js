import Datastore from 'nedb'
import config from 'config'
import settings from "settings-store"
import Messenger from './messenger.js'
import DealsItem from './models/dealsItem.js'

let delaySec = 1
const delay = interval => {
  console.log(`interval = ${interval}`)
  return new Promise(resolve => setTimeout(resolve, interval))
}

async function sendMessage(messenger, message, index) {
  await delay(index * delaySec * 1000)
  delaySec += 10
  messenger.sendMessage(message)
}

console.log('Initialising settings...')
const settingsOpts = {
  appName:       "oculus-deals-spider-bot",
  reverseDNS:    "com.oculus.deals.spider.bot",
  enableReloading: false
}
settings.init(settingsOpts)

const dbPath = config.get('DbPath')

console.log('Initialising DB...')
let db = new Datastore({filename: dbPath, autoload: true})

const token = config.get('TelegramToken')
const telegramChannel = config.get('TelegramChannel')
let messenger = new Messenger(token, telegramChannel)

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
  let i = 1
  docs.forEach(doc => {
    console.log(doc)
    sendMessage(messenger, '📉 ' + new DealsItem(doc, ["deal", "oculus"]), i)
    i++
  })
})