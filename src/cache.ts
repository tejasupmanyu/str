// Cache
export const __cache = new Map();

export function cacheGet(key: string): any {
  return __cache.get(key);
}

export function cacheSet(key: string, value: any) {
  return __cache.set(key, value);
}

export function cacheClear() {
  __cache.clear();
}

export function cacheView() {
  let cacheObj = {};
  __cache.forEach((value: any, key: string) => (cacheObj[key] = value));
  return cacheObj;
}
