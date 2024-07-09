import { ExtensionContext } from "vscode";
import { CompletedQuestionIds, CompletedQuestionIdsSync, SyncState } from "./types";
var os = require("os");


export interface ISyncService {
  putCompletedQuestions(localCompletedIds: string[]): void
  getCompletedQuestions(): CompletedQuestionIdsSync
}

const root = 'root'
export class SyncService implements ISyncService {
  context: ExtensionContext;
  hostName: string;

  constructor(context: ExtensionContext) {
    this.context = context
    this.hostName = `${os.hostname()}`;

    this.context.globalState.setKeysForSync([root]); // sync state for all machines
  }

  private _getState(): SyncState {
    return this.context.globalState.get<SyncState>(root) || {}
  }

  getCompletedQuestions(): CompletedQuestionIdsSync {
    const statePerHost = this._getState();

    const idsLocal = new Set<string>()
    const idsRemote = new Set<string>()

    Object
      .keys(statePerHost)
      .forEach((hostName) => {
        if (hostName === this.hostName) {
          statePerHost[hostName].forEach((completedId: string) => idsLocal.add(completedId))
        } else {
          statePerHost[hostName].forEach((completedId: string) => idsRemote.add(completedId))
        }
      },)

    return {
      local: Array.from(idsLocal),
      remote: Array.from(idsRemote),
    }
  }

  putCompletedQuestions(completed: string[]): void {
    this.context.globalState
      .update(root, { ...this._getState(), [this.hostName]: completed })
  }
}