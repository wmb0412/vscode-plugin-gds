// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { initGlobalData, findSync } from './utils';
import completionItems from './completionItems';
import hoverProvider from './hoverProvider';
import commandScssTokenFormat from './commandScssTokenFormat';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
let globalData = {};

export function activate(context: vscode.ExtensionContext) {
	globalData = initGlobalData();
	//自动补全
	const provider1 = vscode.languages.registerCompletionItemProvider(
		['scss'],
		{
			async provideCompletionItems(document, position, token, context) {
				return completionItems(globalData);
			},
		}, ':', ': ', ':$', ': $'
	);
	//悬浮提示
	const provider2 = vscode.languages.registerHoverProvider('scss', {
		provideHover: (document, position, token) => hoverProvider(document, position, token, globalData)
	});
	//文件内容替换
	let disposable = vscode.commands.registerCommand('scssTokenFormat', (url, scssPaths) =>
		commandScssTokenFormat(globalData, url, scssPaths));
	let disposable2 = vscode.commands.registerCommand('mutil-scssTokenFormat', async (url) => {
		vscode.window.showInformationMessage('代替一下');
		const scssPaths = findSync(url.path);
		vscode.commands.executeCommand('scssTokenFormat', { path: scssPaths.shift() }, scssPaths);
	});
	context.subscriptions.push(provider1);
	context.subscriptions.push(provider2);
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() { }
