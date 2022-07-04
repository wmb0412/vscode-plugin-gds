import * as vscode from 'vscode';
import * as isColor from 'is-color';
import * as Color from 'color';
import { getColorText } from './utils';
export default async (globalData: any, url: { path: string }, scssPaths: string[]) => {
    const doc = await vscode.workspace.openTextDocument(url.path);
    console.log(globalData,'globalData')
    await vscode.window.showTextDocument(doc, { preview: true });
    vscode.window.activeTextEditor?.edit(async editBuilder => {
        const countLine = vscode.window.activeTextEditor?.document.lineCount as number;
        for (let index = 0; index < countLine; index++) {
            const line = vscode.window.activeTextEditor?.document.lineAt(index);
            const lineText = line!.text;
            const value = getColorText(lineText);
            if (!value) {
                continue;
            }
            let tokencolor = '';
            for (const key in globalData) {
                try {
                    if (Object.prototype.hasOwnProperty.call(globalData, key)) {
                        const element = globalData[key];
                        if (Color(element).hex() === Color(value).hex()) {
                            tokencolor = key;
                        }
    
                    }
                } catch (error) {
                    
                }
            }
            if (tokencolor) {
                const newLine = lineText.replace(value, tokencolor);
                editBuilder.replace(new vscode.Range(new vscode.Position(index, 0), new vscode.Position(index, 100)), newLine);
            }



        }
        if (scssPaths && scssPaths.length > 0) {
            vscode.commands.executeCommand('scssTokenFormat', { path: scssPaths.shift() }, scssPaths);
        }
    });
};