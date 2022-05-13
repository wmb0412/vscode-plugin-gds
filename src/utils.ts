import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import {
    getSCSSLanguageService,
    TextDocument,
  } from 'vscode-css-languageservice';
import { Symbols } from 'vscode-css-languageservice/lib/umd/parser/cssSymbolScope.js';

const doComplete = (content:string) => {
    const output:any = [];
    const service = getSCSSLanguageService();

    const styleSheet = service.parseStylesheet(
      TextDocument.create('', 'scss', 0, content)
    );
    const symbolContext = new Symbols(styleSheet);
    symbolContext.global.symbols.forEach((symbol: any) => {
        output[symbol.name]=symbol.value;
    });
    return output;
};
const defaultConfig = ["node_modules\/@guandata\/gds\/scss\/light\/_colors.scss","node_modules\/@guandata\/gds\/scss\/light\/_utils.scss"]
export const initGlobalData = () => {
  let globalData = {};
	const workspaceFolder = vscode.workspace.workspaceFolders || [];
	const config = vscode.workspace.getConfiguration('scssToken');
	const filesToLookup = (config.get('global') || defaultConfig) as string[];
	const folderPath = workspaceFolder[0].uri.fsPath;

	filesToLookup.forEach((relativePath) => {
		const content = fs.readFileSync(path.join(folderPath, relativePath), {
		encoding: 'utf8',
		});
		const fileGlobalData = doComplete(content);
    globalData = {...globalData,...fileGlobalData};
	});
  return globalData;
};

export const findSync = (startPath:string) => {
  const result:string[]=[];
  function finder(path3:string) {
      const files=fs.readdirSync(path3);
      files.forEach((val,index) => {
          const fPath=path.join(path3,val);
          const stats=fs.statSync(fPath);
          if(stats.isDirectory()) {finder(fPath);}
          if(stats.isFile()){
            if(/\.scss$/.test(fPath)){
              result.push(fPath);
            }
          }
      });

  }
  finder(startPath);
  return result;
};
export const getColorText = (colorString:string):string => {
  const rbgReg = /rgb\(\d{1,3}\,\ *\d{1,3}\,\ *\d{1,3}\)/ig;
  // const rbgaReg = /rgba\(\d{1,3}\,\ *\d{1,3}\,\ *\d{1,3}\,\ *0{0,1}\.\d*\)/ig;
  const hexReg = /#(([0-9a-f]){6}|([0-9a-f]){3})/ig;
  let result = colorString.match(rbgReg) || colorString.match(hexReg);
  return result?result[0]:'';
};

