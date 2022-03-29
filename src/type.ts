/* eslint-disable @typescript-eslint/naming-convention */
export enum Category {
    All = 'All',
    Difficulty = 'Difficulty',
    Tag = 'Tag'
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
    info?: any
    template?: string
    testCases?: string
    _original?: string
}

export interface QuestionMetaInfo {
    title: string
    author: {
        name: string
        email: string
        github: string
    }
    tsconfig?: Record<string, any>
    original_issues: number[]
    recommended_solutions: number[]
    tags: string[]
    related?: string[]
}

export enum Commands {
    PreviewQuestion = 'typeChallenges.previewQuestion'
}
