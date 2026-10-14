# AT3 Oral Defence Coach

A personal iPhone study app for the **AT3 Oral Defence** (15 Oct 2026). It holds the whole study guide and turns it into practice:

| Tab | What it does |
|---|---|
| **Home** | Countdown, readiness score, the 3-layer answer method, golden rules, one-evening plan |
| **Learn** | All 10 guide sections: marking, 90-second story, numbers, the 5 official questions, code walkthrough (cell by cell), every model, evaluation ideas (with an interactive confusion matrix), 27 follow-up questions, AT2 preprocessing, practice plan and day-of checklist |
| **Practice** | 7 flashcard decks (138 cards) with spaced repetition, "Which model?" and "Which cell?" quizzes |
| **Mock** | Random examiner questions with a 40-second timer. Reveal the model answer, tick the layers you said, and get scored Excellent / Good |
| **Search** | Find any number, cell, or answer instantly (try `0.27`, `pid`, `cell 57`) |

Other tools: a 75-second timer and voice recorder for the 90-second story, first-letter and fill-the-gap memory modes, and "test me" modes that hide the answers. It works offline once opened, and progress is saved on the phone.

## Install on iPhone

1. Open the app's GitHub Pages link in **Safari**: `https://sultanrafeed.github.io/dataanalytics-oralexam-learning/`
2. Tap **Share**, then **Add to Home Screen**.
3. Open it from the home screen. It runs full screen and works offline.

### First-time setup of GitHub Pages (once)

In the repository go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**. Then re-run the **Deploy app to GitHub Pages** workflow from the **Actions** tab (or push any change in `app/`). On a free GitHub plan, Pages needs the repository to be public.

## Run locally

It is plain HTML, CSS and JavaScript with no build step:

```sh
npx http-server app
```

## Editing content

All study content lives in [`app/data.js`](app/data.js). Change a number or answer there and every page, flashcard, quiz and search result updates. After changing files, bump `CACHE` in `app/sw.js` so installed copies pick up the update.
