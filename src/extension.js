const vscode = require('vscode');

const { GitlabMRViewProvider } = require('./view');

const { openMRCommand } = require('./command');

function activate(context) {
  const viewProvider = new GitlabMRViewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'gitlab-mr.webview',
      viewProvider,
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('gitlab-mr.open', openMRCommand),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('gitlab-mr.refresh', async () => {
      await viewProvider.render();
    }),
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
