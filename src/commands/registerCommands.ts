import { ExtensionContext, commands, window, ViewColumn } from 'vscode'
import { marked } from 'marked'
import { Commands, Question } from '../type'
import { getHTMLContent } from '../webview/preview'
import { getAllQuestions } from '../utils'

export async function registerCommands(context: ExtensionContext): Promise<void> {
  commands.registerCommand(Commands.PreviewQuestion, (question) => {
    _createWebviewPanel(question)
  })
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
    marked(question.readMe)
  )
  panel.webview.onDidReceiveMessage((message) => {
    switch (message.command) {
      case 'switchReadMe':
        const key = message.text as keyof Question
        panel.webview.html = getHTMLContent(
          `${question.idx} - ${question.title}`,
          marked(question[key])
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
      default:
        break
    }
  })
}
