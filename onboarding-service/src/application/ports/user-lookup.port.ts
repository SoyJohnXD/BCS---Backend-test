export const IUserLookupPort = Symbol('IUserLookupPort');

export interface IUserLookupPort {
  exists(userId: string): Promise<boolean>;
}
