import { ExtensionContext, window, workspace } from 'vscode'
import * as fs from 'fs'
import { getWorkspaceFolder } from '../utils/settings'
import { QuestionsProvider } from './questions/QuestionsProvider'
import { getAllQuestions } from '../utils/questions'

export async function registerTrees(context: ExtensionContext): Promise<void> {
  const allQuestions = await getAllQuestions()
  const questionsProvider = new QuestionsProvider(allQuestions)
  context.subscriptions.push(
    workspace.onDidSaveTextDocument(() => {
      const editor = window.activeTextEditor
      if (editor) {
        const workspaceFolderSetting = getWorkspaceFolder()
        if (
          !workspaceFolderSetting ||
          !fs.existsSync(workspaceFolderSetting) ||
          !editor.document.fileName.startsWith(workspaceFolderSetting)
        ) {
          return
        }
        questionsProvider.refresh()
      }
    })
  )
  window.registerTreeDataProvider('typeChallenges.questions', questionsProvider)
}
