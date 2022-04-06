import { ExtensionContext } from 'vscode'
import { registerTrees } from './tree/registerTrees'
import { registerCommands } from './commands/registerCommands'
import * as fs from 'fs-extra'
import { generateTsHelp, defaultWorkSpace } from './utils'

export function activate(context: ExtensionContext) {
  fs.ensureDirSync(defaultWorkSpace);
  generateTsHelp();
  registerTrees(context)
  registerCommands(context)
}

export function deactivate() {}
