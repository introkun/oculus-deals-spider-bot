import Datastore from '@seald-io/nedb';
import config from 'config';

const dbPath = config.get('DbPath');

console.log(`Initialising DB (${dbPath})...`);
const db = new Datastore({filename: dbPath, autoload: true, onload: (error) => {
  if (error) {
    console.log(`Failed to load DB: ${error}`);
  }
}});

db.findOne({}).sort({createdAt: -1}).exec((err, doc) => {
  if (err) {
    console.log(`Error selecting from DB: ${err}`);
    return;
  }

  if (doc) {
    const now = new Date();
    delete doc._id;
    doc.createdAt = now.toISOString();
    console.log(doc);

    db.insert(doc, function(err, newItem) {
      if (err) {
        console.log(`Error inserting into DB: ${err}`);
        return;
      }
      console.log(`Successfully inserted into DB`);
    });
  }
});
