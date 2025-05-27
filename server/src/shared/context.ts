import { AsyncLocalStorage } from 'node:async_hooks';
import { RequestContext } from './constants';

let currentContext: AsyncLocalStorage<RequestContext>;
export function context<T = RequestContext>() {
  if (!currentContext) {
    currentContext = new AsyncLocalStorage<RequestContext>();
  }
  return currentContext as AsyncLocalStorage<T>;
}
