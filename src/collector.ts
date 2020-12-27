import * as pollingService from './polling-service';

pollingService
  .connect({ fromDate: new Date() })
  .subscribe(console.log, console.error);
