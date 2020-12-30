import { MonoTypeOperatorFunction, Observable, throwError, timer } from 'rxjs';
import {concatMap, retryWhen, tap} from 'rxjs/operators';

export default function retryBackoff<T>(
  maxRetries: number,
  timeout: number,
  tag: string,
  onSuccess: () => void,
): MonoTypeOperatorFunction<T> {
  return (input: Observable<T>) => {
    return input.pipe(
      retryWhen((errors) => {
        return errors.pipe(
          concatMap((error, attempt) => {
            const retryAttempt = attempt + 1;

            if (retryAttempt > maxRetries) {
              return throwError(error);
            }

            console.log(`[${tag}]: ${error}, Attempt: ${retryAttempt}`);

            return timer(timeout).pipe(tap(onSuccess));
          }),
        );
      }),
    );
  };
}
