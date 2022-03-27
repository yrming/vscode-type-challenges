
export function getHTMLContent(title: string = '', markdownStr: string) {
    const html = `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8"/>
                <title>${title}</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.1.0/github-markdown.min.css" integrity="sha512-KUoB3bZ1XRBYj1QcH4BHCQjurAZnCO3WdrswyLDtp7BMwCw7dPZngSLqILf68SGgvnWHTD5pPaYrXi6wiRJ65g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            </head>
            <style>
                .container {
                    min-height: 100vh;
                }
                .preview-container {
                    width: 100vw;
                    padding: 10px;
                    background: transparent;
                }
                @media (prefers-color-scheme: light) {
                    .markdown-body {
                      color-scheme: light;
                      --color-prettylights-syntax-comment: #8b949e;
                      --color-prettylights-syntax-constant: #79c0ff;
                      --color-prettylights-syntax-entity: #d2a8ff;
                      --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
                      --color-prettylights-syntax-entity-tag: #7ee787;
                      --color-prettylights-syntax-keyword: #ff7b72;
                      --color-prettylights-syntax-string: #a5d6ff;
                      --color-prettylights-syntax-variable: #ffa657;
                      --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
                      --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
                      --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
                      --color-prettylights-syntax-carriage-return-text: #f0f6fc;
                      --color-prettylights-syntax-carriage-return-bg: #b62324;
                      --color-prettylights-syntax-string-regexp: #7ee787;
                      --color-prettylights-syntax-markup-list: #f2cc60;
                      --color-prettylights-syntax-markup-heading: #1f6feb;
                      --color-prettylights-syntax-markup-italic: #c9d1d9;
                      --color-prettylights-syntax-markup-bold: #c9d1d9;
                      --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
                      --color-prettylights-syntax-markup-deleted-bg: #67060c;
                      --color-prettylights-syntax-markup-inserted-text: #aff5b4;
                      --color-prettylights-syntax-markup-inserted-bg: #033a16;
                      --color-prettylights-syntax-markup-changed-text: #ffdfb6;
                      --color-prettylights-syntax-markup-changed-bg: #5a1e02;
                      --color-prettylights-syntax-markup-ignored-text: #c9d1d9;
                      --color-prettylights-syntax-markup-ignored-bg: #1158c7;
                      --color-prettylights-syntax-meta-diff-range: #d2a8ff;
                      --color-prettylights-syntax-brackethighlighter-angle: #8b949e;
                      --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
                      --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
                      --color-fg-default: #c9d1d9;
                      --color-fg-muted: #8b949e;
                      --color-fg-subtle: #484f58;
                      --color-canvas-default: #0d1117;
                      --color-canvas-subtle: #161b22;
                      --color-border-default: #30363d;
                      --color-border-muted: #21262d;
                      --color-neutral-muted: rgba(110,118,129,0.4);
                      --color-accent-fg: #58a6ff;
                      --color-accent-emphasis: #1f6feb;
                      --color-attention-subtle: rgba(187,128,9,0.15);
                      --color-danger-fg: #f85149;
                    }
                  }                  
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
                </script>
        </html>
    `;
    return html;
}