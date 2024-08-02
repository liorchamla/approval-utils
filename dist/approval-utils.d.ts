declare const spy: (name: string, returnValue: any) => (...params: any[]) => any;
declare const approveCombinations: (testName: string, callable: Function, paramsSet: any[][]) => void;
export { spy, approveCombinations };
