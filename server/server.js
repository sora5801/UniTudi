const {MongoClient} = require('mongodb')

async function main() {

    const uri = "mongodb+srv://mainDbUser:dw1SN5SPRhwk7yhZ@cluster0.rjaow.mongodb.net/uniduti?retryWrites=true&w=majority"

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const database = client.db('uniduti');
        const users = database.collection('user');

        // Query for a user with the name 'Anna Nakashimo'
        const query = { user_name: 'annanakashimo' };
        const user = await users.findOne(query);

        console.log(user);
    } finally {
        await client.close();
    }
}

main().catch(console.dir);