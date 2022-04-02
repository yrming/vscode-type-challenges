import { ExtensionContext, window } from 'vscode'
import { QuestionsProvider } from './questions/QuestionsProvider'

export async function registerTrees(context: ExtensionContext): Promise<void> {
  const questionsProvider = new QuestionsProvider()
  window.registerTreeDataProvider('typeChallenges.questions', questionsProvider)
}
