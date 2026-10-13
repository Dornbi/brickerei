// Each page is published at /file-name/ (e.g. pages/collabs.md -> /collabs/).
export default {
  layout: 'page.njk',
  permalink: (data) => `/${data.page.fileSlug}/`,
};
