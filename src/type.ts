/* eslint-disable @typescript-eslint/naming-convention */
export enum Category {
  All = 'All',
  Difficulty = 'Difficulty',
  Tag = 'Tag',
  Author = 'Author'
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
  tags?: string
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
  PreviewQuestion = 'typeChallenges.previewQuestion'
}
