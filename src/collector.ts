import Websocket, { MessageEvent } from 'ws';
import { fromEvent } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { getContributionType } from './utils/contribution-type';
import DetailedWikiEvent from './interfaces/DetailedWikiEvent';

const ws = new Websocket(process.env.RECENT_CHANGES_API_URL);

ws.on('open', () => {
  ws.send(new Date().toISOString());
  console.log('Connected to Recent Changes Service');
});

fromEvent<MessageEvent>(ws, 'message')
  .pipe(
    pluck('data'),
    map(
      (message: Websocket.Data): DetailedWikiEvent => {
        const event = JSON.parse(message.toString()) as DetailedWikiEvent;
        if (event.type === 'edit' && !event.revision.missing) {
          event.revision.contributionType = getContributionType(event);
        }
        return event;
      },
    ),
  )
  .subscribe(console.log);
