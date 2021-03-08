/**
 * @description 按特定长度切割数组
 * @param {T[]} array 需要分组的数组
 * @param {number} subGroupLength 切割长度
 * @returns {T[][]} 切割后的数组
 */
export const groupSplitArray = <T>(
  array: T[],
  subGroupLength: number
): T[][] => {
  let index = 0;
  const newArray = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
};
