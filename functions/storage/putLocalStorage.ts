import { getLocalStorageByKey } from "./getLocalStorage";

export function putStorage<T>(key: string, object: T): T | null {
    localStorage.setItem(key, JSON.stringify(object));

    return getLocalStorageByKey(key);
}