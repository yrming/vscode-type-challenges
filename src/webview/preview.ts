import { marked } from 'marked';

export function getHTMLContent(title: string = '', docStr: string = '') {
    const markdownStr = marked(docStr);
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
            </style>
            <body>
                <div class="container">
                    <div class="preview-container markdown-body">
                        ${markdownStr}
                    </div>
                </div>
            </body>
        </html>
    `;
    return html;
}