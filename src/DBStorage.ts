const { Client } = require('pg');


const client = new Client({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
});

client
    .connect()
    .then(() => console.log('Connected to DB'))
    .catch((err: Error) => console.error('Connection DB error', err.stack));

export default client;