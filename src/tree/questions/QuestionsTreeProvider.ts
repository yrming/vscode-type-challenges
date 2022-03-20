import { Event, EventEmitter, ProviderResult, TreeDataProvider } from 'vscode';
import { QuestionTreeItem } from './QuestionTreeItem';
import { getQuestions } from '../../data';
import { Question } from '../../type';

export class QuestionsTreeProvider implements TreeDataProvider<QuestionTreeItem> {
    private _onDidChangeTreeData: EventEmitter<QuestionTreeItem | undefined | void> = new EventEmitter<QuestionTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<QuestionTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    getTreeItem(element: QuestionTreeItem): QuestionTreeItem | Thenable<QuestionTreeItem> {
        return element;
    }
    getChildren(element?: QuestionTreeItem): ProviderResult<QuestionTreeItem[]> {
        const questions: Question[] = getQuestions();
        const treeItems: QuestionTreeItem[] = [];
        questions.forEach(question => {
            const treeItem = new QuestionTreeItem(`${question.idx!} - ${question.title!}`);
            treeItems.push(treeItem);
        });
        return treeItems;
    }

}