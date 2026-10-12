
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

// File to convert (can be overridden later)
const inputFile = process.argv[2] || 'markdown-webflow-test.md';

// Read the original Markdown file
const markdown = await fs.readFile(inputFile, 'utf8');

// Separate YAML metadata from the article body
const { data, content } = matter(markdown);

// Convert Markdown into HTML
const result = await unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(content);

const html = String(result);

// Prepare structured content for Webflow
const article = {
  title: String(data.title || 'Untitled Article'),
  slug: String(data.slug || path.basename(inputFile, '.md')),
  status: String(data.status || 'draft'),
  author: data.author || null,
  excerpt: String(data.excerpt || data.description || ''),
  sourceFile: inputFile,
  html
};

// Create output directory
await fs.mkdir('output', { recursive: true });

// Save converted HTML
await fs.writeFile('output/article.html', html, 'utf8');

// Save structured article metadata
await fs.writeFile(
  'output/article.json',
  JSON.stringify(article, null, 2),
  'utf8'
);

console.log('Markdown conversion successful!');
console.log(`Title: ${article.title}`);
console.log(`Slug: ${article.slug}`);
console.log(`HTML length: ${html.length} characters`);
console.log('Generated: output/article.html');
console.log('Generated: output/article.json');
