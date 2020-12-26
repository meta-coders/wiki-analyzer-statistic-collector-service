import Websocket from 'ws';
import DBclient from './DBStorage';
import path from 'path';


const ws = new Websocket('ws://localhost:3000/recent-changes');

ws.on('open', () => {
  console.log('Connected to Recent Changes Service');
  ws.close();
});

// ws.onmessage()

DBclient.query("SELECT * FROM contributions",
  (err: Error, res: String) => {
    if (err) throw err;
    // console.log(res);
    DBclient.end()
  }
);