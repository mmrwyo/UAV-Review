# UAV Review: independent screening workspace

A single-file, client-side HTML interface for a 100-record title/abstract calibration and adjudication. Open `index.html` locally or through GitHub Pages. Load the private record pack supplied by the project coordinator; select your name; complete your own review; download JSON and CSV; upload both to the designated Drive folder.

The guidebook is inside the page. This repository contains no record abstracts, PDFs, human responses or private Drive folder IDs. The coordinator provides an offline HTML with the same interface and the records embedded through the private team workspace.

## Data and independence
- The name selector is not authentication. Local storage is not encryption or access control.
- Responses stay in the browser unless the reviewer downloads and shares them. There is no upload backend, analytics, API key or automatic submission.
- Download JSON at each session end. Browser storage may be cleared or unavailable; file:// storage differs between browsers.
- Reviewer A/B initial decisions stay separate. The adjudicator imports their completed JSON files and preserves originals.
- Never commit private record packs, responses, source abstracts or licensed PDFs. Keep them in the team's access-controlled workspace.
- The page validates completion and identifiers, not scientific correctness or reviewer identity.
- This version handles title/abstract calibration only. Full-text extraction/appraisal needs the later stage-specific forms.

## Verification
Run `node test.cjs`. Synthetic tests cover empty initial forms, navigation, completeness gates, sample/reviewer IDs, reason codes, timing and absence of private sample data from the public HTML. Browser smoke check also confirmed 100 blank decisions and blocked incomplete final export. No human decision was supplied by AI.

## Project workflow
1. Calibration and record integrity.
2. Selection and retrieval.
3. Extraction and appraisal.
4. Synthesis and manuscript.
5. Audit and submission readiness.

Do not infer manuscript completion from the bibliography count. Overleaf changes require an explicit request from the project owner.
