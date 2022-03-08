import * as vscode from 'vscode';
import * as isColor from 'is-color';
import * as Color from 'color';
const tokenUrl = '### [token](https://demo.guandata.com/gds/develop/design-tokens) \n';
const rbgReg = /rgb\(\d{1,3}\,\ *\d{1,3}\,\ *\d{1,3}\)/ig;
export default (document:vscode.TextDocument, position:any, token:any,globalData:any):vscode.Hover => {
    let word = document.getText(document.getWordRangeAtPosition(position));
    const line =  document.lineAt(position);
    const lineText = line.text;
    //token=>返回rbg
    if(globalData[word]){
      return new vscode.Hover(new vscode.MarkdownString(`${tokenUrl} * ${globalData[word]}`));
    }
    const fiterColors = [];
    //rbg中间,后可能有空格匹配问题
    if(lineText.match(rbgReg)){
      word =  lineText.match(rbgReg)![0];
    }
    //hex 和 rbg 返回token
    if(isColor(word)){
      const fiterColors = Object.keys(globalData).reduce(((pre:string[], item:string)=> Color(globalData[item]).hex() === Color(word).hex()?[...pre, item]:pre  ),[]);
      if(fiterColors.length){
        return new vscode.Hover(`${tokenUrl} * ${fiterColors.join('\n * ')}`);
      }else{
        return new vscode.Hover(`${tokenUrl} * *暂无对应token*`);
      }
    }
    return new vscode.Hover('没有匹配的');
  };