import Datastore from 'nedb'
import config from 'config'
import settings from "settings-store"
import Messenger from './messenger.js'
import DealsItem from './models/dealsItem.js'

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
  docs.forEach(doc => {
    console.log(doc)
    messenger.sendMessage('📉 ' + new DealsItem(doc, ["deal", "oculus"]))
  })
})