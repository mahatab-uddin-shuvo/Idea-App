
const {MongoClient,ObjectID} = require('mongodb')

const id = new ObjectID();
// console.log(id.id,id.id.length)
// console.log(id.toString(),id.toString().length)
// console.log(id.getTimestamp())

const uri = 'mongodb://localhost:27017';
const dbName = 'ideas-app'
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function dbOps() {
    try {
        //connecting client 
        await client.connect();
        console.log('Client Connected Successfully');
        //db reference
        const db = client.db(dbName);

         const ideasColl = db.collection('ideas');

        // const result = await ideasColl.insertOne({
        //     _id:id,
        //     info: 'Additional info'
        // })
        //console.log(result.ops)

        const result = await ideasColl.findOne({
            _id:new ObjectID('5f59dc6c26330f1c7c0c3e4e')
        })
         console.log(result)

        //close connection
        client.close()

    } catch (err) {
        console.log(err);
    }
}

dbOps();