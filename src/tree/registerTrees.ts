import type { ExtensionContext } from 'vscode'
import * as fs from 'node:fs'
import { window, workspace } from 'vscode'
import {
  getAllAuthors,
  getAllAuthorsInfo,
  getAllDifficultiesInfo,
  getAllQuestions,
  getAllTags,
  getAllTagsInfo,
} from '../utils/questions'
import { getWorkspaceFolder } from '../utils/settings'
import { QuestionsProvider } from './questions/QuestionsProvider'

export async function registerTrees(context: ExtensionContext): Promise<void> {
  const allQuestions = await getAllQuestions()
  const allDifficultiesInfo = getAllDifficultiesInfo(allQuestions)
  const allTagsInfo = getAllTagsInfo(allQuestions, getAllTags(allQuestions))
  const allAuthorsInfo = getAllAuthorsInfo(allQuestions, getAllAuthors(allQuestions))

  const questionsProvider = new QuestionsProvider(
    allQuestions,
    allDifficultiesInfo,
    allTagsInfo,
    allAuthorsInfo,
  )
  context.subscriptions.push(
    workspace.onDidSaveTextDocument(() => {
      const editor = window.activeTextEditor
      if (editor) {
        const workspaceFolderSetting = getWorkspaceFolder()
        if (
          !workspaceFolderSetting
          || !fs.existsSync(workspaceFolderSetting)
          || !editor.document.fileName.startsWith(workspaceFolderSetting)
        ) {
          return
        }
        questionsProvider.refresh()
      }
    }),
  )
  window.registerTreeDataProvider('typeChallenges.questions', questionsProvider)
}
