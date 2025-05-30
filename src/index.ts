import type { ExtensionContext } from 'vscode'
import { registerCommands } from './commands/registerCommands'
import { registerTrees } from './tree/registerTrees'

export function activate(context: ExtensionContext) {
  registerTrees(context)
  registerCommands(context)
}

export function deactivate() {}
