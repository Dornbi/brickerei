// Every blog post gets the address /YYYY/MM/DD/name-of-file/ (same scheme as on Jimdo).
// Posts copied from Jimdo whose old address differs keep it via the "old_url" field.
export default {
  layout: 'post.njk',
  permalink: (data) => {
    if (data.old_url) return data.old_url;
    const d = data.page.date;
    const p = (n) => String(n).padStart(2, '0');
    return `/${d.getUTCFullYear()}/${p(d.getUTCMonth() + 1)}/${p(d.getUTCDate())}/${data.page.fileSlug}/`;
  },
};
