import {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    InitializeParams,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    MarkupKind,
    InsertTextFormat
} from 'vscode-languageserver';
import { extractTokenByOffset, validateTextDocument } from './utils';
import { keywords, keywordExists, getKeyword } from "./keywords";

// Create a connection for the server. The connection uses Node's IPC as a transport.
// Also include all preview / proposed LSP features.
let connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager. The text document manager
// supports full document sync only
let documents: TextDocuments = new TextDocuments();

connection.onInitialize((params: InitializeParams) => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            // Tell the client that the server supports code completion
            completionProvider: {
                resolveProvider: true
            },
            hoverProvider: true
        }
    };
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent(change => {
    validateTextDocument(connection, change.document);
});


connection.onHover((documentPositionParams) => {
    const document = documents.get(documentPositionParams.textDocument.uri);
    if (!document) return null;
    const pos = documentPositionParams.position;
    const offset = document.offsetAt(pos);
    
    const token = extractTokenByOffset(document, offset);
    if (!keywordExists(token)) return null;

    return {contents: getKeyword(token).description};
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
    (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        return keywords.map(kw => ({
            label: kw.name,
            kind: CompletionItemKind.Keyword,
            data: "keyword."+kw.name,
            insertText: kw.snippet,
            insertTextFormat: InsertTextFormat.Snippet,
            documentation: {
                kind: MarkupKind.Markdown,
                value: kw.description
            }
        }));
    }
);

/*
connection.onDidOpenTextDocument((params) => {
    // A text document got opened in VSCode.
    // params.uri uniquely identifies the document. For documents store on disk this is a file URI.
    // params.text the initial full content of the document.
    connection.console.log(`${params.textDocument.uri} opened.`);
});
connection.onDidChangeTextDocument((params) => {
    // The content of a text document did change in VSCode.
    // params.uri uniquely identifies the document.
    // params.contentChanges describe the content changes to the document.
    connection.console.log(`${params.textDocument.uri} changed: ${JSON.stringify(params.contentChanges)}`);
});
connection.onDidCloseTextDocument((params) => {
    // A text document got closed in VSCode.
    // params.uri uniquely identifies the document.
    connection.console.log(`${params.textDocument.uri} closed.`);
});
*/

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
