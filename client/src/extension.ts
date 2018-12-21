'use strict';
import * as path from "path";
import { ExtensionContext } from "vscode";
import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    TransportKind
} from "vscode-languageclient";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    let serverModule = context.asAbsolutePath(
        path.join("server", "out", "server.js")
    );
    let debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };
    let serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            option: debugOptions
        }
    };
    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "elfcode" }],
    };

    client = new LanguageClient(
        "elfcodeLanguageSupport",
        "ElfCode Language Support",
        serverOptions,
        clientOptions
    );
    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) return;
    return client.stop();
}