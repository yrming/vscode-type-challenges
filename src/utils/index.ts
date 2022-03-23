import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'js-yaml';
import type { Question } from '../type';

const rootPath = path.join(__dirname, '..', '..' ,'resources', 'data');

export function getAllQuestions(): Question[] {
    const result: Question[] = [];
    const questions = fs.readdirSync(rootPath);
    questions.forEach(folderName => {
        const question: Question = {};
        const reg = /^(\d+)-([\s\S]+?)-([\s\S]+)$/;
        const matches = folderName.match(reg);
        if (Array.isArray(matches)) {
            question.idx = parseInt(matches[1]);
            question.difficulty = matches[2];
            question._original = folderName;
        }
        const readMePath = path.join(rootPath, folderName, 'README.md');
        question.readMe = fs.readFileSync(readMePath).toString();
        const infoPath = path.join(rootPath, folderName, 'info.yml');
        const info = loadInfo(fs.readFileSync(infoPath).toString());
        question.info = info;
        question.title = info.title;
        result.push(question);
    });
    result.sort((a, b) => a.idx! - b.idx!);
    return result;
}

export function loadInfo(s: string): any {
    const object = YAML.load(s) as any;
    if (!object) {
        return undefined;
    };
  
    const arrayKeys = ['tags', 'related'];
  
    for (const key of arrayKeys) {
      if (object[key]) {
        object[key] = (object[key] || '')
          .toString()
          .split(',')
          .map((i: string) => i.trim())
          .filter(Boolean);
      }
      else {
        object[key] = undefined;
      }
    }
  
    return object;
  }
