export function getLocalStorageByKey<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    const itemRecovered = localStorage.getItem(key);
    
    return itemRecovered ? JSON.parse(itemRecovered) as T : null;
}