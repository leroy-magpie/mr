const vscode = require('vscode');

function getRepo() {
  const gitExtension = vscode.extensions.getExtension('vscode.git').exports;
  const gitApi = gitExtension.getAPI(1);
  return gitApi.repositories[0];
}

function getProjectUrl() {
  const repo = getRepo();
  const remote = repo.state.remotes[0];
  const { fetchUrl } = remote;

  const projectUrl = fetchUrl.replace(/^[^@]+@/, '').replace(':', '/').replace(/.git$/, '');
  return projectUrl;
}

function getSearchParams(originBranch, targetBranch) {
  const searchParams = new URLSearchParams({
    utf8: '✓',
    ['merge_request[source_branch]']: originBranch,
    ['merge_request[target_branch]']: targetBranch,
  });
  return searchParams.toString();
}

function getMergeUrl(originBranch, targetBranch) {
  const projectUrl = getProjectUrl();

  if (projectUrl.startsWith('git.garena.com')) {
    const searchParams = getSearchParams(originBranch, targetBranch);
    return `https://${projectUrl}/-/merge_requests/new?${searchParams}`;
  }

  if (projectUrl.startsWith('github.com')) {
    return `https://${projectUrl}/compare/${targetBranch}...${originBranch}}`;
  }
}

async function openMR(originBranch, targetBranch) {
  const mergeUrl = getMergeUrl(originBranch, targetBranch);
  vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(mergeUrl))
}

module.exports = {
  getProjectUrl,
  openMR,
};
