import CustomError from "./CustomError";

class UnprocessableEntityError extends CustomError {
  constructor(message: string, details?: Object) {
    super(message, 422, details);
    this.name = "UnprocessableEntityError";
  }
}

export default UnprocessableEntityError;
