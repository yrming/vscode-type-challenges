/* eslint-disable @typescript-eslint/naming-convention */
export enum Category {
  All = 'All',
  Difficulties = 'Difficulties',
  Tags = 'Tags',
  Authors = 'Authors'
}

export enum Difficulty {
  Warm = 'Warm',
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  Extreme = 'Extreme'
}

export interface Question {
  idx?: number
  title?: string
  readMe?: string
  readMeJa?: string
  readMeKo?: string
  readMeZh?: string
  difficulty?: string
  info?: QuestionMetaInfo
  template?: string
  testCases?: string
  _original?: string
  _status?: 'complete' | 'error' | 'todo'
}

export interface QuestionMetaInfo {
  title: string
  author: Author
  tsconfig?: Record<string, any>
  original_issues: number[]
  recommended_solutions: number[]
  tags: string[]
  related?: string[]
}

export interface Author {
  name?: string
  email?: string
  github?: string
}

export enum Commands {
  PreviewQuestion = 'typeChallenges.previewQuestion',
  OpenFolder = 'typeChallenges.openFolder',
  Refresh = 'typeChallenges.refresh'
}

export interface DifficultyMetaInfo {
  difficulty: string
  count: number
}
export interface TagMetaInfo {
  tag: string
  count: number
}

export interface AuthorMetaInfo {
  author: string
  count: number
}

export interface ExecError {
  error: any
  stdout: string
  stderr: string
}
