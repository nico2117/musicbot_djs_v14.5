class HttpError extends Error {
  constructor() {
    super();
  }
}

class InternalServerError extends HttpError {
  constructor(msg = 'internal server error') {
    super();
    this.code = 500;
    this.message = msg;
  }
}

class BadRequest extends HttpError {
  constructor(msg = 'bad request') {
    super();
    this.code = 400;
    this.message = msg;
  }
}

class NotFound extends HttpError {
  constructor(msg = 'resource not found') {
    super();
    this.code = 404;
    this.message = msg;
  }
}

module.exports = { HttpError, InternalServerError, BadRequest, NotFound };
