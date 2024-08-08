/**
 * The `spy` helper is used to "mock" a function of the system we are testing. When the spy will be called,
 * it will store the parameters it was called with and return a "mock" value.
 *
 * @todo For now, the return value is typed as `any`, we should find a way to type it properly.
 *
 * @param name The name of the function we are spying on, it will be seen in the output
 * @param returnValue The "mock" value we want it to return
 */
declare const spy: (name: string, returnValue: any) => (...params: any[]) => any;
/**
 * This function is used to approve the output of a function that has been called with all possible combinations of parameters.
 *
 * @param testName The name of the test suite we are running, it will be used to save the output of the system we are testing to a file
 * @param callable The function we are testing
 * @param paramsSet An array of arrays, each array containing the possible values for a parameter of the function we are testing
 */
declare const approveCombinations: (testName: string, callable: Function, paramsSet: any[][]) => void;
export { spy, approveCombinations };
