import * as vscode from 'vscode';

/* 
    @param type  2import:1  2reqiure:2
*/
export function convert (type: number) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const selection = editor.selection;
    let selectedText = document.getText(selection);
    let range: vscode.Range;
    // using the whole file as selectedText
    if (!selectedText) {
        range = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );
        selectedText = document.getText(range);
    };
    console.log('selectedText', selectedText);

    let convertedText = type === 1 ? _2import(selectedText) : _2require(selectedText);
    
    editor.edit(editBuilder => {
        if (!selection.isEmpty) {
            editBuilder.replace(selection, convertedText);
        } else {
            editBuilder.delete(range);
            editBuilder.insert(new vscode.Position(0, 0), convertedText);
        }
    });
}

function _2import(selectedText: string): string {
    // 命名导入  const { a, b } = require('module');
    selectedText = selectedText.replace(/const\s+\{([^}]+)\}\s+=\s+require\(['"]([^'"]+)['"]\);?/g, 'import {\$1} from \'\$2\'');
    
    // 默认导入  const defaultExport = require('module').default;
    selectedText = selectedText.replace(/const\s+([^,\s]+)\s+=\s+require\(['"]([^'"]+)['"]\)\.default;?/g, 'import \$1 from \'\$2\'');
    
    // 命名空间导入  const name = require('module');
    selectedText = selectedText.replace(/const\s+([^,\s]+)\s+=\s+require\(['"]([^'"]+)['"]\);?/g, 'import * as \$1 from \'\$2\'');
    
    // 混合导入  const defaultExport = require('module').default, { a, b } = require('module');
    selectedText = selectedText.replace(/const\s+([^,\s]+)\s+=\s+require\(['"]([^'"]+)['"]\)\.default,\s*\{([^}]+)\}\s+=\s+require\(['"]\2['"]\)?/g, 'import \$1, { \$3 } from \'\$2\'');
    
    // 仅导入模块  require('module');
    selectedText = selectedText.replace(/require\(['"]([^'"]+)['"]\);?/g, 'import \'\$1\'');
    
    return selectedText;

}

function _2require(selectedText: string): string {
    // 命名导入  import { a, b } from 'module';
    selectedText = selectedText.replace(/import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g, 'const {\$1} = require(\'\$2\')');
    
    // 默认导入  import defaultExport from 'module';
    selectedText = selectedText.replace(/import\s+([^,\s]+)\s+from\s+['"]([^'"]+)['"]/g, 'const \$1 = require(\'\$2\').default');
    
    // 命名空间导入  import * as name from 'module';
    selectedText = selectedText.replace(/import\s+\*\s+as\s+([^,\s]+)\s+from\s+['"]([^'"]+)['"]/g, 'const \$1 = require(\'\$2\')');
    
    // 混合导入  import defaultExport, { a, b } from 'module';
    selectedText = selectedText.replace(/import\s+([^,\s]+)\s*,\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g, 'const \$1 = require(\'\$3\').default, {\$2} = require(\'\$3\')');
    
    // 仅导入模块  import 'module';
    selectedText = selectedText.replace(/import\s+['"]([^'"]+)['"]/g, 'require(\'\$1\')');
    
    return selectedText;
}

