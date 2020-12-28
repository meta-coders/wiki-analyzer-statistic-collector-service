import * as pollingService from './polling-service';
import {getLastTimeStamp} from "./DBStorage";

getLastTimeStamp().then(res =>
    pollingService
        .connect({ fromDate: res })
        .subscribe(console.log, console.error)
);

