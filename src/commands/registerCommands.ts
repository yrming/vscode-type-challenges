import {
  ExtensionContext,
  commands,
  window,
  ViewColumn,
  Uri,
  Selection,
  Position,
  WebviewPanel
} from 'vscode'
import { marked } from 'marked'
import * as path from 'path'
import * as fse from 'fs-extra'
import hljs from 'highlight.js'
import { Commands, Question } from '../types'
import { getPreviewHTMLContent } from '../webview/preview'
import { getAllQuestions } from '../utils/questions'
import selectWorkspaceFolder, { getDefaultLanguage } from '../utils/settings'
import { testUtil } from '../utils/test'

export async function registerCommands(context: ExtensionContext): Promise<void> {
  commands.registerCommand(Commands.PreviewQuestion, (question) => {
    _createPreviewWebviewPanel(question)
  })

  commands.registerCommand(Commands.OpenFolder, async () => {
    const workspaceFolder = await selectWorkspaceFolder()
    if (!workspaceFolder) {
      return
    }
    const folderPath = workspaceFolder.split('\\').join('/')
    commands.executeCommand('vscode.openFolder', Uri.file(folderPath), {
      forceNewWindow: true
    })
  })
}

const webviewPanels: Map<string, WebviewPanel> = new Map()

const _createPreviewWebviewPanel = (question: Question) => {
  const viewType = 'typeChallenges.preview'
  const panelTitle = `${question.idx} - ${question.title}`
  const defaultLanguage = getDefaultLanguage()
  const webviewPanelKey = `${viewType}.${panelTitle}.${defaultLanguage}`
  if (webviewPanels.has(webviewPanelKey)) {
    webviewPanels.get(webviewPanelKey)!.reveal()
    return
  }
  const panel = window.createWebviewPanel(viewType, panelTitle, ViewColumn.One, {
    enableScripts: true
  })
  webviewPanels.set(webviewPanelKey, panel)
  let readMe: string | undefined
  switch (defaultLanguage) {
    case 'zh':
      readMe = question.readMeZh
      break
    case 'ja':
      readMe = question.readMeJa
      break
    case 'ko':
      readMe = question.readMeKo
      break
    default:
      readMe = question.readMe
      break
  }
  if (!readMe) {
    readMe = question.readMe
  }
  marked.setOptions({
    highlight: function (code: any) {
      return hljs.highlightAuto(code).value
    }
  })
  panel.webview.html = getPreviewHTMLContent(panelTitle, marked(readMe))
  panel.webview.onDidReceiveMessage(async (message) => {
    const allQuestions = await getAllQuestions()
    switch (message.command) {
      case 'switchReadMe':
        const key = message.text as keyof Question
        panel.webview.html = getPreviewHTMLContent(panelTitle, marked(question[key]))
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
  panel.onDidDispose(() => {
    webviewPanels.delete(webviewPanelKey)
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
    const testCasesCode = question.testCases?.replace(/@type-challenges\/utils/g, './test-utils')
    const codeTemplate = `${testCasesCommentStart}\r\n${testCasesCode}\r\n\r\n${yourCodeCommentStart}\r\n${question.template}`
    await fse.writeFile(finalPath, codeTemplate)
  }
  const editor = await window.showTextDocument(Uri.file(finalPath), {
    preview: false,
    viewColumn: ViewColumn.One
  })

  const text = editor.document.getText()
  const lines = text.split('\n')
  let targetLine = 0
  lines.forEach((line, index) => {
    if (question.template!.trim().includes(line.trim())) {
      let anyIndex = -1
      if (line.includes('= any')) {
        anyIndex = line.indexOf('= any')
      } else if (line.includes(': any')) {
        anyIndex = line.lastIndexOf(': any')
      }
      if (anyIndex > -1) {
        targetLine = index
        editor.selection = new Selection(
          new Position(targetLine, anyIndex + 2),
          new Position(targetLine, anyIndex + 5)
        )
      }
    }
  })
}
