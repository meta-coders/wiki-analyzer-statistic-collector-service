import { Client } from 'pg';

const client = new Client();

client
  .connect()
  .then(() => console.log('Connected to DB'))
  .catch((err: Error) => console.error('Connection DB error', err.stack));

export default client;
