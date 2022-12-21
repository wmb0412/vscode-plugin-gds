import * as vscode from 'vscode';

const getDouble = (num:string) => num.length === 2 ? num : '0'+num;
function colorRGBtoHex(color:string) {
  const rgba = color.match(/\d{1,3}/g) as any;
  let result = color;
  if(result.includes('{')){
    return result
  }
  try {
    result = `#${rgba.map((i:string ) => getDouble(parseInt(i).toString(16))).join('')}`;
  } catch (error) {
    
  }
  return result;
}
const splitChar = ' ';
const classMatchRegex = /className=["|']([\w- ]*$)/;
export default function (globalData: any, document: any, position: any, inScss?:boolean): vscode.CompletionItem[] {
        const start = new vscode.Position(position.line, 0);
        const range = new vscode.Range(start, position);
        const text: string = document.getText(range);
        const rawClasses: RegExpMatchArray | null = text.match(classMatchRegex);
        if (!inScss && (!rawClasses || rawClasses.length === 1)) {
            return [ ];
        }
        const result: vscode.CompletionItem[] = [];
        for (const key in globalData) {
            if (Object.prototype.hasOwnProperty.call(globalData, key)) {
                const value = globalData[key];
                if(value.includes('{') && inScss){
                    continue
                }
                const completion = new vscode.CompletionItem(key + ':' + value);
                completion.sortText = key;
                completion.filterText = key + ':' + value + ':' + colorRGBtoHex(value);
                completion.kind = vscode.CompletionItemKind.Color;
                completion.detail = value;
                completion.insertText = inScss ?`var(--${key})` : key;
                completion.documentation = colorRGBtoHex(value);
                result.push(completion);
            }
        }
        // className已经存在的类
        if(!inScss){
            const classesOnAttribute = rawClasses?.[1].split(splitChar) || [];
            // 移除已经有的
            for (const classOnAttribute of classesOnAttribute) {
                for (let j = 0; j < result.length; j++) {
                    if (result[j].insertText === classOnAttribute) {
                        result.splice(j, 1);
                    }
                }
            }
        }
        
        return result;
}