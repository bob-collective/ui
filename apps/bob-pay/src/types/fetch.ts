export class FetchError extends Error {
  status: number;
  responseText: string;

  constructor(message: string, status: number, responseText: string) {
    super(message);
    this.status = status;
    this.responseText = responseText;

    // Maintains proper stack trace in Node.js environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }

    this.name = 'FetchError'; // Set the error name
  }
}
