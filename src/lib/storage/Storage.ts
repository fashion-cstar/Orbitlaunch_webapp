import LocalForage from "localforage";

export default class Storage {
  identifier: string;
  constructor(identifier: string) {
    this.identifier = identifier;
  }

  private getCompleteKey(key: string) {
    return `${this.identifier}:${key}`;
  }

  get = async (key: string) => {
    const value = await LocalForage.getItem(this.getCompleteKey(key));
    return value;
  };

  set = async (key: string, value: any) => {
    const result = await LocalForage.setItem(this.getCompleteKey(key), value);
    return result;
  };
}
