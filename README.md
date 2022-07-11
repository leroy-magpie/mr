# Usage

通过 VS Code 命令创建 GitLab 合并请求申请  
有 commit 未提交或者未推送分支，会自动先帮你 push 到远程仓库

[![OSCS Status](https://www.oscs1024.com/platform/badge/leroy-magpie/mr.svg?size=small)](https://www.oscs1024.com/project/leroy-magpie/mr?ref=badge_small)

## 使用说明

### 工具栏

![mr](https://github.com/leroy-magpie/mr/blob/master/src/assets/icons/tool-onboarding-1.png?raw=true)  

联想词搜索  
![mr](https://github.com/leroy-magpie/mr/blob/master/src/assets/icons/tool-onboarding-2.png?raw=true)

输入框回车即可创建 MR

切换分支的话，刷新按钮可以重置内容

### vscode 命令

![mr](https://github.com/leroy-magpie/mr/blob/master/src/assets/icons/command-onboarding.png?raw=true)

1. command + Shift + P 唤起命令输入框

2. 输入 mr 使用该扩展

3. 输入 [原始分支]:[目标分支]  
   原始分支默认为: 当前分支  
   目标分支默认为: master
