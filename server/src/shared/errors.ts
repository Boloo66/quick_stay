import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export class RequestError extends Error {
  public override name: string;

  constructor(
    message: string,
    name = '',
    public statusCode?: number
  ) {
    super(message);
    const phraseName =
      this.statusCode &&
      getReasonPhrase(this.statusCode)?.toUpperCase().replace(/ /g, '_');
    this.name = name || phraseName || 'UnidentifiedError';
    Error.captureStackTrace(this);
  }
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public label: `${string}Error`
  ) {
    super(message);
    this.name = this.label;
    Error.captureStackTrace(this);
  }
}

export const createServiceError = (
  message: string,
  label: `${string}Error`
) => {
  return new ServiceError(message, label);
};

export const createRequestError = (
  message: string,
  name?: string,
  statusCode?: number
) => {
  if (name === 'CastError') {
    message = 'Bad request, Invalid Id';
    statusCode = StatusCodes.BAD_REQUEST;
  }
  return new RequestError(message, name, statusCode);
};
