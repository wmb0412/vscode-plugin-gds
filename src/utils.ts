import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const getAllClassInCss = (content: string) => {
  return content.match(/(?:[\.]{1})([a-zA-Z_]+[\w-_]*)(?:[\s\.\,\{\>#\:]{0})/igm)?.reduce((pre, item) => ({
    ...pre,
    [item.slice(1)]: getClassBody(item.slice(1), content)
  }), {}) || {}
}
const getClassBody = (className: string, content: string) => {
    // const reg = new RegExp(`(.${className}).*?(?=\})`, 'g')
    const reg = new RegExp(`(\\.${className}([\\,\\{]+)).*?(?=\\})`, 'g')
  return `{${content.match(reg)?.map(item => item.split('{')[1]).join(',')} }`
}
const defaultConfig = ["node_modules\/@guandata\/gds\/scss\/light\/_colors.scss","node_modules\/@guandata\/gds\/scss\/light\/_utils.scss"];
const cssConfig = 'node_modules\/@guandata\/gds\/index.css'
export const initGlobalData = () => {
  let globalData = {};
	const workspaceFolder = vscode.workspace.workspaceFolders || [];
	// const config = vscode.workspace.getConfiguration('scssToken');
	// const filesToLookup = (config.get('global') || defaultConfig) as string[];
	const folderPath = workspaceFolder[0].uri.fsPath;

	defaultConfig.forEach((relativePath) => {
		const content = fs.readFileSync(path.join(folderPath, relativePath), {
		encoding: 'utf8',
		});
    const fileGlobalData = content.replace(/\n| /g, '').split(';').filter(item => item.includes(':')).reduce((pre, str) => ({ ...pre, [str.split(':')[0].slice(1)]: str.split(':')[1]}) , {})

    globalData = {...globalData, ...fileGlobalData };
	});
  
  const cssContent = fs.readFileSync(path.join(folderPath, cssConfig), {
		encoding: 'utf8',
		}).replace(/\/\*.*?\*\//g, '')
  globalData = {
    ...globalData,
    ...getAllClassInCss(cssContent)
  }
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

async function readFile(file: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
      fs.readFile(file, (err, data) => {
          if (err) {
              reject(err);
          }
          resolve(data.toString());
      });
  });
}
