import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';

export class QuestionItem extends TreeItem {
    constructor(
		public readonly label: string,
		public readonly tooltip?: string,
		public readonly collapsibleState?: TreeItemCollapsibleState,
		public readonly iconPath?: string | ThemeIcon,
		public readonly command?: Command
	) {
		super(label);
	}

	contextValue = 'question';
}