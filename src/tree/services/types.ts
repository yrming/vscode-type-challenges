export type CompletedQuestionIds = string[]

export type SyncState = {
  [HostId in string]: CompletedQuestionIds
}

export type CompletedQuestionIdsSync = {
  local: CompletedQuestionIds,
  remote: CompletedQuestionIds,
}
