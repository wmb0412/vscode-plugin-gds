import * as vscode from 'vscode';
const getDoubel = (num:string) => num.length === 2 ? num : '0'+num
function colorRGBtoHex(color:string) {
  const rgba = color.match(/\d{1,3}/g) as any;
  return `#${rgba.map((i:string ) => getDoubel(parseInt(i).toString(16))).join('')}`
}
export default function (globalData: any): vscode.CompletionItem[] {
    let result: vscode.CompletionItem[] = [];
    for (const key in globalData) {
        if (Object.prototype.hasOwnProperty.call(globalData, key)) {
            const value = globalData[key];
            const completion = new vscode.CompletionItem(key + ':' + value);
            completion.sortText = key;
            completion.filterText = key + ':' + value + ':' + colorRGBtoHex(value);
            completion.kind = vscode.CompletionItemKind.Color;
            completion.detail = value;
            completion.insertText = key;
            completion.documentation = colorRGBtoHex(value);
            result.push(completion);
        }
    }
    return result;
}