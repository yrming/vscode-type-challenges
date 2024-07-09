import { ExtensionContext } from 'vscode'
import { registerTrees } from './tree/registerTrees'
import { registerCommands } from './commands/registerCommands'
import ServiceLocator from './tree/services/ServiceLocator';
import { ISyncService, SyncService } from './tree/services/SyncService'

export function activate(context: ExtensionContext) {
  ServiceLocator.register<ISyncService>('SyncService', new SyncService(context));

  registerTrees(context)
  registerCommands(context)
}

export function deactivate() { }
