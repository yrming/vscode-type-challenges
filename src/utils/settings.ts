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
import * as fse from 'fs-extra'
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
  const configured: string = getWorkspaceFolder()
  if (configured.trim() !== '') {
    // A non-empty setting doesn't mean it's usable: Settings Sync may bring over
    // a path from another machine that neither exists nor can be created here.
    // Proactively ensure the directory; if that fails, treat it as invalid and
    // re-prompt instead of returning a bad path that fails silently later.
    try {
      await fse.ensureDir(configured)
      return configured
    }
    catch {
      // Path is invalid (missing and not creatable); fall through to re-prompt
    }
  }

  // Never configured, or the configured path is invalid on this machine:
  // prompt the user to pick a local folder and persist it ('' if cancelled)
  return await determineTypeChallengesFolder()
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
