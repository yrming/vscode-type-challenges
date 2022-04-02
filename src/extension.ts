import { ExtensionContext } from 'vscode'
import { registerTrees } from './tree/registerTrees'
import { registerCommands } from './commands/registerCommands'

export function activate(context: ExtensionContext) {
  registerTrees(context)
  registerCommands(context)
}

export function deactivate() {}
