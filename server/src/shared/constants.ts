export const REQUEST_ID_HEADER = 'x-request-id';
export const REQUEST_USER_ID_HEADER = 'x-request-user-id';

export interface RequestContext {
  requestId?: string;
  userId?: string;
}
