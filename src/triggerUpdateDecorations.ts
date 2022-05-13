import * as vscode from 'vscode';
import * as isColor from 'is-color';
import * as Color from 'color';
let timeout: NodeJS.Timer|undefined=undefined;
const tokenUrl = '### [token](https://demo.guandata.com/gds/develop/design-tokens) \n';
// create a decorator type that we use to decorate small numbers
const smallNumberDecorationType=vscode.window.createTextEditorDecorationType({
    // borderWidth: '1px',
    // borderStyle: 'solid',
    overviewRulerColor: 'blue',
    overviewRulerLane: vscode.OverviewRulerLane.Right,
    light: {
        // this color will be used in light color themes
        borderColor: 'darkblue'
    },
    color: '#30b35c',
    dark: {
        // this color will be used in dark color themes
        borderColor: 'lightblue'
    }
});

// create a decorator type that we use to decorate large numbers
const largeNumberDecorationType=vscode.window.createTextEditorDecorationType({
    cursor: 'pointer',
    // use a themable color. See package.json for the declaration and default values.
    backgroundColor: { id: 'myextension.gdsToken' },
    color: '#f00'
});

function updateDecorations(activeEditor: any, globalData: any) {
    if (!activeEditor) {
        return;
    }
    const hexReg = /(#(([0-9a-f]){6}|([0-9a-f]){3}))|(rgb\(\d{1,3}\,\ *\d{1,3}\,\ *\d{1,3}\))/ig;
    const regStr = Object.keys(globalData).sort((a,b) => b.localeCompare(a)).join(')|(').split('$').join('\\${0,1}').split('-').join('\\-');
    const tokenReg = RegExp(`(${regStr})`, 'g');
    const text=activeEditor.document.getText();
    const smallNumbers: vscode.DecorationOptions[]=[];
    const largeNumbers: vscode.DecorationOptions[]=[];
    let match;
    while ((match=hexReg.exec(text))) {
        const startPos=activeEditor.document.positionAt(match.index);
        const endPos=activeEditor.document.positionAt(match.index+match[0].length);
        const colorText=match[0];
        if(isColor(colorText)){
            const tokens = []
            for (const key in globalData) {
                if (Object.prototype.hasOwnProperty.call(globalData, key) && isColor(globalData[key])) {
                    try {
                        if(Color(globalData[key]).hex() === Color(colorText).hex() ){
                            tokens.push(key);
                        }
                    } catch (error) {
                    }
                }  
            }
            if(tokens.length){
                const decoration={ range: new vscode.Range(startPos, endPos), hoverMessage: `${tokenUrl} * ${tokens.join('\n * ')}` };
                largeNumbers.push(decoration);
            }
        }
        
    }
    while ((match=tokenReg.exec(text))) {
        const startPos=activeEditor.document.positionAt(match.index);
        const endPos=activeEditor.document.positionAt(match.index+match[0].length);
        const colorText= match[0].startsWith('$') ? match[0]: '$'+ match[0];
        if(globalData[colorText] && isColor(globalData[colorText]) ){
            const decoration={ range: new vscode.Range(startPos, endPos), hoverMessage: `${tokenUrl} * ${globalData[colorText]}` };
            smallNumbers.push(decoration);
        }else{
            const decoration={ range: new vscode.Range(startPos, endPos), hoverMessage: globalData[colorText] };
            smallNumbers.push(decoration);
        }
        
    }
    activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
    activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
}

export default function triggerUpdateDecorations(throttle=false, activeEditor: any, globalData: any ) {
    if (timeout) {
        clearTimeout(timeout);
        timeout=undefined;
    }
    if (throttle) {
        timeout=setTimeout(() => {
            updateDecorations(activeEditor, globalData);
        }, 500);
    } else {
        updateDecorations(activeEditor, globalData);
    }
}