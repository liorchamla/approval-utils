/*******************
 * @package @liorchamla/approval-utils
 * @description A collection of utilities to help with approval testing with vitest
 *******************/
import { join } from 'node:path'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { get } from 'stack-trace'
import { assert } from 'vitest'

/**
 * When we execute approval tests, we want to capture the output of the function we are testing
 * and compare it to the expected output.
 * 
 * To do that, we need to store `strings` that represent the output of the system we are testing.
 */
let approvalMessages: string[] = []

/**
 * We also want to store the name of the test suite we are running, so we can save the output
 * of the system we are testing to a file with the same name.
 */
let testSuiteName = ''

/**
 * This helper function is used to store the output of the system we are testing.
 * @param message The message we want to store as an output of the system we are testing
 */
const logMessage = (message: string) => {
    approvalMessages.push(message)
}

/**
 * The `spy` helper is used to "mock" a function of the system we are testing. When the spy will be called,
 * it will store the parameters it was called with and return a "mock" value.
 * 
 * @todo For now, the return value is typed as `any`, we should find a way to type it properly.
 * 
 * @param name The name of the function we are spying on, it will be seen in the output
 * @param returnValue The "mock" value we want it to return
 */
const spy = (name: string, returnValue: any = "NO_VALUE") => {
    return (...params: any[]) => {
        logMessage(`call to ${name}: ${JSON.stringify(params)}`)

        if (returnValue === "NO_VALUE") {
            return
        }

        logMessage(`and returns: ${JSON.stringify(returnValue)}`)
        return returnValue
    }
}

/**
 * A helper function to generate all possible combinations of parameters for a function.
 */
const generateCombinations = (arrays: any[][], prefix: any[] = []) => {
    if (arrays.length === 0) {
        return [prefix]
    }

    const result: any[] = []
    const firstArray = arrays[0]
    const remainingArrays = arrays.slice(1)
    for (const value of firstArray) {
        result.push(...generateCombinations(remainingArrays, [...prefix, value]))
    }
    return result
}

/**
 * This function is used to approve the output of a function that has been called with all possible combinations of parameters.
 * 
 * @param testName The name of the test suite we are running, it will be used to save the output of the system we are testing to a file
 * @param callable The function we are testing
 * @param paramsSet An array of arrays, each array containing the possible values for a parameter of the function we are testing
 */
const approveCombinations = (testName: string, callable: Function, paramsSet: any[][]) => {
    testSuiteName = testName

    const combinations = generateCombinations(paramsSet)

    combinations.forEach(params => {
        const returnValue = callable(...params)
        logMessage(`return value: ${JSON.stringify(returnValue)}`)
    })

    saveMessagesToFile()
}

/**
 * This function is used to save the output of the system we are testing to a file.
 * It uses the `stack-trace` package to get the name of the file that called the function in order
 * to store the output in the same folder as the test suite.
 */
const saveMessagesToFile = () => {
    const callerFile = get()[2].getFileName().split('/').slice(0, -1).join('/')

    if (!existsSync(join(callerFile, 'golden-master'))) {
        // Create golden-master folder if it doesn't exist
        mkdirSync(join(callerFile, 'golden-master'))
    }
    const filePath = join(callerFile, `golden-master/${testSuiteName}.received`)
    const filePathApproved = join(callerFile, `golden-master/${testSuiteName}.approved`)
    writeFileSync(filePath, approvalMessages.join('\n'), 'utf-8')

    if (!existsSync(filePathApproved)) {
        writeFileSync(filePathApproved, '', 'utf-8')
    }

    approvalMessages = [] // Clear messages after saving

    const received = readFileSync(filePath).toString()
    const approved = readFileSync(filePathApproved).toString()

    assert(received === approved, `Received output does not match approved output (${approved === '' ? 'approved output seems to be empty, please copy past the golden master into it' : 'approved output is not empty, you may have break the golden master'})`)
}

export {
    spy,
    approveCombinations
}
