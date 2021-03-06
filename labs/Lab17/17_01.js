const redis = require('redis');
const client = redis.createClient();

client.connect().then(() => console.log('connect'));

client.on('connect', async () => {

    await client.set('user1', 'john')
    let user = await client.get('user1')
    console.log(user)

    await disconnect();
});

client.on('error', (err) => {throw err})

let disconnect = () => client.disconnect().then(() => console.log('disconnect'));