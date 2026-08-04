# Explicit Non-Goals

This document lists what the NOL Math Learning PWA intentionally does **not** do. It protects the project from scope creep and keeps the team focused.

1. **Cloud accounts or authentication.** We do not require users to sign up or log in. Progress stays local unless the user explicitly exports it.

2. **Real-time multiplayer or collaboration.** Lessons are single-player experiences. Collaborative whiteboards or classrooms are out of scope.

3. **AI-generated curriculum content at launch.** All MVP content is human-authored and reviewed. AI-assisted generation may be explored in a future phase.

4. **Native mobile apps.** We target browsers and PWA installation only. No iOS or Android native builds are planned for MVP.

5. **Full localization of all curriculum content at launch.** The architecture supports i18n, but only UI strings are translated initially. Curriculum translations come via community PRs.

6. **Advanced computer algebra system (CAS).** We use mathjs for evaluation and graphing, but symbolic integration, differentiation, and equation solving are deferred.

7. **Video lessons.** Content is text, math notation, interactive examples, and drawings. Video hosting and streaming are out of scope.

8. **Social features.** No leaderboards, public profiles, comments, or sharing to social networks.

9. **In-app purchases or subscriptions.** The project is free and open-source. No payment flows.

10. **3D plotting in MVP.** Three.js support is architected but only lazy-loaded after MVP.

11. **Geometric construction in MVP.** Compass-and-straightedge tools are deferred to Phase 6.

12. **Backend server or API.** The app is fully static and deployed to GitHub Pages. No runtime backend is required.

13. **Automated grading of open-ended proofs.** Self-check and multiple-choice style feedback are supported; natural-language proof grading is not.

14. **Cross-curricular content.** We focus exclusively on mathematics. Physics, coding, and other subjects are out of scope.

15. **Live customer support.** Feedback is collected via GitHub issues and email. No live chat or helpdesk integration.
