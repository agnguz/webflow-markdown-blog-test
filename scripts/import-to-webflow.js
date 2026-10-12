
import fs from 'node:fs/promises';

const token = process.env.WEBFLOW_API_TOKEN;
const collectionId = process.env.WEBFLOW_COLLECTION_ID;

if (!token || !collectionId) {
  throw new Error('Missing Webflow token or Collection ID');
}

const apiBase = 'https://api.webflow.com/v2';

async function webflowRequest(endpoint, options = {}) {
  const response = await fetch(`${apiBase}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(
      `Webflow API error ${response.status}: ${text}`
    );
  }

  return text ? JSON.parse(text) : {};
}

// Read the converted article
const article = JSON.parse(
  await fs.readFile('output/article.json', 'utf8')
);

let html = article.html;

// Remove first H1 only if its text matches the CMS title
const firstHeading = html.match(/^<h1>([\s\S]*?)<\/h1>\s*/i);

if (firstHeading) {
  const headingText = firstHeading[1]
    .replace(/<[^>]+>/g, '')
    .trim();

  if (headingText === article.title.trim()) {
    html = html.slice(firstHeading[0].length);
    console.log('Duplicate H1 removed.');
  }
}

// Retrieve actual CMS field identifiers
const collection = await webflowRequest(
  `/collections/${collectionId}`
);

function fieldSlug(displayName) {
  return collection.fields.find(
    field => field.displayName === displayName
  )?.slug;
}

const bodyField = fieldSlug('Post Body');

if (!bodyField) {
  throw new Error('Post Body Rich Text field not found');
}

// Use a dedicated slug for our one-time test
const testSlug = `${article.slug}-github-test`;

const fieldData = {
  name: article.title,
  slug: testSlug,
  [bodyField]: html
};

const excerptField = fieldSlug('Excerpt');
if (excerptField && article.excerpt) {
  fieldData[excerptField] = article.excerpt;
}

const pathField = fieldSlug('GitHub File Path');
if (pathField) {
  fieldData[pathField] = article.sourceFile;
}

// Create a staged DRAFT item, never a live item
const result = await webflowRequest(
  `/collections/${collectionId}/items/insert`,
  {
    method: 'POST',
    body: JSON.stringify({
      items: [
        {
          isDraft: true,
          isArchived: false,
          fieldData
        }
      ]
    })
  }
);

console.log('Webflow draft creation response received.');
console.log(JSON.stringify({
  requestedSlug: testSlug,
  isDraft: true,
  createdItems: result.items?.map(item => ({
    id: item.id,
    isDraft: item.isDraft
  })) ?? []
}, null, 2));
