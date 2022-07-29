(function () {
  const vscode = acquireVsCodeApi();

  const preState = vscode.getState() || {};

  const originBranchInput = document.querySelector('.mr-origin-branch-input');
  const originBranchSelect = document.querySelector('.mr-origin-branch-select');

  const targetBranchInput = document.querySelector('.mr-target-branch-input');
  const targetBranchSelect = document.querySelector('.mr-target-branch-select');

  const pushCurBranch = document.querySelector(
    '.mr-push-current-branch-checkbox',
  );
  const newOriginBranch = document.querySelector(
    '.mr-new-origin-branch-checkbox',
  );

  const createMRBtn = document.querySelector('.mr-create-mr-btn');
  const openRepoBtn = document.querySelector('.mr-open-repo-btn');

  pushCurBranch.checked = preState.pushCurBranch;
  newOriginBranch.checked = newOriginBranch.pushCurBranch;

  function getBranches(value) {
    const reg = new RegExp(value, 'ig');
    return branches.filter((branch) => reg.test(branch));
  }

  function genSelectItem(value, select, classname) {
    const fragment = document.createDocumentFragment();
    getBranches(value).forEach((branch) => {
      const item = document.createElement('li');
      item.classList.add(classname);
      item.innerText = branch;
      fragment.append(item);
    });

    select.innerHTML = '';
    select.append(fragment);
  }

  let hideOriginBranchSelectTimeout;
  let hideTargetBranchSelectTimeout;

  originBranchInput.addEventListener('focus', function () {
    clearTimeout(hideOriginBranchSelectTimeout);
    genSelectItem(
      originBranchInput.value,
      originBranchSelect,
      'mr-origin-branch-select-item',
    );
    originBranchSelect.classList.add('show');
  });

  originBranchInput.addEventListener('blur', function () {
    hideOriginBranchSelectTimeout = setTimeout(() => {
      originBranchSelect.classList.remove('show');
    }, 300);
  });

  originBranchInput.addEventListener('input', function () {
    genSelectItem(
      originBranchInput.value,
      originBranchSelect,
      'mr-origin-branch-select-item',
    );
  });

  originBranchSelect.addEventListener('click', function (e) {
    if (e.target.classList.contains('mr-origin-branch-select-item')) {
      originBranchInput.value = e.target.innerText;
      originBranchSelect.classList.remove('show');
    }
  });

  targetBranchInput.addEventListener('focus', function () {
    clearTimeout(hideTargetBranchSelectTimeout);
    genSelectItem(
      targetBranchInput.value,
      targetBranchSelect,
      'mr-target-branch-select-item',
    );
    targetBranchSelect.classList.add('show');
  });

  targetBranchInput.addEventListener('blur', function () {
    hideTargetBranchSelectTimeout = setTimeout(() => {
      targetBranchSelect.classList.remove('show');
    }, 250);
  });

  targetBranchInput.addEventListener('input', function () {
    genSelectItem(
      targetBranchInput.value,
      targetBranchSelect,
      'mr-target-branch-select-item',
    );
  });

  targetBranchSelect.addEventListener('click', function (e) {
    if (e.target.classList.contains('mr-target-branch-select-item')) {
      targetBranchInput.value = e.target.innerText;
      targetBranchSelect.classList.remove('show');
    }
  });

  function createMR() {
    vscode.postMessage({
      type: 'createMR',
      value: {
        originBranch: originBranchInput.value,
        targetBranch: targetBranchInput.value || 'master',
        pushCurBranch: pushCurBranch.value,
        newOriginBranch: newOriginBranch.checked,
      },
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      createMR();
    }
  }

  originBranchInput.addEventListener('keydown', handleKeyDown);
  targetBranchInput.addEventListener('keydown', handleKeyDown);

  pushCurBranch.addEventListener('change', () => {
    vscode.setState({
      ...vscode.getState(),
      pushCurBranch: pushCurBranch.checked,
    });
  });

  newOriginBranch.addEventListener('change', () => {
    vscode.setState({
      ...vscode.getState(),
      newOriginBranch: newOriginBranch.checked,
    });
  });

  createMRBtn.addEventListener('click', () => createMR());

  openRepoBtn.addEventListener('click', () => {
    vscode.postMessage({
      type: 'openRepo',
    });
  });
})();
