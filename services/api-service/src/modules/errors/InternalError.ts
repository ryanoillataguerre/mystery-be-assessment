import CustomError from "./CustomError";

class InternalError extends CustomError {
  constructor(message: string, details?: Object) {
    super(message, 500, details);
    this.name = "InternalError";
  }
}

export default InternalError;
