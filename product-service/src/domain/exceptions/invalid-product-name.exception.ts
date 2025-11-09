export class InvalidProductNameException extends Error {
  constructor() {
    super('Product name is required');
  }
}
