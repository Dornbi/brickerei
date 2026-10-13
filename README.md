# Brickerei website

The Brickerei website (www.brickerei.com), moved from Jimdo to a setup that costs nothing to run:

- **Content** lives as simple text files (Markdown) in a GitHub repository: `src/posts/` (blog), `src/pages/` (pages), `src/index.md` (home page), `src/_data/site.json` (settings, menu, footer).
- **Pages CMS** (app.pagescms.org, free and open source) is the editor: a web interface with login where members write posts and upload photos. Each change is saved back to GitHub.
- **Vercel** (free Hobby plan) notices each change, rebuilds the site in under a minute and publishes it.
- **Eleventy** is the small generator that turns the text files into the finished pages. Nobody needs to touch it.

All old Jimdo addresses keep working (`/collabs/`, `/blog-1/`, `/2025/11/25/neue-collab-2026-in-planung-space/` …).

---

## One-time setup (about 30 minutes)

### 1. Save the photos from Jimdo (before cancelling Jimdo!)

The content still points to the photos on Jimdo's servers. Download them into the project once:

1. Install **Node.js** (LTS) from https://nodejs.org.
2. In a terminal, in this folder:

   ```
   npm install
   npm run fetch-images
   ```

   This saves all 162 photos into `src/images/` and switches every page to them. If some fail, run it again.
3. Optional preview: `npm start`, then open http://localhost:8080.

### 2. Put the project on GitHub

1. Create a free account at github.com (if you don't have one) and a new **private** repository, e.g. `brickerei-website`.
2. Upload this folder to it. Easiest: **GitHub Desktop** (desktop.github.com) → *File → Add local repository* → choose this folder → *Publish*.
   (The web upload is limited to 100 files at a time, and there are more than that because of the photos.)

### 3. Connect Vercel

1. Sign up at vercel.com with your GitHub account (choose the free **Hobby** plan).
2. *Add New → Project* → import `brickerei-website`. All settings come from `vercel.json`, so just click **Deploy**.
3. After a minute the site is live at an address like `brickerei-website.vercel.app`. Check it.

### 4. Connect Pages CMS

1. Go to **app.pagescms.org** and sign in with GitHub.
2. Install the Pages CMS GitHub App when asked, and give it access to the `brickerei-website` repository.
3. Open the repository. The menu shows **Blog**, **Startseite**, **Seiten** and **Einstellungen**.
4. **Invite the other members** by email in the repository's collaborator settings. They don't need a GitHub account; they get a login link by email and can edit content and photos only.

### 5. Point the domain to Vercel

In Vercel: *Project → Settings → Domains* → add `www.brickerei.com` and `brickerei.com`.
Vercel shows the DNS records to enter at your domain registrar. HTTPS is set up automatically.

---

## Anleitung für die Redaktion (Deutsch)

Einloggen unter **app.pagescms.org** (Link aus der Einladungs-E-Mail) → Repository *brickerei-website* öffnen.

**Neuer Blog-Beitrag**
1. Links **Blog** → **Hinzufügen**.
2. Titel, Datum und Kategorie ausfüllen, Text schreiben.
3. Bilder über das Bild-Symbol im Text-Editor hochladen.
   - **Mehrere Bilder direkt hintereinander** werden automatisch zu einer **Galerie** (Klick öffnet die Grossansicht).
   - Ein einzelnes Bild wird gross angezeigt.
4. Ein **YouTube-Link allein in einer Zeile** wird automatisch als Video eingebettet.
5. **Speichern**. Nach ca. 1 Minute ist der Beitrag online, auch auf der Startseite und in der Kategorie.

Die Adresse des Beitrags entsteht automatisch aus Datum und Titel, z. B. `/2026/03/14/space-collab-premiere/`.
Das Feld „Alte Adresse“ bitte leer lassen.

**Seiten ändern** (Collabs, Community, Links, Impressum, Datenschutz): Links **Seiten** → Seite wählen → ändern → speichern.
Eine neue Collab kommt auf der Seite *Collabs* einfach zuoberst dazu (Überschrift, Text, Bilder).

**Startseite**: Einleitungstext und den orangen Button (Text + Link).

**Einstellungen**: Kontakt-E-Mail, Flickr-Link, Titelbild der Startseite, Menü und der Hinweis
**„Nächste Ausstellung“** in der Fusszeile (leer lassen, um ihn auszublenden).

Etwas schiefgegangen? Jede Änderung ist auf GitHub gespeichert und lässt sich dort wiederherstellen.

---

## For whoever maintains the code

| What | Where |
|---|---|
| Layout / header / footer | `src/_includes/base.njk` |
| Post, page and home templates | `src/_includes/post.njk`, `page.njk`, `home.njk`, `card.njk` |
| Blog overview & category pages | `src/blog-1/` |
| Blog categories | `src/_data/categories.json` (keep in sync with the select values in `.pages.yml`) |
| Styles, photo viewer, favicon | `src/assets/` |
| Gallery / YouTube handling | `eleventy.config.js` |
| CMS fields | `.pages.yml` |
| Redirects, build settings | `vercel.json` |

Commands: `npm start` (local preview with live reload), `npm run build` (output in `_site/`).

Changes compared to the Jimdo site: a new, short Datenschutz page (no cookies or tracking; please have it reviewed),
no Jimdo shop pages (Gewährleistung/Widerruf), the Powr.io widget on the home page replaced by the three newest posts,
and YouTube embedded in privacy-friendly mode.
