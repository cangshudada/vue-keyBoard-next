/**
 * @description 深拷贝数组或者对象
 * @param {T} target
 * @returns
 */
export default function useDeepCopy<T extends unknown>(sourceData: T): T {
  if (Array.isArray(sourceData)) {
    return sourceData.map(item => useDeepCopy(item)) as T;
  }
  const deepObj: T = {} as T;
  for (let key in sourceData) {
    if (typeof sourceData[key] === 'object' && sourceData[key] !== null) {
      deepObj[key] = useDeepCopy(sourceData[key]);
    } else {
      deepObj[key] = sourceData[key];
    }
  }
  return deepObj;
}
