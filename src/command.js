const vscode = require('vscode');

const { getStateAsync, getRepo, getCurrentBranch } = require('./utils');
const { openMR } = require('./mr');

async function openMRCommand() {
  await getStateAsync();

  const curBranch = getCurrentBranch();
  if (!curBranch) {
    return;
  }

  const res = await vscode.window.showInputBox({
    value: `${curBranch}:master`,
    valueSelection: [curBranch.length + 1, -1],
    placeHolder: '请输入[原始分支]:[目标分支]',
    ignoreFocusOut: true,
  });
  if (!res) {
    return;
  }

  const [originBranch, targetBranch] = res.split(':');
  if (originBranch === curBranch) {
    const repo = getRepo();
    await repo.push('origin', originBranch, true);
  }

  openMR(originBranch, targetBranch);
}

module.exports = {
  openMRCommand,
};
