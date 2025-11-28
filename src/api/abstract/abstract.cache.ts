// JSON-serializable types for cache storage
export type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
export interface JSONObject {
  [key: string]: JSONValue;
}
export interface JSONArray extends Array<JSONValue> {}

export interface ICache {
  get<T = unknown>(key: string): Promise<T | null>;

  hGet(key: string, field: string): Promise<unknown>;

  set(key: string, value: JSONValue, ttl?: number): void;

  hSet(key: string, field: string, value: JSONValue): Promise<void>;

  has(key: string): Promise<boolean>;

  keys(appendCriteria?: string): Promise<string[]>;

  delete(key: string | string[]): Promise<number>;

  hDelete(key: string, field: string): Promise<number>;

  deleteAll(appendCriteria?: string): Promise<number>;
}
