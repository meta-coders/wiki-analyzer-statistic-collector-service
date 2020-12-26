import Websocket, {MessageEvent} from "ws";
import DBclient from "./DBStorage";
import path from "path";
import DetailedWikiEvent from "./interfaces/DetailedWikiEvent";
import {defer, fromEvent, Observable} from "rxjs";
import {map, pluck, tap} from "rxjs/operators";
import {stringify} from "querystring";
import concurrentConcat from "./utils/ConcurrentConcat";

const ws = new Websocket("ws://localhost:3000/detailed-recent-changes");

ws.on(
    "open",
    () => {
        ws.send(new Date().toISOString());
        console.log("Connected to Recent Changes Service");
        // ws.close();
    }
);

//
// ws.on(
//     'message',
//     async (data: string) => {
//         const message = JSON.parse(data);
//         console.log(message)
//     }
// );

const testPromise = async(): Promise<String> => {
    return 'sss';
};



const eventStream = fromEvent(ws, 'message')
    .pipe(
        pluck('data'),
        map((message: any): DetailedWikiEvent => JSON.parse(message) as DetailedWikiEvent)
    // ).subscribe(function(b) { console.log(b); });
    ).pipe(
        concurrentConcat(
            (event: DetailedWikiEvent): Observable<String> => {
                return defer(() =>
                    testPromise()
                )
            }
        )
    ).subscribe(function(b) { console.log(b); });


DBclient.query("SELECT * FROM contributions",
    (err: Error, res: String) => {
        if (err) throw err;
        // console.log(res);
        DBclient.end();
    }
);
