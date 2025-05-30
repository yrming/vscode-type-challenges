import type { Command, ThemeIcon } from 'vscode'
import { TreeItem, TreeItemCollapsibleState } from 'vscode'

export class CategoryItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly category: string,
    public readonly tooltip?: string,
    public readonly collapsibleState?: TreeItemCollapsibleState,
    public readonly iconPath?: string | ThemeIcon,
    public readonly command?: Command,
  ) {
    super(label)
    this.collapsibleState = TreeItemCollapsibleState.Collapsed
    this.id = this.category
    this.contextValue = 'category'
  }
}
