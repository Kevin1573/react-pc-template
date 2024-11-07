export const Local = {
  // 写入永久缓存
  set(key: string, value: any) {
    window.localStorage.setItem(key, JSON.stringify(value));
  },
  // 获取永久缓存
  get(key: string) {
    const storageVal = window.localStorage.getItem(key);
    if (storageVal) {
      return JSON.parse(storageVal);
    } else {
      return null;
    }
  },
  // 是否存在永久缓存
  has(key: string) {
    return window.localStorage.getItem(key) !== null;
  },
  // 删除永久缓存
  remove(key: string) {
    window.localStorage.removeItem(key);
  },
  // 清空永久缓存
  clear() {
    window.localStorage.clear();
  },
};
