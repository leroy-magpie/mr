const vscode = require('vscode');

const {
  getStateAsync,
  getCurrentBranch,
  getRemoteBranchesAsync,
  openRepo,
  createMR,
} = require('./utils');

class GitMRViewProvider {
  constructor(extensionUri) {
    this.version = 1;
    this.extensionUri = extensionUri;
  }

  async resolveWebviewView(webviewView) {
    await getStateAsync();

    this.webviewView = webviewView;

    webviewView.onDidChangeVisibility(async () => {
      if (webviewView.visible) {
        const curBranch = await getCurrentBranch();
        if (curBranch !== this.curBranch) {
          await this.render();
        }
      }
    });

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.onDidReceiveMessage(({ type, value = {} }) => {
      const {
        originBranch,
        targetBranch,
        pushCurBranch,
        newOriginBranch,
      } = value;

      switch (type) {
        case 'openRepo': {
          openRepo();
          break;
        }
        case 'createMR': {
          createMR({
            originBranch,
            targetBranch,
            pushCurBranch,
            newOriginBranch,
          });
          break;
        }
      }
    });

    await this.render();
  }

  async getHtml(webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'src/assets/css', 'reset.css'),
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'src/assets/css', 'vscode.css'),
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'src/assets/css', 'main.css'),
    );

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'src', 'main.js'),
    );

    const curBranch = await getCurrentBranch();
    this.curBranch = curBranch;

    const branches = await getRemoteBranchesAsync();

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Git MR ${this.version++}</title>
          <link href="${styleResetUri}" rel="stylesheet">
          <link href="${styleVSCodeUri}" rel="stylesheet">
          <link href="${styleMainUri}" rel="stylesheet">
        </head>
        <body>
          <div class="mr-origin-branch">
            <label>
              <h4>????????????:</h4>
              <input class="mr-origin-branch-input" value="${curBranch}" placeholder="??????????????????" />
            </label>
            <ul class="mr-origin-branch-select"></ul>
          </div>
          <div class="mr-target-branch">
            <label>
              <h4>????????????:</h4>
              <input class="mr-target-branch-input" placeholder="??????????????????, ????????? master" />
            </label>
            <ul class="mr-target-branch-select"></ul>
          </div>
          <div class="mr-checkbox-wrapper">
            <div class="mr-push-current-branch">
              <label>
                <input class="mr-push-current-branch-checkbox" type="checkbox" checked />
                <span>push ???????????????????????????</span>
              </label>
            </div>
            <div class="mr-new-origin-branch">
              <label>
                <input class="mr-new-origin-branch-checkbox" type="checkbox" />
                <span>?????????????????????????????????????????????</span>
              </label>
            </div>
          </div>
          <button class="mr-create-mr-btn">?????? MR</button>
          <button class="mr-open-repo-btn">????????????</button>
          <script>
            var branches = ${JSON.stringify(branches)};
          </script>
          <script src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }

  async render() {
    this.webviewView.webview.html = await this.getHtml(
      this.webviewView.webview,
    );
  }
}

module.exports = {
  GitMRViewProvider,
};
