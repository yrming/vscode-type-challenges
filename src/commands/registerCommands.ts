import { ExtensionContext, commands, window, ViewColumn, Uri } from 'vscode'
import { marked } from 'marked'
import * as path from 'path'
import * as fse from 'fs-extra'
import { Commands, Question } from '../type'
import { getPreviewHTMLContent } from '../webview/preview'
import { getAllQuestions } from '../utils/questions'
import selectWorkspaceFolder from '../utils/settings'
import { testUtil } from '../utils/test'

export async function registerCommands(context: ExtensionContext): Promise<void> {
  commands.registerCommand(Commands.PreviewQuestion, (question) => {
    _createPreviewWebviewPanel(question)
  })
}

const _createPreviewWebviewPanel = (question: Question) => {
  const panel = window.createWebviewPanel(
    'preview',
    `${question.idx} - ${question.title}`,
    ViewColumn.One,
    {
      enableScripts: true
    }
  )
  panel.webview.html = getPreviewHTMLContent(
    `${question.idx} - ${question.title}`,
    marked(question.readMe)
  )
  panel.webview.onDidReceiveMessage((message) => {
    const allQuestions = getAllQuestions()
    switch (message.command) {
      case 'switchReadMe':
        const key = message.text as keyof Question
        panel.webview.html = getPreviewHTMLContent(
          `${question.idx} - ${question.title}`,
          marked(question[key])
        )
        break
      case 'previewRelated':
        if (!message.text) {
          return
        }
        const relatedQuestion = allQuestions.find((q) => q._original === message.text)
        if (!relatedQuestion) {
          return
        }
        _createPreviewWebviewPanel(relatedQuestion)
        break
      case 'back':
        commands.executeCommand('workbench.action.closeActiveEditor')
        break
      case 'takeChallenge':
        if (!message.text) {
          return
        }
        const takeQuestion = allQuestions.find((q) => q.idx === message.text)
        if (!takeQuestion) {
          return
        }
        takeChallenge(takeQuestion)
        break
      default:
        break
    }
  })
}

async function takeChallenge(question: Question) {
  const workspaceFolder: string = await selectWorkspaceFolder()
  if (!workspaceFolder) {
    return
  }

  const testUtilsPath = path.join(workspaceFolder, 'test-utils.ts')
  if (!(await fse.pathExists(testUtilsPath))) {
    await fse.createFile(testUtilsPath)
    await fse.writeFile(testUtilsPath, testUtil)
  }
  const fileName = `${question._original}.ts`
  let finalPath: string = path.join(workspaceFolder, fileName)
  if (!(await fse.pathExists(finalPath))) {
    await fse.createFile(finalPath)
    const testCasesCommentStart = `// ============= Test Cases =============`
    const yourCodeCommentStart = `// ============= Your Code Here =============`
    const testCasesCode = question.testCases?.replace('@type-challenges/utils', './test-utils')
    const codeTemplate = `${testCasesCommentStart}\r\n${testCasesCode}\r\n\r\n${yourCodeCommentStart}\r\n${question.template}`
    await fse.writeFile(finalPath, codeTemplate)
  }
  window.showTextDocument(Uri.file(finalPath), { preview: false, viewColumn: ViewColumn.One })
}
