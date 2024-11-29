abstract class BrowserStorageFake implements Storage {
  private store: { [key: string]: string } = {};

  private internalLength = 0;

  public get length() {
    return this.internalLength;
  }

  public readonly setItem = (key: string, value: string) => {
    this.store[key] = value;
    this.internalLength = Object.keys(this.store).length;
  };

  public readonly getItem = (key: string) => {
    return this.store[key];
  };

  public readonly removeItem = (key: string) => {
    delete this.store[key];
    this.internalLength = Object.keys(this.store).length;
  };

  public readonly key = (index: number) => {
    return Object.keys(this.store).at(index) ?? null;
  };

  public readonly clear = () => {
    throw new Error('Method not implemented.');
  };
}

export class LocalStorageFake extends BrowserStorageFake {}
export class SessionStorageFake extends BrowserStorageFake {}
