import { Command, ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode'

export class QuestionItem extends TreeItem {
  public readonly label: string
  public readonly command?: Command
  public readonly iconPath?: string | ThemeIcon
  public readonly tooltip?: string
  public readonly collapsibleState?: TreeItemCollapsibleState
  public readonly description?: string | boolean
  constructor({
    label,
    command,
    iconPath,
    tooltip,
    collapsibleState,
    description
  }: {
    label: string;
    command?: Command;
    iconPath?: string | ThemeIcon;
    tooltip?: string;
    collapsibleState?: TreeItemCollapsibleState;
    description?: string | boolean;
  }) {
    super(label)
    this.label = label
    this.command = command
    this.iconPath = iconPath
    this.tooltip = tooltip
    this.collapsibleState = collapsibleState
    this.description = description
  }

  contextValue = 'question'
}
