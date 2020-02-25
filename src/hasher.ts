import hash from "object-hash";
// use WeakMap to store the object->key mapping
// so the objects can be garbage collected.
// WeakMap uses a hashtable under the hood, so the lookup
// complexity is almost O(1).
const table = new WeakMap();

export function hasher(args?: any[]): string {
  if (!args) return "";
  if (!args.length) return "";
  let key = "arg";
  for (let i = 0; i < args.length; ++i) {
    let _hash;
    if (typeof args[i] === "object") {
      if (!table.has(args[i])) {
        _hash = hash(args[i]);
        table.set(args[i], _hash);
      } else {
        _hash = table.get(args[i]);
      }
    }
    key += "@" + _hash;
  }
  return key;
}
