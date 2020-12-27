import WebSocket from 'websocket';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { getContributionType } from './utils/contribution-type';
import DetailedWikiEvent from './interfaces/DetailedWikiEvent';
import { WikiEventType } from './interfaces/WikiEvent';

export interface ConnectOptions {
  fromDate: Date;
}

export const connect = (
  options: ConnectOptions,
): Observable<DetailedWikiEvent> => {
  const subject = webSocket<DetailedWikiEvent | string>({
    url: process.env.RECENT_CHANGES_API_URL,
    WebSocketCtor: WebSocket.w3cwebsocket,
    serializer: (value) =>
      typeof value === 'object' ? JSON.stringify(value) : value,
  });

  subject.next(options.fromDate.toISOString());

  return subject.pipe(
    map(
      (message: DetailedWikiEvent | string): DetailedWikiEvent => {
        const event =
          typeof message === 'string'
            ? (JSON.parse(message) as DetailedWikiEvent)
            : message;
        if (event.type === WikiEventType.EDIT) {
          event.revision.contributionType = getContributionType(event.revision);
        }
        return event;
      },
    ),
  );
};
