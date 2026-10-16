# AT3 Defence Study

A simple study app for the **AT3 oral defence** (32130 Fundamentals of Data Analytics). It teaches the diabetes project topic by topic, then lets you practise the exam questions out loud.

Live at: https://sultanrafeed.github.io/dataanalytics-oralexam-learning/ (open in Safari on iPhone, then **Share → Add to Home Screen**). Works offline after the first visit.

## How it works

**Topics** (32, in the order of the project). Every topic answers the same questions:

1. **What is it?** Plain words and an everyday example (from the course knowledge base)
2. **Why did I use it?**
3. **What did I get?** My results, with numbers
4. **Show it in the notebook.** Cell numbers, the real code, a line-by-line explanation, and what to point at
5. **Say it in the exam.** A ready answer (What → Evidence → Why), with a Listen button
6. **Remember.** One line
7. **Check yourself.** 3 quick questions, then "I understand" or "Review later"

**Exam Qs**: the 37 likely questions (5 official, 27 follow-ups, 5 AT2). Answer out loud with a 40-second timer, then see the Good answer, the Excellent add-on and where to point.

**Test yourself**: 10 quick questions at a time from all topics. Misses come back first.

**Home**: next topic, progress, the 90-second opening (with a hide-the-script mode and timer) and the key numbers on one page.

## Files

| File | What it holds |
|---|---|
| `index.html` | The whole app (logic and styles). No study content. |
| `content-topics.js` | The 32 topics and the key numbers. |
| `content-practice.js` | The 90-second opening and the 37 exam questions. |
| `content-code.js` | Notebook code for each topic, copied exactly from the notebook. |
| `sw.js` | Offline support. |
| `manifest.webmanifest`, `icon.svg`, `apple-touch-icon.png`, `.nojekyll` | Home-screen install and GitHub Pages. |

## Editing

Change the text between the quotes and save. Keep every `id` the same (progress is saved by id). `**bold**` makes bold text. After any edit, change `VERSION` in `sw.js` (for example `at3-study-v2` → `at3-study-v3`) so installed copies update.

## Progress

Progress is saved in the browser, per device. The Home Screen app and Safari keep separate progress, so use one of them.
