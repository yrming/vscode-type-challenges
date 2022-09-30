import { markdown } from './markdown'
import { highlight } from './highlight'

export function getPreviewHTMLContent(title: string = '', markdownStr: string) {
  const html = `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8"/>
                <title>${title}</title>
            </head>
            <style>
                .container {
                    min-height: 100vh;
                }
                .preview-container {
                    background: transparent;
                }
            </style>
            <style>
                ${markdown}
            </style>
            <style>
                ${highlight}
            </style>
            <body>
                <div class="container">
                    <div class="preview-container markdown-body">
                        ${markdownStr}
                    </div>
                </div>
                <script>
                    const vscode = acquireVsCodeApi();

                    const $readmeENElem = document.querySelector('a[href="./README.md"]');
                    $readmeENElem && $readmeENElem.addEventListener('click', function() {
                        vscode.postMessage({
                            command: 'switchReadMe',
                            text: 'readMe'
                        })
                    })

                    const $readmeZHElem = document.querySelector('a[href="./README.zh-CN.md"]');
                    $readmeZHElem && $readmeZHElem.addEventListener('click', function() {
                        vscode.postMessage({
                            command: 'switchReadMe',
                            text: 'readMeZh'
                        })
                    })

                    const $readmeJAElem = document.querySelector('a[href="./README.ja.md"]');
                    $readmeJAElem && $readmeJAElem.addEventListener('click', function() {
                        vscode.postMessage({
                            command: 'switchReadMe',
                            text: 'readMeJa'
                        })
                    })

                    const $readmeKOElem = document.querySelector('a[href="./README.ko.md"]');
                    $readmeKOElem && $readmeKOElem.addEventListener('click', function() {
                        vscode.postMessage({
                            command: 'switchReadMe',
                            text: 'readMeKo'
                        })
                    })

                    const $relatedElems = document.querySelectorAll('a[href^="https://github.com/type-challenges/type-challenges/blob/main/questions/"]');
                    $relatedElems.forEach(function($relatedElem) {
                        $relatedElem && $relatedElem.addEventListener('click', function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            const href = $relatedElem.getAttribute('href');
                            const title = href.replace('https://github.com/type-challenges/type-challenges/blob/main/questions/', '').replace('/README.md', '');
                            vscode.postMessage({
                                command: 'previewRelated',
                                text: title
                            })
                        })
                    })

                    const $backElem = document.querySelector('a[href="../../README.md"]');
                    $backElem && $backElem.addEventListener('click', function() {
                        vscode.postMessage({
                            command: 'back'
                        })
                    })

                    const $takeElem = document.querySelector('a[href*="/play"]');
                    $takeElem && $takeElem.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        const idx = ${title.split('-')[0].trim()}
                        vscode.postMessage({
                            command: 'takeChallenge',
                            text: idx
                        })
                    })
                </script>
            </body>
        </html>
    `
  return html
}
