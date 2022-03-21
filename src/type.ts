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
    Extreme = 'Extreme'
}

export interface Question {
    idx?: number
    title?: string
    tags?: string
    difficulty?: string
    template?: string
    testCases?: string
    _original?: string
}
