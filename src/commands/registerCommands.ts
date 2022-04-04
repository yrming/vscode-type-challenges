import { ExtensionContext, commands, window, ViewColumn } from 'vscode'
import { marked } from 'marked'
import { Commands, Question } from '../type'
import { getPreviewHTMLContent } from '../webview/preview'
import { getAllQuestions } from '../utils'

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
        // TODO: take challenge
        break
      default:
        break
    }
  })
}
