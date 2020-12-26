const format = require( 'pg-format');
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



const writeToDb = () => {
    const values = [
        ['user1'],
        ['user2']
    ];

    const valuesContr = [
        [new Date().toISOString(), 'test', 'typo_editting'],
        [new Date().toISOString(), 'test2', 'content_addition']
    ];
    client.query(
        format('INSERT INTO users (username) VALUES %L', values),
        [],
        (err: Error, result: any) => {
            console.log(err);
            console.log(result);
        }
    );
    client.query(
        format('INSERT INTO contributions (timestamp, topic, contribution_type) VALUES %L', valuesContr),
        [],
        (err: Error, result: any) => {
            console.log(err);
            console.log(result);
        }
    );
};

writeToDb();

export {
    writeToDb
}



export default client;