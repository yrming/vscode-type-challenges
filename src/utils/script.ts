import * as fs from 'fs'
import * as path from 'path'

const rootPath = path.join(__dirname, '..', '..', 'resources', 'questions')

const questions = fs.readdirSync(rootPath)
questions.forEach((folderName) => {
  const templatePath = path.join(rootPath, folderName, 'template.ts')
  if (fs.existsSync(templatePath)) {
    fs.renameSync(templatePath, path.join(rootPath, folderName, 'template.tc'))
  }
  const testCasesPath = path.join(rootPath, folderName, 'test-cases.ts')
  if (fs.existsSync(testCasesPath)) {
    fs.renameSync(testCasesPath, path.join(rootPath, folderName, 'test-cases.tc'))
  }
})
