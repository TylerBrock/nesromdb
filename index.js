const fs = require('fs');
const { parseString } = require('xml2js');
const { MongoClient } = require('mongodb');

console.log(`Reading ${process.argv[2]}`);
const xmlFile = fs.readFileSync(process.argv[2]);

async function run() {
  const mongo = await MongoClient.connect('mongodb://localhost');
  const db = await mongo.db('nes');
  await db.dropDatabase();
  const coll = await db.collection('games');

  const promise = new Promise((resolve, reject) => {
    parseString(String(xmlFile), { mergeAttrs: true, explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        coll.insertMany(result.database.game).then((result) => {
          resolve('done!');
        });
      }
      mongo.close();
    });
  });

  return promise;
}

run().then(console.log, console.error);
