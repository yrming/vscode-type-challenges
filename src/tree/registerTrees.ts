import { ExtensionContext, window } from 'vscode';
import { QuestionsTreeProvider } from './questions/questionsTreeProvider';

export async function registerTrees(context: ExtensionContext): Promise<void> {
    const questionsTreeProvider = new QuestionsTreeProvider();
    window.registerTreeDataProvider("typeChallenges.questions", questionsTreeProvider);
}