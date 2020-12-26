import Websocket from 'ws';
import DetailedWikiEvent from './interfaces/DetailedWikiEvent';
import { fromEvent } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { getContributionType } from './utils/contribution-type';

const ws = new Websocket('ws://localhost:3000/detailed-recent-changes');

ws.on('open', () => {
  ws.send(new Date().toISOString());
  console.log('Connected to Recent Changes Service');
});

fromEvent(ws, 'message')
  .pipe(
    pluck('data'),
    map(
      (message: any): DetailedWikiEvent => {
        const event = JSON.parse(message) as DetailedWikiEvent;
        if (event.type === 'edit' && !event.revision.missing) {
          event.revision.contributionType = getContributionType(event);
        }
        return event;
      },
    ),
  )
  .subscribe(console.log);
