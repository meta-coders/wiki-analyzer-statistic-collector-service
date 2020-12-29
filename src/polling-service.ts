import WebSocket from 'websocket';
import { defer, Observable } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { webSocket } from 'rxjs/webSocket';
import { getContributionType } from './utils/contribution-type';
import DetailedWikiEvent, {
  DetailedWikiEditEvent,
} from './interfaces/DetailedWikiEvent';
import { WikiEventType } from './interfaces/WikiEvent';
import { insertUserId } from './DBStorage';

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
      (message: DetailedWikiEvent | string): DetailedWikiEditEvent => {
        const event =
          typeof message === 'string'
            ? (JSON.parse(message) as DetailedWikiEvent)
            : message;
        if (event.type === WikiEventType.EDIT) {
          event.revision.contributionType = getContributionType(event.revision);
        }
        return event as DetailedWikiEditEvent;
      },
    ),
    filter(
      (event: DetailedWikiEditEvent): boolean =>
        event.type !== WikiEventType.LOG,
    ),
    concatMap((value: DetailedWikiEditEvent) => {
      return defer(() => insertUserId(value));
    }),
  );
};
