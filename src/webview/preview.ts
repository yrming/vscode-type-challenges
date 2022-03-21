export function getHTMLContent(title: string = '', content: string = '') {
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
            </style>
            <body>
                <div id="container"></div>
                <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
                <script>
                    document.getElementById('container').innerHTML = marked.parse('# Marked in browser\n\nRendered by **marked**.');
                </script>
            </body>
        </html>
    `;
    return html;
}