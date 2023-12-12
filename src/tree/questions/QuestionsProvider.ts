import { Event, EventEmitter, ProviderResult, TreeDataProvider, commands } from 'vscode'
import * as path from 'path'
import { CategoryItem } from './CategoryItem'
import { DifficultyItem } from './DifficultyItem'
import { TagItem } from './TagItem'
import { AuthorItem } from './AuthorItem'
import { QuestionItem } from './QuestionItem'
import { getAllQuestions } from '../../utils/questions'
import {
  Category,
  Commands,
  Question,
  TagMetaInfo,
  AuthorMetaInfo,
  DifficultyMetaInfo
} from '../../types'

export class QuestionsProvider implements TreeDataProvider<QuestionItem> {
  private _onDidChangeTreeData: EventEmitter<QuestionItem | undefined | void> = new EventEmitter<
    QuestionItem | undefined | void
  >()
  readonly onDidChangeTreeData: Event<QuestionItem | undefined | void> =
    this._onDidChangeTreeData.event

  private allQuestions: Question[] = []
  private allDifficultiesInfo: DifficultyMetaInfo[] = []
  private allTagsInfos: TagMetaInfo[] = []
  private allAuthorsInfos: AuthorMetaInfo[] = []

  constructor(
    questions: Question[],
    difficultiesInfo: DifficultyMetaInfo[],
    tagsInfo: TagMetaInfo[],
    authorsInfo: AuthorMetaInfo[]
  ) {
    this.allQuestions = questions
    this.allDifficultiesInfo = difficultiesInfo
    this.allTagsInfos = tagsInfo
    this.allAuthorsInfos = authorsInfo
    commands.registerCommand(Commands.Refresh, () => {
      this.refresh()
    })
  }

  async getData() {
    this.allQuestions = await getAllQuestions()
  }

  async refresh(): Promise<void> {
    await this.getData()
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(
    element: CategoryItem | DifficultyItem | TagItem | AuthorItem
  ): QuestionItem | Thenable<CategoryItem | DifficultyItem | TagItem | AuthorItem | QuestionItem> {
    return element
  }

  getChildren(
    element?: CategoryItem | DifficultyItem | TagItem | AuthorItem
  ): ProviderResult<CategoryItem[] | DifficultyItem[] | TagItem[] | AuthorItem[] | QuestionItem[]> {
    if (element) {
      if (element instanceof CategoryItem) {
        if (element.category === Category.All) {
          return this.getAllQuestionItems()
        } else if (element.category === Category.Difficulties) {
          return this.getDifficultyItems()
        } else if (element.category === Category.Tags) {
          return this.getTagItems()
        } else if (element.category === Category.Authors) {
          return this.getAuthorItems()
        }
      } else if (element instanceof DifficultyItem) {
        return this.getQuestionsItemsByDifficulty(element.difficulty)
      } else if (element instanceof TagItem) {
        return this.getQuestionsItemsByTag(element.tag)
      } else if (element instanceof AuthorItem) {
        return this.getQuestionsItemsByAuthor(element.author)
      }
    } else {
      return this.getCategoryItems()
    }
  }

  getCategoryItems(): CategoryItem[] {
    const categoryItems = [
      new CategoryItem(
        `${Category.All} (${this.getFinishedLengthOfAllQuestions()}/${this.allQuestions.length})`,
        Category.All
      ),
      new CategoryItem(
        `${Category.Difficulties} (${this.allDifficultiesInfo.length})`,
        Category.Difficulties
      ),
      new CategoryItem(`${Category.Tags} (${this.allTagsInfos.length})`, Category.Tags),
      new CategoryItem(`${Category.Authors} (${this.allAuthorsInfos.length})`, Category.Authors)
    ]
    return categoryItems
  }

  getDifficultyItems(): DifficultyItem[] {
    const difficultyItems: DifficultyItem[] = []
    this.allDifficultiesInfo.forEach((item) => {
      const difficultyItem = new DifficultyItem(
        `${item.difficulty} (${this.getFinishedLengthOfDifficulty(item.difficulty)}/${item.count})`,
        item.difficulty
      )
      difficultyItems.push(difficultyItem)
    })
    return difficultyItems
  }

  getTagItems(): TagItem[] {
    const tagItems: TagItem[] = []
    this.allTagsInfos.forEach((item) => {
      const tagItem = new TagItem(
        `${item.tag} (${this.getFinishedLengthOfTag(item.tag)}/${item.count})`,
        item.tag
      )
      tagItems.push(tagItem)
    })
    return tagItems
  }

  getAuthorItems(): AuthorItem[] {
    const authorItems: AuthorItem[] = []
    this.allAuthorsInfos.forEach((item) => {
      const authorItem = new AuthorItem(
        `${item.author} (${this.getFinishedLengthOfAuthor(item.author)}/${item.count})`,
        item.author
      )
      authorItems.push(authorItem)
    })
    return authorItems
  }

  genQuestionsItems(questions: Question[]): QuestionItem[] {
    const questionItems: QuestionItem[] = []
    questions.forEach((question) => {
      const treeItem = new QuestionItem(
        `${question.idx!} - ${question.title!}`,
        {
          title: 'Preview Question',
          command: Commands.PreviewQuestion,
          arguments: [question]
        },
        this.getStatusIcon(question._status)
      )
      questionItems.push(treeItem)
    })
    return questionItems
  }

  getStatusIcon(status: string | undefined): string {
    const completeIconPath = path.join(__dirname, '..', '..', '..', 'resources', 'complete.svg')
    const errorIconPath = path.join(__dirname, '..', '..', '..', 'resources', 'error.svg')
    const todoIconPath = path.join(__dirname, '..', '..', '..', 'resources', 'todo.svg')
    switch (status) {
      case 'complete':
        return completeIconPath
      case 'error':
        return errorIconPath
      case 'todo':
        return todoIconPath
      default:
        return todoIconPath
    }
  }

  getAllQuestionItems(): QuestionItem[] {
    return this.genQuestionsItems(this.allQuestions)
  }

  getQuestionsItemsByDifficulty(difficulty: string): QuestionItem[] {
    const questions = this.allQuestions.filter(
      (item) => item.difficulty === difficulty.toLowerCase()
    )
    return this.genQuestionsItems(questions)
  }

  getQuestionsItemsByTag(tag: string): QuestionItem[] {
    const questions = this.allQuestions.filter((item) => !!item.info?.tags?.includes(tag))
    return this.genQuestionsItems(questions)
  }

  getQuestionsItemsByAuthor(author: string): QuestionItem[] {
    const questions = this.allQuestions.filter(
      (item) => item.info?.author?.name === author || item.info?.author?.github === author
    )
    return this.genQuestionsItems(questions)
  }

  getFinishedLengthOfAllQuestions(): number {
    const finishedLength = this.allQuestions.filter((item) => item._status === 'complete').length
    return finishedLength
  }

  getFinishedLengthOfDifficulty(difficulty: string): number {
    const finishedLength = this.allQuestions.filter(
      (item) => item.difficulty === difficulty.toLocaleLowerCase() && item._status === 'complete'
    ).length
    return finishedLength
  }

  getFinishedLengthOfTag(tag: string): number {
    const finishedLength = this.allQuestions.filter(
      (item) => item.info?.tags?.includes?.(tag) && item._status === 'complete'
    ).length
    return finishedLength
  }

  getFinishedLengthOfAuthor(author: string): number {
    const finishedLength = this.allQuestions.filter(
      (item) =>
        (item.info?.author?.name === author || item.info?.author?.github === author) &&
        item._status === 'complete'
    ).length
    return finishedLength
  }
}
