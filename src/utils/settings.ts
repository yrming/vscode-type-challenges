// Copyright (c) jdneo. All rights reserved.
// Licensed under the MIT license.

import type {
  OpenDialogOptions,
  QuickPickItem,
  WorkspaceConfiguration,
  WorkspaceFolder,
} from 'vscode'
import * as os from 'node:os'
import * as path from 'node:path'
import {
  ConfigurationTarget,
  Uri,
  window,
  workspace,
} from 'vscode'

interface IQuickItemEx<T> extends QuickPickItem {
  value: T
}

type LanguageType = 'zh' | 'en' | 'ja' | 'ko'

export default async function selectWorkspaceFolder(): Promise<string> {
  let workspaceFolderSetting: string = getWorkspaceFolder()
  if (workspaceFolderSetting.trim() === '') {
    workspaceFolderSetting = await determineTypeChallengesFolder()
    if (workspaceFolderSetting === '') {
      // User cancelled
      return workspaceFolderSetting
    }
  }

  return workspaceFolderSetting
}

export function getWorkspaceFolder(): string {
  return getWorkspaceConfiguration().get<string>('workspaceFolder', '')
}

export function getDefaultLanguage(): LanguageType {
  return getWorkspaceConfiguration().get<LanguageType>('defaultLanguage', 'en')
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
      value: `${path.join(os.homedir(), '.typeChallenges')}`,
    },
    {
      label: '$(file-directory) Browse...',
      value: ':browse',
    },
  )
  const choice: IQuickItemEx<string> | undefined = await window.showQuickPick(picks, {
    placeHolder: 'Select where you would like to save your Type Challenges files',
  })
  if (!choice) {
    result = ''
  }
  else if (choice.value === ':browse') {
    const directory: Uri[] | undefined = await showDirectorySelectDialog()
    if (!directory || directory.length < 1) {
      result = ''
    }
    else {
      result = directory[0].fsPath
    }
  }
  else {
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
    openLabel: 'Select',
  }
  return await window.showOpenDialog(options)
}

function getBelongingWorkspaceFolderUri(fsPath: string | undefined): Uri | undefined {
  let defaultUri: Uri | undefined
  if (fsPath) {
    const workspaceFolder: WorkspaceFolder | undefined = workspace.getWorkspaceFolder(
      Uri.file(fsPath),
    )
    if (workspaceFolder) {
      defaultUri = workspaceFolder.uri
    }
  }
  return defaultUri
}
