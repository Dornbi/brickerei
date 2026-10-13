// Eleventy turns the Markdown files in src/ into the finished website in _site/.
// Editors never need to touch this file.

const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
  'August', 'September', 'Oktober', 'November', 'Dezember'];

const IMG = String.raw`(?:<a [^>]*>\s*)?<img [^>]*>(?:\s*<\/a>)?`;
const IMG_PARA = new RegExp(String.raw`<p>((?:\s*${IMG}\s*(?:<br\s*\/?>)?)+)\s*<\/p>`, 'g');
const IMG_RUN = new RegExp(String.raw`(?:<p>(?:\s*${IMG}\s*(?:<br\s*\/?>)?)+\s*<\/p>\s*)+`, 'g');
const YT = /<p>\s*(?:<a [^>]*>)?\s*https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})[^<\s]*\s*(?:<\/a>)?\s*<\/p>/g;

const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1] || '';
const addLazy = (img) => (/loading=/.test(img) ? img : img.replace('<img ', '<img loading="lazy" '));

// Several photos in a row -> gallery grid with a full-screen viewer. A single photo stays a normal picture.
function photos(html) {
  html = html.replace(IMG_RUN, (run) => {
    const items = [...run.matchAll(new RegExp(IMG, 'g'))].map((m) => m[0]);
    if (items.length === 1) {
      return '<p class="photo">' + addLazy(items[0]) + '</p>';
    }
    return '<div class="gallery">' + items.map((item) => {
      const img = item.match(/<img [^>]*>/)[0];
      const link = attr(item.match(/<a [^>]*>/)?.[0] || '', 'href');
      const href = link || attr(img, 'src');
      const lb = link ? '' : ' data-lightbox';
      return `<a href="${href}"${lb}>${addLazy(img)}</a>`;
    }).join('') + '</div>';
  });
  return html.replace(YT, (m, id) =>
    `<div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube-Video" allowfullscreen loading="lazy"></iframe></div>`);
}

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': '/' });
  eleventyConfig.addPassthroughCopy('src/images');

  eleventyConfig.addCollection('posts', (api) =>
    api.getFilteredByGlob('src/posts/*.md').sort((a, b) => b.date - a.date));

  eleventyConfig.addFilter('germanDate', (d) =>
    `${String(d.getUTCDate()).padStart(2, '0')}. ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`);
  eleventyConfig.addFilter('byCategory', (posts, cat) => posts.filter((p) => p.data.category === cat));
  eleventyConfig.addFilter('excerpt', (html, n = 220) => {
    const t = (html || '').replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ').trim();
    return t.length <= n ? t : t.slice(0, n).replace(/\s+\S*$/, '') + ' …';
  });
  eleventyConfig.addFilter('firstImage', (html) => ((html || '').match(/<img [^>]*src="([^"]+)"/) || [])[1]);
  eleventyConfig.addFilter('head', (arr, n) => arr.slice(0, n));
  eleventyConfig.addFilter('isoDate', (d) => d.toISOString().slice(0, 10));

  eleventyConfig.addTransform('photos', function (content) {
    return (this.page.outputPath || '').endsWith('.html') ? photos(content) : content;
  });

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: '_site' },
    markdownTemplateEngine: false,   // Markdown is plain content – no template code inside posts
    htmlTemplateEngine: 'njk',
  };
}
