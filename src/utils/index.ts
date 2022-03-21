import * as fs from 'fs';
import * as path from 'path';
import type { Question } from '../type';

export function getAllQuestions(): Question[] {
    const result: Question[] = [];
    const rootPath = path.join(__dirname, '..', '..' ,'resources', 'data');
    const questions = fs.readdirSync(rootPath);
    questions.forEach(folderName => {
        const question: Question = {};
        const reg = /^(\d+)-([\s\S]+?)-([\s\S]+)$/;
        const matches = folderName.match(reg);
        if (Array.isArray(matches)) {
            question.idx = parseInt(matches[1]);
            question.difficulty = matches[2];
            question.title = matches[3];
            question._original = folderName;
        }
        result.push(question);
    });
    result.sort((a, b) => a.idx! - b.idx!);
    return result;
}