import { ExtensionContext, commands } from "vscode";
import { Commands } from "../type";

export async function registerCommands(context: ExtensionContext): Promise<void> {
    commands.registerCommand(Commands.PreviewQuestion, () => {

    });
}