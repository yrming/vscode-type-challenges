import * as fs from 'fs'
import * as path from 'path'
import * as cp from 'child_process'
import * as YAML from 'js-yaml'
import * as fse from 'fs-extra'
import { window } from 'vscode'
import { AuthorMetaInfo, Difficulty, DifficultyMetaInfo, ExecError, Question, TagMetaInfo } from '../types'
import { getWorkspaceFolder } from './settings'

const rootPath = path.join(__dirname, '..', '..', 'resources', 'questions')
const tsConfigFileName = 'tsconfig.json'

export async function getAllQuestions(): Promise<Question[]> {
  await createTsConfigFile()
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
    }
  })

  result.sort((a, b) => a.idx! - b.idx!)
  return result
}

export function getAllTags(questions: Question[]): string[] {
  const set = new Set<string>()
  for (const q of questions) {
    const tags = q.info?.tags || []
    for (const tag of tags) {
      set.add(tag as string)
    }
  }
  const sortTags = Array.from(set).sort()
  return sortTags
}

export function getAllTagsInfo(questions: Question[], tags: string[]): TagMetaInfo[] {
  const tagMetaInfos: TagMetaInfo[] = []
  for (const tag of tags) {
    tagMetaInfos.push({
      tag: tag,
      count: questions.filter((item) => !!item.info?.tags?.includes(tag)).length
    })
  }
  return tagMetaInfos
}

export function getAllAuthors(questions: Question[]): string[] {
  const set = new Set<string>()
  for (const q of questions) {
    const author = q.info?.author
    const name = author?.name || author?.github
    set.add(name as string)
  }
  const sortAuthors = Array.from(set).sort()

  return sortAuthors
}

export function getAllAuthorsInfo(questions: Question[], authors: string[]): AuthorMetaInfo[] {
  const authorMetaInfos: AuthorMetaInfo[] = []
  for (const author of authors) {
    authorMetaInfos.push({
      author: author,
      count: questions.filter(
        (item) => item.info?.author?.name === author || item.info?.author?.github === author
      ).length
    })
  }
  return authorMetaInfos
}

export function getAllDifficultiesInfo(questions: Question[]): DifficultyMetaInfo[] {
  const difficultyMetaInfos: DifficultyMetaInfo[] = []
  for (const difficulty of Object.keys(Difficulty)) {
    difficultyMetaInfos.push({
      difficulty: difficulty,
      count: questions.filter((item) => item.difficulty === difficulty.toLowerCase()).length
    })
  }
  return difficultyMetaInfos
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
  if (!workspaceFolderSetting || !fs.existsSync(workspaceFolderSetting)) {
    return errorQuestions
  }
  try {
    await exec(`tsc --project ${tsConfigFileName}`, { cwd: workspaceFolderSetting })
  } catch (err) {
    const { error, stdout, stderr } = err as ExecError
    if (stderr) {
      window.showErrorMessage(stderr)
    }
    if (stdout) {
      const lines = stdout.split(/\r{0,1}\n/)
      return lines
    }
  }
  return errorQuestions
}

function getLocalQuestions(): string[] {
  let localQuestions: string[] = []
  const workspaceFolderSetting = getWorkspaceFolder()
  if (!workspaceFolderSetting || !fs.existsSync(workspaceFolderSetting)) {
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

async function createTsConfigFile() {
  const workspaceFolderSetting = getWorkspaceFolder()
  if (!workspaceFolderSetting || !fs.existsSync(workspaceFolderSetting)) {
    return
  }
  const tsConfigFlieDestPath = path.join(workspaceFolderSetting, tsConfigFileName)
  if (!(await fse.pathExists(tsConfigFlieDestPath))) {
    const tsConfigFlieResPath = path.join(__dirname, '..', '..', 'resources', tsConfigFileName)
    fse.copyFileSync(tsConfigFlieResPath, tsConfigFlieDestPath)
  }
}
