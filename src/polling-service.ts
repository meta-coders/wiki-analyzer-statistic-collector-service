import Websocket, { MessageEvent } from 'ws';
import { fromEvent, Observable } from 'rxjs';
import { map, pluck, mergeMap } from 'rxjs/operators';
import { getContributionType } from './utils/contribution-type';
import DetailedWikiEvent from './interfaces/DetailedWikiEvent';
import { fromPromise } from 'rxjs/internal-compatibility';

export interface ConnectOptions {
  fromDate: Date;
}

const connectToRecentChangesAPI = (
  options: ConnectOptions,
): Observable<Websocket> =>
  fromPromise(
    new Promise((resolve, reject) => {
      const socket = new Websocket(process.env.RECENT_CHANGES_API_URL)
        .on('open', () => {
          socket.send(options.fromDate.toISOString());
          console.log('Connected to Recent Changes Service');
          resolve(socket);
        })
        .on('error', reject);
    }),
  );

export const connect = (
  options: ConnectOptions,
): Observable<DetailedWikiEvent> =>
  connectToRecentChangesAPI(options).pipe(
    mergeMap((socket) => fromEvent<MessageEvent>(socket, 'message')),
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
