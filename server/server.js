/*
const {MongoClient} = require('mongodb');

const uri = "mongodb+srv://mainDbUser:dw1SN5SPRhwk7yhZ@cluster0.rjaow.mongodb.net/uniduti?retryWrites=true&w=majority"

const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port);


async function main() {

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
*/