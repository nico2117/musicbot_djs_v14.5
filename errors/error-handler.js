const { HttpError, InternalServerError } = require('./app-errors');

function errorHandler(originalError, _req, res, _next) {
  let errorToSend;

  switch (true) {
    case originalError instanceof HttpError:
      errorToSend = originalError;
      break;

    default:
      // received unexpected error
      // !!! very important to log all unexpected errors  !!! 
      console.error('unexpected error occured. original error logged here: ', originalError);
      errorToSend = new InternalServerError();
      break;
  }

  res.status(errorToSend.code).json(errorToSend);
}

module.exports = { errorHandler };
