const vscode = require('vscode');
const opener = require('opener');

const { getProjectUrl, openMR } = require('./mr');

function getGitApi() {
  const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
  return gitExtension.getAPI(1);
}

function getRepo(gitApi = getGitApi()) {
  return gitApi.repositories[0];
}

async function getStateAsync() {
  const gitApi = getGitApi();
  if (gitApi.state === 'initialized') {
    return Promise.resolve();
  } else {
    return new Promise((resolve) => {
      gitApi.onDidChangeState(resolve);
    });
  }
}

function getCurrentBranch() {
  const repo = getRepo();
  if (!repo) {
    return;
  }

  const { HEAD } = repo.state;
  return HEAD && HEAD.name;
}

async function getRemoteBranchesAsync() {
  const repo = getRepo();
  const branches = await repo.getBranches({
    remote: true,
  });
  const remoteBranchs = branches
    .filter((branch) => {
      return branch.remote && branch.name !== 'origin/HEAD';
    })
    .map((branch) => {
      return branch.name.slice(7);
    });
  return remoteBranchs;
}

function openRepo() {
  const projectUrl = getProjectUrl();
  const repoUrl = `https://${projectUrl}`;
  opener(repoUrl);
}

async function createMR({
  originBranch,
  targetBranch,
  pushCurBranch,
  newOriginBranch,
}) {
  const repo = getRepo();

  if (pushCurBranch) {
    try {
      await repo.push('origin', originBranch, true);
    } catch (error) {
      vscode.window.showInformationMessage(error.toString());
    }
  }

  if (newOriginBranch) {
    const remoteBranches = await getRemoteBranchesAsync();
    if (!remoteBranches.includes(originBranch)) {
      try {
        await repo.createBranch(originBranch);
        await repo.push('origin', originBranch, true);
      } catch (error) {
        await repo.deleteBranch(originBranch);
        vscode.window.showInformationMessage(`无法创建该原始分支。${error}`);
        return;
      }
    }
  }

  openMR(originBranch, targetBranch);
}

module.exports = {
  getGitApi,
  getRepo,
  getStateAsync,
  getCurrentBranch,
  getRemoteBranchesAsync,
  openRepo,
  createMR,
};
