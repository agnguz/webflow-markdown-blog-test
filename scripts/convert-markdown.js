
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { createHighlighter } from 'shiki';

// Markdown source
const inputFile =
  process.argv[2] || 'markdown-webflow-test.md';

const markdown = await fs.readFile(inputFile, 'utf8');
const { data, content } = matter(markdown);

// Initialize Shiki once
const highlighter = await createHighlighter({
  themes: ['github-dark'],
  langs: [
    'javascript',
    'typescript',
    'html',
    'css',
    'json',
    'bash'
  ]
});

// Common Markdown language aliases
const languageAliases = {
  js: 'javascript',
  jsx: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  html: 'html',
  xml: 'html',
  css: 'css',
  json: 'json',
  sh: 'bash',
  shell: 'bash',
  bash: 'bash'
};

// Our custom rehype plugin for Shiki
function rehypeHighlightCode() {
  return function (tree) {
    function visit(node) {
      if (!node.children) return;

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (child.type === 'element' &&
            child.tagName === 'pre') {

          const code = child.children?.find(
            item => item.tagName === 'code'
          );

          if (!code) continue;

          const classes =
            code.properties?.className || [];

          const languageClass = classes.find(
            name => name.startsWith('language-')
          );

          if (!languageClass) continue;

          const requestedLanguage =
            languageClass.slice(9);

          const language =
            languageAliases[requestedLanguage] ||
            requestedLanguage;

          // Leave unsupported languages untouched
          if (!highlighter.getLoadedLanguages()
            .includes(language)) {
            console.log(
              `Skipping highlighting: ${language}`
            );
            continue;
          }

          // Extract original code without altering it
          const getText = node => {
            if (node.type === 'text') {
              return node.value;
            }
            return (node.children || [])
              .map(getText)
              .join('');
          };

          const originalCode = getText(code);

          // Generate highlighted HTML structure
          const highlighted = highlighter.codeToHast(
            originalCode,
            {
              lang: language,
              theme: 'github-dark'
            }
          );

          const highlightedPre =
            highlighted.children.find(
              item => item.tagName === 'pre'
            );

          if (highlightedPre) {
            // Keep the language available for styling
            
highlightedPre.properties.className = [
  'shiki',
  'github-dark',
  'language-' + language
];

// Prevent duplicate HTML class attributes
delete highlightedPre.properties.class;

          }

        } else {
          visit(child);
        }
      }
    }

    visit(tree);
  };
}

// Convert Markdown to highlighted HTML
const result = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlightCode)
  .use(rehypeStringify)
  .process(content);

const html = String(result);

// Metadata for Webflow
const article = {
  title: String(data.title || 'Untitled Article'),
  slug: String(
    data.slug || path.basename(inputFile, '.md')
  ),
  status: String(data.status || 'draft'),
  author: data.author || null,
  excerpt: String(
    data.excerpt || data.description || ''
  ),
  sourceFile: inputFile,
  html
};

// Save output
await fs.mkdir('output', { recursive: true });

await fs.writeFile(
  'output/article.html',
  html,
  'utf8'
);

await fs.writeFile(
  'output/article.json',
  JSON.stringify(article, null, 2),
  'utf8'
);

console.log('Markdown conversion successful!');
console.log('Shiki syntax highlighting applied.');
console.log(`Title: ${article.title}`);
console.log(`Slug: ${article.slug}`);
console.log(`HTML length: ${html.length} characters`);
console.log('Generated: output/article.html');
console.log('Generated: output/article.json');
