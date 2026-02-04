import fm from 'front-matter';

interface ArticleAttributes {
  id: string; // Changed to string for filename-based IDs
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  published?: boolean;
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 225;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

const articleModules = import.meta.glob('./articles/*.md', { eager: true, query: '?raw', import: 'default' });
const draftModules = import.meta.glob('./drafts/*.md', { eager: true, query: '?raw', import: 'default' });

export const articles = Object.entries({
  ...articleModules,
  ...(import.meta.env.DEV ? draftModules : {})
}).map(([path, content]) => {
  const { attributes, body } = fm<Omit<ArticleAttributes, 'id' | 'readTime'> & { readTime?: string }>(content as string);
  // Use filename key (slug) as ID
  const id = path.split('/').pop()?.replace(/\.md$/, '') || '';
  const readTime = calculateReadTime(body);

  return {
    ...attributes,
    id,
    readTime,
    content: body
  };
}).filter((article) => {
  if (import.meta.env.DEV) return true;

  // Production filters
  if (article.published === false) return false;

  const releaseDate = new Date(article.date);
  if (!isNaN(releaseDate.getTime()) && releaseDate > new Date()) {
    return false;
  }

  return true;
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getYouTubeId = (url: string) => {
  // Robust regex for YouTube IDs (11 characters)
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return match ? match[1] : null;
};

export const videos = articles.reduce((acc, article) => {
  // Regex matches ![Watch: Title](url)
  const videoRegex = /!\[Watch:\s*(.*?)\]\((.*?)\)/g;
  let match;
  while ((match = videoRegex.exec(article.content)) !== null) {
    const [_, title, url] = match;
    const cleanUrl = url.trim();
    const youtubeId = getYouTubeId(cleanUrl);
    if (youtubeId) {
      acc.push({
        id: youtubeId,
        title: title || article.title,
        thumbnail: `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`,
        url: cleanUrl,
        articleId: article.id,
        articleTitle: article.title,
        duration: "Video",
        views: "YouTube"
      });
    }
  }
  return acc;
}, [] as any[]);

export const galleryImages = [
  { image: "/images/gallery/leather-binding.jpg", caption: "Full leather binding with gold tooling" },
  { image: "/images/gallery/quarter-cloth.jpg", caption: "Quarter cloth binding with marbled paper" },
  { image: "/images/gallery/bible-restoration.jpg", caption: "Restoration of a 19th-century bible" },
  { image: "/images/gallery/japanese-stab.jpg", caption: "Japanese Stab Binding (Yotsume Toji)" },
  { image: "/images/gallery/slipcase.jpg", caption: "Custom slipcase construction" },
  { image: "/images/gallery/leather-texture.png", caption: "Hand-dyed leather samples" }
];
