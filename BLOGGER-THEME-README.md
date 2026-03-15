# MYTEN.IN – Complete Blogger theme

**File to paste in Blogger:** `Blogger-MYTENIN-Complete-Working-Theme.xml`

## How to install

1. In **Blogger**: go to **Theme** → **Edit** (or **Backup / Restore**).
2. Click **Backup / Restore** → **Restore** and choose `Blogger-MYTENIN-Complete-Working-Theme.xml`.  
   **Or** open the XML file, copy everything, then in Theme → **Edit HTML** select all and paste (replacing the existing template). Save.
3. If you use a custom domain, it will keep working. No extra hosting is required.

## What this theme does

- **Blog posts:** Homepage shows latest posts in a grid. Each post card is fully clickable and opens the full post. Single post view shows title, author, date, body, and comments.
- **Search:** Top bar and sidebar search both use `data:blog.searchUrl` and work on Blogger (search returns relevant posts).
- **Navigation:** “Home” + **Pages** (PageList) in the header. All links use `data:blog.homepageUrl` and `data:link.href` so they go to the correct pages.
- **Mobile:** On small screens the main nav becomes a menu that opens/closes with the hamburger button.
- **Layout editor:** Sections and widgets are standard Blogger widgets (Blog, PageList, BlogSearch, Label, Profile, HTML, Attribution) with `showaddelement` where needed so you can add/remove widgets in **Theme → Layout**.
- **Design:** Light layout with accent color, readable fonts (Inter + Plus Jakarta Sans), hover on cards, responsive grid. Optional **Theme** button toggles dark mode (CSS only).
- **SEO:** Single post uses `itemscope`/`itemtype="http://schema.org/BlogPosting"` and `itemprop` for headline, author, datePublished, articleBody. Meta description comes from `data:blog.metaDescription` and title from `data:view.title.escaped`.
- **Extras:** Reading progress bar at the top; back-to-top button with smooth scroll. No custom JS that breaks Blogger’s native widgets.

## Sections you can edit in Layout

- **Navigation** – add/remove pages (PageList).
- **Main** – blog posts (Blog widget).
- **Sidebar Search** – search box in sidebar.
- **Labels / Categories** – labels list (add more Label widgets if needed).
- **About** – profile (Profile widget).
- **Sidebar (Ads / Newsletter)** – add HTML/JavaScript widgets for ads or signup.
- **Footer** – attribution and optional copyright.

## If something doesn’t work

- **Search:** Ensure the form has `action` pointing to the blog search URL (this theme uses `expr:action='data:blog.searchUrl'`). Do not remove the `name='q'` input.
- **Post links:** They use `data:post.url`; do not replace with static URLs.
- **Comments:** The theme shows a simple comments block (link + list). For Blogger’s full comment system (nested replies, etc.) you would need the full default Blog widget markup; this theme keeps the template small and compatible.

You can customize colors in the `<b:skin>` block by changing the `:root` variables (`--accent`, `--dark`, `--gray`, etc.).
