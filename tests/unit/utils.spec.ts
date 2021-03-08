import { groupSplitArray } from "@/utils";

describe("util test", () => {
  it("group split", async () => {
    const targetArray1 = [1, 2, 3];
    const targetArray2 = [1, 2, 3, 4, 5];
    const splitArray1 = groupSplitArray(targetArray1, 3);
    const splitArray2 = groupSplitArray(targetArray2, 3);
    expect(splitArray1.length).toBe(1);
    expect(splitArray2.length).toBe(2);
  });
});
