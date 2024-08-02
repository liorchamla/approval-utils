import { join } from 'node:path'
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { get } from 'stack-trace'
import { assert } from 'vitest'

let approvalMessages: string[] = []
let testSuiteName = ''

const logMessage = (message: string) => {
    approvalMessages.push(message)
}

const spy = (name: string, returnValue: any) => {
    return (...params: any[]) => {
        logMessage(`call to ${name}: ${JSON.stringify(params)}`)

        if (returnValue) {
            logMessage(`and returns: ${JSON.stringify(returnValue)}`)
            return returnValue
        }
    }
}

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

const approveCombinations = (testName: string, callable: Function, paramsSet: any[][]) => {
    testSuiteName = testName

    const combinations = generateCombinations(paramsSet)

    combinations.forEach(params => {
        const returnValue = callable(...params)
        logMessage(`return value: ${JSON.stringify(returnValue)}`)
    })

    saveMessagesToFile()
}

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
