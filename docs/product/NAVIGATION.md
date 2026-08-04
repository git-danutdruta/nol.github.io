# Search, Navigation, and Discovery (PROD-005)

## Purpose

As curriculum grows, learners need fast ways to find content, keep context, and resume progress. This document defines product rules for discovery and navigation behavior.

## Scope

- Global search across subjects, chapters, lessons, and topic tags.
- Breadcrumbs on learning routes.
- Continue learning card on home.
- Recent lessons list.
- Bookmark/favorite lessons.
- Subject and chapter index pages.

## Information architecture

### Canonical learning path

- `Subject -> Chapter -> Lesson`
- URLs should reflect hierarchy for predictable back/forward behavior.
- Lesson identity is canonical by `lessonId`; title changes must not break saved user metadata.

### Required metadata for discovery

Search and navigation derive from curriculum metadata already present in content JSON.
Minimum fields used for indexing:

- `subjectId`, `subjectTitle`
- `chapterId`, `chapterTitle`
- `lessonId`, `lessonTitle`
- Optional `tags` (topic keywords)

## Global search

### Query behavior

- Case-insensitive matching.
- Match against subject, chapter, lesson title, and tags.
- Prefix and substring matching are both allowed in MVP.

### Ranking (deterministic)

1. Exact lesson title match.
2. Prefix title match.
3. Tag match.
4. Substring match in chapter/subject metadata.
5. Tiebreaker: preserve source order from curriculum data.

### Result payload

Each result includes:

- `type`: `subject | chapter | lesson`
- `id`: canonical entity id
- `title`
- `breadcrumbs` text (for context)
- `href` route target

### Performance strategy

- Build a compact in-memory index at app bootstrap.
- Support lazy-loading per subject if index size becomes a bottleneck.
- Keep index content metadata-only (no full lesson body text for MVP).

## Breadcrumbs

- Display on chapter and lesson pages.
- Format:
  - Chapter page: `Home / Subject / Chapter`
  - Lesson page: `Home / Subject / Chapter / Lesson`
- Current page segment is not a link.
- Breadcrumb labels come from curriculum metadata, not route params.

## Continue learning

- Home page shows one primary continue card when prior activity exists.
- Source of truth: most recently visited lesson timestamp from progress state.
- If no history exists, hide continue card and show starter recommendations instead.

## Recent lessons

- Show up to 5 most recent lessons on home.
- Recent list is deduplicated by `lessonId`; latest visit wins.
- Selecting a recent item navigates directly to that lesson.

## Bookmarks

- Users can toggle bookmark state on lesson pages and in search results.
- Bookmarks persist locally in browser storage.
- Bookmarked items render in a dedicated home section and optional filter in search.
- Bookmark record shape:
  - `lessonId`
  - `bookmarkedAt` (timestamp)

## Subject and chapter index pages

- Subject page lists chapters with completion summary.
- Chapter page lists lessons with completion markers and optional estimated time.
- Sorting uses curriculum order, not alphabetical order.

## Offline and privacy constraints

- All discovery features must work offline after initial content cache.
- No server-side search calls.
- No personal identifiers are required for bookmarks, recent, or continue behavior.

## Accessibility requirements

- Search dialog is keyboard navigable and screen-reader labeled.
- Breadcrumbs use semantic nav landmarks and ordered hierarchy.
- Bookmark toggle exposes clear pressed/unpressed state.

## Ticket mapping

- `FE-002`: route and shell placement for navigation primitives.
- `FE-005`: lesson integration points for breadcrumbs/bookmarks.
- `FE-011`: persisted activity timestamps used by continue/recent.
- `FE-012`: export/import coverage for bookmark and navigation state when applicable.

## Acceptance criteria coverage

- Search returns curriculum metadata matches via deterministic rank rules.
- Breadcrumbs show precise location on chapter/lesson pages.
- Home page provides continue/recent/bookmark sections when data exists.
- Bookmarks persist locally and survive reload.
