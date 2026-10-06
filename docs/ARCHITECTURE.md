# DM Studio — Architecture v1.0

## Folders
- src/app — pages/routes
- src/components — reusable components and homepage sections
- src/data — services, cases, posts, navigation, company data
- src/content/blog — long-form blog content
- src/lib — SEO, analytics, helpers
- src/types — TypeScript models
- src/styles — global design system
- public/images — imagery grouped by purpose

## Add a case
Add metadata to src/data/cases.ts, then create public/images/cases/<slug>/ for its assets.

## Add a blog post
Add metadata to src/data/posts.ts, cover to public/images/blog/, and article content to src/content/blog/.

## Rule
Keep content separate from generic UI and never dump unrelated assets into one folder.
