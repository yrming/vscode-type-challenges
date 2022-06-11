import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'
import * as YAML from 'js-yaml'
import type { Question } from '../type'
import { getWorkspaceFolder } from './settings'

const rootPath = path.join(__dirname, '..', '..', 'resources', 'questions')

export async function getAllQuestions(): Promise<Question[]> {
  const localQuestions = getLocalQuestions()
  const localErrorQuestions = await getLocalErrorQuestions()
  const result: Question[] = []
  const questions = fs.readdirSync(rootPath)
  questions.forEach((folderName) => {
    const question: Question = {}
    const reg = /^(\d+)-([\s\S]+?)-([\s\S]+)$/
    const matches = folderName.match(reg)
    if (Array.isArray(matches)) {
      question.idx = parseInt(matches[1])
      question.difficulty = matches[2]
      question._original = folderName
      question._status = 'todo'
      if (localQuestions.includes(`${folderName}.ts`)) {
        if (localErrorQuestions.find((errorMsg) => errorMsg.includes(folderName))) {
          question._status = 'error'
        } else {
          question._status = 'complete'
        }
      }
    }

    const templatePath = path.join(rootPath, folderName, 'template.tc')
    if (fs.existsSync(templatePath)) {
      const template = fs.readFileSync(templatePath).toString()
      question.template = template
    }

    const testCasesPath = path.join(rootPath, folderName, 'test-cases.tc')
    if (fs.existsSync(testCasesPath)) {
      const testCases = fs.readFileSync(testCasesPath).toString()
      question.testCases = testCases
    }

    const infoPath = path.join(rootPath, folderName, 'info.yml')
    if (fs.existsSync(infoPath)) {
      const info = loadInfo(fs.readFileSync(infoPath).toString())
      question.info = info
      question.title = info.title
    }

    const readMePath = path.join(rootPath, folderName, 'README.md')
    if (fs.existsSync(readMePath)) {
      question.readMe = fs.readFileSync(readMePath).toString()
    }

    const readMeJaPath = path.join(rootPath, folderName, 'README.ja.md')
    if (fs.existsSync(readMeJaPath)) {
      question.readMeJa = fs.readFileSync(readMeJaPath).toString()
    }

    const readMeKoPath = path.join(rootPath, folderName, 'README.ko.md')
    if (fs.existsSync(readMeKoPath)) {
      question.readMeKo = fs.readFileSync(readMeKoPath).toString()
    }

    const readMeZhPath = path.join(rootPath, folderName, 'README.zh-CN.md')
    if (fs.existsSync(readMeZhPath)) {
      question.readMeZh = fs.readFileSync(readMeZhPath).toString()
    }

    result.push(question)
  })

  result.sort((a, b) => a.idx! - b.idx!)
  return result
}

export function loadInfo(s: string): any {
  const object = YAML.load(s) as any
  if (!object) {
    return undefined
  }

  const arrayKeys = ['tags', 'related']

  for (const key of arrayKeys) {
    if (object[key]) {
      object[key] = (object[key] || '')
        .toString()
        .split(',')
        .map((i: string) => i.trim())
        .filter(Boolean)
    } else {
      object[key] = undefined
    }
  }

  return object
}

function exec(
  command: string,
  options: cp.ExecOptions
): Promise<{ stdout: string; stderr: string }> {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    cp.exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr })
      }
      resolve({ stdout, stderr })
    })
  })
}

async function getLocalErrorQuestions(): Promise<string[]> {
  let errorQuestions: string[] = []
  const workspaceFolderSetting = getWorkspaceFolder()
  if (!workspaceFolderSetting) {
    return errorQuestions
  }
  try {
    await exec('tsc *.ts --noEmit', { cwd: workspaceFolderSetting })
  } catch ({ error, stdout, stderr }) {
    if (stdout) {
      const lines = (stdout as string).split(/\r{0,1}\n/)
      return lines
    }
  }
  return errorQuestions
}

function getLocalQuestions(): string[] {
  let localQuestions: string[] = []
  const workspaceFolderSetting = getWorkspaceFolder()
  if (!workspaceFolderSetting) {
    return localQuestions
  }
  const questions = fs.readdirSync(workspaceFolderSetting)
  const reg = /^(\d+)-([\s\S]+?)-([\s\S]+)$/
  localQuestions = questions
    .filter((fileName) => reg.test(fileName))
    .map((fileName) => {
      return fileName
    })
  return localQuestions
}
