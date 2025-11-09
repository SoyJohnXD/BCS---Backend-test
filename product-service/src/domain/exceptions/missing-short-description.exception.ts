export class MissingShortDescriptionException extends Error {
  constructor() {
    super('Short description is required');
  }
}
