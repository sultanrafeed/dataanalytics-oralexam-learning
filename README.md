# AT3 Defence Study

A calm, personal study app for the **AT3 oral defence** in 32130 Fundamentals of Data Analytics. It teaches the project from zero, then trains you to answer every likely question at Excellent level: **What → Evidence → Why / trade-off**.

It is a web app, not an App Store app. Host it on GitHub Pages, open it in Safari on an iPhone and choose **Share → Add to Home Screen**. It also works on a laptop, and it works offline after the first visit.

## What is inside

| Mode | What it does |
|---|---|
| **Learn** | 69 lessons in 9 parts. Each one has: In plain words → In my project → Say it → Remember it → Point at → Cover and recall. Mark each lesson "Got it" or "Review again". Includes a searchable glossary of 128 terms. |
| **Story** | The 90-second opening script in 3 stages: Read, Fill the gaps, From memory (90-second countdown, then self-rate). |
| **Flashcards** | 251 cards across 6 topics, plus a "Priority numbers" filter. 5 spaced-repetition boxes. Box 5 = mastered. |
| **Quiz** | 100 four-option questions (72 AT3, 28 AT2) in rounds of 10, each answer explained. "Retry only my misses". |
| **Answer practice** | 37 questions (5 official, 27 follow-ups, 5 AT2). 40-second timer, 3-tap reveal, 3-layer self-check, Listen button. |
| **Code walkthrough** | 28 steps through the notebook, with the real code, "Line by line" notes, what to say, and what to point at. |
| **Progress** | Plain counts, the 10 weakest items, and **Mock defence** (8 questions, then review and a self-rated estimate). |

There are no points, streaks, badges or sounds.

## Files

All files sit in one flat folder.

| File | What it holds |
|---|---|
| `index.html` | All app logic, styles, and the `CONFIG` settings at the top of the script. No study content. |
| `content-learn.js` | Home rubric and 5-day plan, lesson parts, all lessons, and the glossary. |
| `content-cards.js` | All flashcards. |
| `content-quiz.js` | All quiz questions. |
| `content-practice.js` | The 90-second story and the 37 Answer-practice questions. |
| `content-code.js` | The code walkthrough steps. |
| `sw.js` | Offline support (cache-first). |
| `manifest.webmanifest`, `icon.svg`, `apple-touch-icon.png` | Lets the app install to the home screen with an icon. |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are. |

## How to edit the content

Open the file in any text editor, change the text between the quotes, and save. Rules that keep progress safe:

- **Never change an `id`.** Progress is saved by id. A new id counts as a new item.
- Inside text, `**bold**` makes bold and `` `code` `` makes code style.
- **content-learn.js**: each lesson has `plain`, `project`, `say`, `remember`, `point` (cells and text), optional `trap`, and exactly 3 `recall` prompts. A list item can be a sentence, `{ list: [...] }` or `{ table: { head: [...], rows: [[...]] } }`.
- **content-cards.js**: one card per line, using `Q(...)` (question/answer), `B(...)` (fill the blank: put the hidden part in `{{double braces}}`), `X(...)` (contrast pair) or `S(...)` (say-it). Add `true` at the end to mark a Priority number.
- **content-quiz.js**: one `Q(...)` per question. **The first option is always the right answer, and the second is the closest wrong answer.** The app shuffles them.
- **content-practice.js**: `good` is the direct answer, `excellent` is the add-on, and `short` is an optional short version, shown when the full answer is over 80 words.
- **content-code.js**: keep each `c` line identical to the notebook. `n` is the "Line by line" note.
- **Settings** (timers, new cards per session, marks per rating) are in `CONFIG` at the top of the script in `index.html`.

**After any edit, open `sw.js` and change `VERSION`** (for example `at3-study-v1` → `at3-study-v2`). Otherwise installed copies keep showing the old files.

## Run it locally

Opening `index.html` directly works, but offline mode needs a web server:

```sh
npx http-server .
```

Then visit the address it prints.

## Publish on GitHub Pages

In the repository, go to **Settings → Pages**. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**, and save. After a minute the site is at `https://<your-username>.github.io/<repository-name>/`.

## Progress is saved per device and per browser

Progress lives in the browser's storage (`localStorage`). It is not synced. Your iPhone and your laptop keep separate progress. On an iPhone, **the Home Screen app and Safari also keep separate progress**, so pick one and stick with it. "Reset all progress" on the Home screen clears it, after a confirm step.
