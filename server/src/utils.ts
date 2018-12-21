import { TextDocument, Diagnostic, DiagnosticSeverity, Connection } from 'vscode-languageserver';
import { keywordExists } from './keywords';

export const extractTokenByOffset = (document: TextDocument, offset: number): string => {
    let i = offset;
    while (i >= 0) {
        const pos = document.positionAt(i);
        const endPos = document.positionAt(i+1);
        const char = document.getText({start: pos, end: endPos});
        if (/\s/.test(char)) {
            i++;
            break;
        }
        i--;
    }
    const start = document.positionAt(i);
    i = offset;
    const len = document.getText().length;
    while (i < len) {
        const pos = document.positionAt(i);
        const endPos = document.positionAt(i+1);
        const char = document.getText({start: pos, end: endPos});
        if (/\s/.test(char)) {
            i--;
            break;
        }
        i++;
    }
    const end = document.positionAt(i+1);
    return document.getText({start, end});
};

export const validateTextDocument = async (connection: Connection, textDocument: TextDocument): Promise<void> => {
    const text = textDocument.getText();
    const lines = text.split("\n");
    const diagnostics: Diagnostic[] = [];
    for(let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.indexOf("%") !== -1) {
            line = line.substring(0, line.indexOf("%"));
        }
        if (!line || /^\s+$/.test(line)) {
            continue;
        }
        const tokens = [];
        const pattern = /\b\S+\b/g;
        let m: RegExpExecArray | null;
        while ((m = pattern.exec(line))) {
            tokens.push({text: m[0], start: m.index});
        }
        
        const info = {
            start: -1,
            end: -1,
            message: ""
        };
        const baseOffset = textDocument.offsetAt({line: i, character: 0});
        if (tokens.length !== 4) {
            info.start = 0;
            info.end = lines[i].length;
            info.message = `Each operation should contain exactly three operands`;
        }
        else if (!keywordExists(tokens[0].text)) {
            info.start = tokens[0].start;
            info.end = tokens[0].start + tokens[0].text.length;
            info.message = `Unknown operation ${tokens[0].text}`;
        } else {
            for (let num = 1; num < 4; num++) {
                if(isNaN(tokens[num].text as any) || Number.parseInt(tokens[num].text) < 0) {
                    info.start = tokens[num].start;
                    info.end = tokens[num].start + tokens[num].text.length;
                    info.message = `Each value must be a non-negative integer`;
                    break;
                }
            }
        }
        if (info.start !== -1) {
            diagnostics.push({
                severity: DiagnosticSeverity.Error,
                range: {
                    start: textDocument.positionAt(baseOffset+info.start),
                    end: textDocument.positionAt(baseOffset + info.end)
                },
                message: info.message,
                source: "elfcode"
            });
        }
    }
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    return;
};