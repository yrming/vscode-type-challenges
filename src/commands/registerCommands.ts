import { ExtensionContext, commands, window, ViewColumn } from "vscode";
import { marked } from 'marked';
import { Commands } from "../type";
import { getHTMLContent } from "../webview/preview";


export async function registerCommands(context: ExtensionContext): Promise<void> {
    commands.registerCommand(Commands.PreviewQuestion, (question) => {
        const panel = window.createWebviewPanel('preview', `${question.idx} - ${question.title}`, ViewColumn.One, {
            enableScripts: true
        });
        panel.webview.html = getHTMLContent(`${question.idx} - ${question.title}`, marked(question.readMe));
        panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'switchReadMe':
                    panel.webview.html = getHTMLContent(`${question.idx} - ${question.title}`, marked(question[message.text]));
                break;
                default:
                break;
            }
        });
    });
}