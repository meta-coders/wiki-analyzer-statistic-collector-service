import Websocket, { MessageEvent } from 'ws';
import { fromEvent, Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';
import { getContributionType } from './utils/contribution-type';
import DetailedWikiEvent from './interfaces/DetailedWikiEvent';

export interface ConnectOptions {
  fromDate: Date;
}

export const connect = (
  options: ConnectOptions
): Observable<DetailedWikiEvent> => {
  const socket = new Websocket(process.env.RECENT_CHANGES_API_URL)
    .on('open', () => {
      socket.send(options.fromDate.toISOString());
      console.log('Connected to Recent Changes Service');
    });

  return fromEvent<MessageEvent>(socket, 'message')
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
    );
};
