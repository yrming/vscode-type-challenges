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
    tags?: string
    difficulty?: string
    template?: string
    testCases?: string
    _original?: string
}

export enum Commands {
    PreviewQuestion = 'typeChallenges.previewQuestion'
}
