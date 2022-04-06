import { ExtensionContext, commands, window, ViewColumn, Uri } from 'vscode'
import { marked } from 'marked'
import { Commands, Question } from '../type'
import { getHTMLContent } from '../webview/preview'
import { getAllQuestions, defaultWorkSpace, helperFileName, rootPath } from '../utils'
import * as fs from 'fs-extra'
import * as path from 'node:path'

export async function registerCommands(context: ExtensionContext): Promise<void> {
  commands.registerCommand(Commands.PreviewQuestion, (question) => {
    _createWebviewPanel(question)
  })
}

const createPlayFile = async (dir: string) => {
  const fileName = `${dir}.ts`
  const filePath = path.resolve(defaultWorkSpace, fileName)
  const exthExosts = await fs.pathExists(path.resolve(filePath))

  if (!exthExosts) {
    const oriFilePath = path.join(rootPath, dir, fileName)
    await fs.copy(oriFilePath, filePath)
  }

  await commands.executeCommand('workbench.action.closeActiveEditor')
  await window.showTextDocument(Uri.file(filePath), { preview: false, viewColumn: ViewColumn.One })
}

const _createWebviewPanel = (question: Question) => {
  const panel = window.createWebviewPanel(
    'preview',
    `${question.idx} - ${question.title}`,
    ViewColumn.One,
    {
      enableScripts: true
    }
  )

  panel.webview.html = getHTMLContent(
    `${question.idx} - ${question.title}`,
    marked(question.readMe),
    question._original
  )
  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case 'switchReadMe':
        const key = message.text as keyof Question
        panel.webview.html = getHTMLContent(
          `${question.idx} - ${question.title}`,
          marked(question[key]),
          question._original
        )
        break
      case 'previewRelated':
        if (!message.text) {
          return
        }
        const allQuestions = getAllQuestions()
        const relatedQuestion = allQuestions.find((q) => q._original === message.text)
        if (!relatedQuestion) {
          return
        }
        _createWebviewPanel(relatedQuestion)
        break
      case 'back':
        commands.executeCommand('workbench.action.closeActiveEditor')
        break
      case 'ShowProblem':
        const { dir } = message
        createPlayFile(dir)
        break
      default:
        break
    }
  })
}
