import { ExtensionContext, commands, window, ViewColumn } from "vscode";
import { Commands } from "../type";
import { getHTMLContent } from "../webview/preview";


export async function registerCommands(context: ExtensionContext): Promise<void> {
    commands.registerCommand(Commands.PreviewQuestion, (question) => {
        const panel = window.createWebviewPanel(question.title, question.title, ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = getHTMLContent(question.title, question.readMe);
    });
}