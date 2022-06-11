import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode'

export class QuestionItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly command?: Command,
    public readonly iconPath?: string | ThemeIcon,
    public readonly tooltip?: string,
    public readonly collapsibleState?: TreeItemCollapsibleState
  ) {
    super(label)
  }

  contextValue = 'question'
}
