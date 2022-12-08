import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode'

export class DifficultyItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly difficulty: string,
    public readonly tooltip?: string,
    public readonly collapsibleState?: TreeItemCollapsibleState,
    public readonly iconPath?: string | ThemeIcon,
    public readonly command?: Command
  ) {
    super(label)
    this.collapsibleState = TreeItemCollapsibleState.Collapsed
  }

  id = this.difficulty
  contextValue = 'difficulty'
}
