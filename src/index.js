import Datastore from 'nedb';
import config from 'config';
import settings from 'settings-store';
import Messenger from './messenger.js';
import DealsItem from './models/dealsItem.js';
import ConsoleLogger from './consoleLogger.js';

ConsoleLogger.log('Initialising settings...');
const settingsOpts = {
  appName: 'oculus-deals-spider-bot',
  reverseDNS: 'com.oculus.deals.spider.bot',
  enableReloading: false,
};
settings.init(settingsOpts);

const dbPath = config.get('DbPath');

ConsoleLogger.log(`Initialising DB ${dbPath}...`);
const db = new Datastore({filename: dbPath, autoload: true});

const token = config.get('TelegramToken');
const telegramChannel = config.get('TelegramChannel');
const messenger = new Messenger(token, telegramChannel);

ConsoleLogger.log('Looking for deals in DB...');
const dbLastCheckTime = settings.value('dbLastCheckTime', 0);
ConsoleLogger.log(`dbLastCheckTime is ${dbLastCheckTime}`);
db.find({
  createdAt: {
    $gte: (new Date(dbLastCheckTime)).toISOString(),
  }}, function(err, docs) {
  if (err) {
    ConsoleLogger.log(`Error selecting from DB: ${err}`);
    return;
  }

  ConsoleLogger.log('Saving dbLastCheckTime...');
  settings.setValue('dbLastCheckTime', Date.now());

  ConsoleLogger.log('Sending messages to Telegram channel...');
  let i = 0;
  const messages = [];
  docs.forEach((doc) => {
    ConsoleLogger.log(doc);
    ConsoleLogger.log(`queuing #${i} message`);
    i++;
    messages.push('📉 ' + new DealsItem(doc, ['deal', 'oculus']));
  });
  if (messages && messages.length > 0) {
    ConsoleLogger.log(`start sending messages`);
    messenger.sendMessages(messages);
  } else {
    ConsoleLogger.log(`nothing to send`);
  }
});
