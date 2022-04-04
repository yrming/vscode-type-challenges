import  { ExtensionContext, commands, window, ViewColumn, Uri } from 'vscode'
import { marked } from 'marked'
import { Commands, Question } from '../type'
import { getHTMLContent } from '../webview/preview'
import { getAllQuestions, defaultWorkSpace, helperFileName } from '../utils'
import * as fs from 'fs-extra'
import * as path from 'node:path'
import * as https from 'node:https'
import * as lzString from 'lz-string'

const requestLocation = function (url: string): Promise<String> {
  return new Promise((resolve) => {
    const req = https.request(url, (res) => {
      resolve(res.headers.location || '')
    })

    req.end();
  })
}

export async function registerCommands(context: ExtensionContext): Promise<void> {
  commands.registerCommand(Commands.PreviewQuestion, (question) => {
    _createWebviewPanel(question)
  })
}

const createPlayFile = async (title: string, url: string) => {

  title = title.replace(/\s/g, '');

  const filePath = path.resolve(defaultWorkSpace, `${title}.ts`);

  const exthExosts = await fs.pathExists(path.resolve(filePath));

  if (!exthExosts) { 
    const res = await requestLocation(url);

    let fileContent = res.slice(res.indexOf('code/') + 5) 

    fileContent = lzString.decompressFromEncodedURIComponent(fileContent) as string

    fileContent = fileContent.replace('@type-challenges/utils', `./${helperFileName.slice(0, -3)}`)

    await fs.writeFile(filePath, fileContent)
  }

  await window.showTextDocument(Uri.file(filePath), { preview: false, viewColumn: ViewColumn.One });
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

  const playUrl = `https://tsch.js.org/${question.idx}/play`

  panel.webview.html = getHTMLContent(
    `${question.idx} - ${question.title}`,
    marked(question.readMe),
    playUrl
  )
  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case 'switchReadMe':
        const key = message.text as keyof Question
        panel.webview.html = getHTMLContent(
          `${question.idx} - ${question.title}`,
          marked(question[key]),
          playUrl
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
        const { title, url } = message
        createPlayFile(title, url)
        break
      default:
        break
    }
  })
}
