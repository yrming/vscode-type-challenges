import { Event, EventEmitter, ProviderResult, TreeDataProvider } from 'vscode';
import { QuestionTreeItem } from './QuestionTreeItem';

export class QuestionsTreeProvider implements TreeDataProvider<QuestionTreeItem> {
    private _onDidChangeTreeData: EventEmitter<QuestionTreeItem | undefined | void> = new EventEmitter<QuestionTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<QuestionTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    getTreeItem(element: QuestionTreeItem): QuestionTreeItem | Thenable<QuestionTreeItem> {
        // throw new Error('Method not implemented.');
        return element;
    }
    getChildren(element?: QuestionTreeItem): ProviderResult<QuestionTreeItem[]> {
        // throw new Error('Method not implemented.');
        return Promise.resolve([]);
    }

}