---
title: "Markdown to Webflow: Advanced Formatting Test"
slug: "markdown-webflow-advanced-test"
description: "A stress-test article for a GitHub to Webflow CMS integration."
author: "Test Author"
date: "2026-10-12"
status: "draft"
tags:
  - markdown
  - webflow
  - integration
cover_image: ""
---

# Markdown to Webflow: Advanced Formatting Test

This article tests **bold text**, *italics*, ***bold italics***, ~~strikethrough~~, and `inline code`. Visit [Webflow](https://webflow.com) to test a link.

## Heading level two

### Heading level three

#### Heading level four

A paragraph with an escaped character: \*this is not italic\*.

---

## Lists

- First bullet
- Second bullet
  - Nested bullet
  - Another nested bullet
- Third bullet

1. First numbered item
2. Second numbered item
   1. Nested numbered item
3. Third numbered item

## Tasks (GitHub-flavored Markdown)

- [x] Create the Markdown file
- [ ] Convert Markdown to HTML
- [ ] Confirm styling in Webflow

## Blockquote

> Design is not just what it looks like.
>
> It is also how it works in practice.

## Code blocks

JavaScript with a language identifier:

```javascript
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

greet("Webflow");
```

HTML code sample:

```html
<article class="blog-post">
  <h2>Accessible heading</h2>
  <p>Code should display rather than execute.</p>
</article>
```

CSS code sample:

```css
.blog-content pre {
  overflow-x: auto;
  padding: 1.5rem;
  border-radius: 0.75rem;
}
```

## Table (GFM)

| Feature | Expected result | Status |
| :--- | :---: | ---: |
| Headings | Webflow typography | Test |
| Code blocks | Monospace, scrollable | Test |
| Tables | Responsive | Test |

## Image

![A sample landscape used to test image rendering](https://placehold.co/1200x630/png?text=Webflow+Markdown+Image+Test)

*Image caption: A remote test image; replace with a stable, owned asset before production.*

## Callout (GitHub alert syntax)

> [!NOTE]
> This GitHub-style note may require a custom conversion to HTML.

> [!WARNING]
> Do not publish API tokens inside your Markdown files.

## Footnote

This sentence has a footnote.[^first]

[^first]: This footnote should appear at the bottom with a backlink.

## Collapsible details (raw HTML)

<details>
<summary>Open the extra explanation</summary>

This content is initially collapsed where raw HTML details elements are supported.

</details>

## Mermaid diagram (extension)

```mermaid
flowchart LR
  A[GitHub Markdown] --> B[Markdown converter]
  B --> C[Webflow CMS]
  C --> D[Published page]
```

## Mathematical notation (extension)

Inline math: $E = mc^2$.

Block math:

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$

## Definition-list style syntax (extension)

Markdown
: A plain-text format with lightweight markup.

## Final checklist

The test is complete only after checking desktop and mobile layouts, links, text styles, code overflow, tables, image handling, and unsupported extensions in the published Webflow page.
