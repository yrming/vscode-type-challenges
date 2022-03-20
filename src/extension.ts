import { ExtensionContext } from 'vscode';
import { registerTrees } from './tree/registerTrees';

export function activate(context: ExtensionContext) {
	registerTrees(context);
}

export function deactivate() {}
