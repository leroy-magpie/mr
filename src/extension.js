const vscode = require('vscode');

const { GitMRViewProvider } = require('./view');

const { openMRCommand } = require('./command');

function activate(context) {
  const viewProvider = new GitMRViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'git-mr.webview',
      viewProvider,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('git-mr.open', openMRCommand),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('git-mr.refresh', async () => {
      await viewProvider.render();
    }),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
