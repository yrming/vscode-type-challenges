// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import * as os from 'os'
import * as path from 'path'
import * as fse from 'fs-extra'
import {
  workspace,
  WorkspaceConfiguration,
  window,
  Uri,
  ConfigurationTarget,
  OpenDialogOptions,
  WorkspaceFolder,
  QuickPickItem,
  commands
} from 'vscode'

interface IQuickItemEx<T> extends QuickPickItem {
  value: T
}

enum OpenOption {
  justOpenFile = 'Just open the problem file',
  openInCurrentWindow = 'Open in current window',
  openInNewWindow = 'Open in new window',
  addToWorkspace = 'Add to workspace'
}

export default async function selectWorkspaceFolder(): Promise<string> {
  let workspaceFolderSetting: string = getWorkspaceFolder()
  if (workspaceFolderSetting.trim() === '') {
    workspaceFolderSetting = await determineTypeChallengesFolder()
    if (workspaceFolderSetting === '') {
      // User cancelled
      return workspaceFolderSetting
    }
  }

  // let needAsk: boolean = true
  // await fse.ensureDir(workspaceFolderSetting)
  // for (const folder of workspace.workspaceFolders || []) {
  //   if (isSubFolder(folder.uri.fsPath, workspaceFolderSetting)) {
  //     needAsk = false
  //   }
  // }

  // if (needAsk) {
  //   const choice: string | undefined = await window.showQuickPick(
  //     [
  //       OpenOption.justOpenFile,
  //       OpenOption.openInCurrentWindow,
  //       OpenOption.openInNewWindow,
  //       OpenOption.addToWorkspace
  //     ],
  //     {
  //       placeHolder:
  //         'The Type Challenges workspace folder is not opened in VS Code, would you like to open it?'
  //     }
  //   )

  //   // Todo: generate file first
  //   switch (choice) {
  //     case OpenOption.justOpenFile:
  //       return workspaceFolderSetting
  //     case OpenOption.openInCurrentWindow:
  //       await commands.executeCommand('vscode.openFolder', Uri.file(workspaceFolderSetting), false)
  //       return ''
  //     case OpenOption.openInNewWindow:
  //       await commands.executeCommand('vscode.openFolder', Uri.file(workspaceFolderSetting), true)
  //       return ''
  //     case OpenOption.addToWorkspace:
  //       workspace.updateWorkspaceFolders(workspace.workspaceFolders?.length ?? 0, 0, {
  //         uri: Uri.file(workspaceFolderSetting)
  //       })
  //       break
  //     default:
  //       return ''
  //   }
  // }

  return workspaceFolderSetting
}

export function getWorkspaceFolder(): string {
  return getWorkspaceConfiguration().get<string>('workspaceFolder', '')
}

export function getWorkspaceConfiguration(): WorkspaceConfiguration {
  return workspace.getConfiguration('typeChallenges')
}

async function determineTypeChallengesFolder(): Promise<string> {
  let result: string
  const picks: Array<IQuickItemEx<string>> = []
  picks.push(
    {
      label: `Default location`,
      detail: `${path.join(os.homedir(), '.typeChallenges')}`,
      value: `${path.join(os.homedir(), '.typeChallenges')}`
    },
    {
      label: '$(file-directory) Browse...',
      value: ':browse'
    }
  )
  const choice: IQuickItemEx<string> | undefined = await window.showQuickPick(picks, {
    placeHolder: 'Select where you would like to save your Type Challenges files'
  })
  if (!choice) {
    result = ''
  } else if (choice.value === ':browse') {
    const directory: Uri[] | undefined = await showDirectorySelectDialog()
    if (!directory || directory.length < 1) {
      result = ''
    } else {
      result = directory[0].fsPath
    }
  } else {
    result = choice.value
  }

  getWorkspaceConfiguration().update('workspaceFolder', result, ConfigurationTarget.Global)

  return result
}

export async function showDirectorySelectDialog(fsPath?: string): Promise<Uri[] | undefined> {
  const defaultUri: Uri | undefined = getBelongingWorkspaceFolderUri(fsPath)
  const options: OpenDialogOptions = {
    defaultUri,
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: 'Select'
  }
  return await window.showOpenDialog(options)
}

function getBelongingWorkspaceFolderUri(fsPath: string | undefined): Uri | undefined {
  let defaultUri: Uri | undefined
  if (fsPath) {
    const workspaceFolder: WorkspaceFolder | undefined = workspace.getWorkspaceFolder(
      Uri.file(fsPath)
    )
    if (workspaceFolder) {
      defaultUri = workspaceFolder.uri
    }
  }
  return defaultUri
}

function isSubFolder(from: string, to: string): boolean {
  const relative: string = path.relative(from, to)
  if (relative === '') {
    return true
  }
  return !relative.startsWith('..') && !path.isAbsolute(relative)
}
