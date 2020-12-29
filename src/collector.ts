import * as pollingService from './polling-service';
import { getLastTimeStamp } from './DBStorage';

getLastTimeStamp().then((res) =>
  pollingService
    .connect({ fromDate: res })
    .subscribe(
        value => {
            if(process.env.LOG_LEVEL === 'debug')
                console.log(value)
        },
        console.error
    ),
);
