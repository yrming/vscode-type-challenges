import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItemCollapsibleState } from 'vscode';
import { CategoryItem } from './CategoryItem';
import { DifficultyItem } from './DifficultyItem';
import { TagItem } from './TagItem';
import { QuestionItem } from './QuestionItem';
import { getAllQuestions } from '../../utils';
import { Category, Difficulty, Question } from '../../type';

export class QuestionsProvider implements TreeDataProvider<QuestionItem> {
    private _onDidChangeTreeData: EventEmitter<QuestionItem | undefined | void> = new EventEmitter<QuestionItem | undefined | void>();
    readonly onDidChangeTreeData: Event<QuestionItem | undefined | void> = this._onDidChangeTreeData.event;

    private allQuestions?: Question[];

    getTreeItem(element: CategoryItem | DifficultyItem | TagItem): QuestionItem | Thenable<CategoryItem | DifficultyItem | TagItem | QuestionItem> {
        return element;
    }

    getChildren(element?: CategoryItem | DifficultyItem | TagItem): ProviderResult<CategoryItem[] | DifficultyItem[] | TagItem[] | QuestionItem[]> {
        if (element) {
            if (element instanceof CategoryItem) {
                if (element.label === Category.All) {
                    return this.getAllQuestionItems();
                } else if (element.label === Category.Difficulty) {
                    return this.getDifficultyItems();
                }
            } else if (element instanceof DifficultyItem) {
                return this.getAllQuestionItems();
            } else if (element instanceof TagItem) {
                return this.getAllQuestionItems();
            }
        } else {
            return this.getCategoryItems();
        }
    }

    getCategoryItems(): CategoryItem[] {
        const categoryItems = [new CategoryItem(Category.All), new CategoryItem(Category.Difficulty), new CategoryItem(Category.Tag)];
        return categoryItems;
    }

    getDifficultyItems(): DifficultyItem[] {
        const difficultyItems = [new DifficultyItem(`${Difficulty.Warm}`), new DifficultyItem(`${Difficulty.Easy}`), new DifficultyItem(`${Difficulty.Medium}`), new DifficultyItem(`${Difficulty.Extreme}`)];
        return difficultyItems;
    }

    getTagItems(): TagItem[] {
        return [];
    }

    getAllQuestionItems(): QuestionItem[] {
        const questions: Question[] = getAllQuestions();
        const questionItems: QuestionItem[] = [];
        questions.forEach(question => {
            const treeItem = new QuestionItem(`${question.idx!} - ${question.title!}`);
            questionItems.push(treeItem);
        });
        this.allQuestions = questions;
        return questionItems;
    }

}