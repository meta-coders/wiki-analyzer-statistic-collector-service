import Websocket from 'ws';

const ws = new Websocket('ws://localhost:3000/recent-changes');

ws.on('open', () => {
  console.log('Connected to Recent Changes Service');
  ws.close();
});
