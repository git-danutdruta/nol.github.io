# Gamification and Progress Rules (PROD-003)

## Goals

- Reward consistent practice and correct reasoning, not speed.
- Keep all rules deterministic so UI and tests can derive the same values.
- Preserve user trust with transparent scoring and badge criteria.

## MVP Rule Set (Implemented)

### Lesson completion

- A lesson has `totalExercises` required exercises.
- An exercise is considered completed for mastery when it has at least one correct submission.
- `mastery = correctExerciseIds.length / totalExercises`, clamped to `[0, 1]`.
- A lesson is `completed = true` when `mastery >= 1`.

### XP awards

- Correct answer attempt: `+10 XP`.
- Incorrect answer attempt: `+2 XP`.
- XP is awarded per attempt, including retries.

### Attempts and retries

- `attempts` increments on every submission.
- `correctAttempts` increments only on correct submissions.
- Retries never remove earned XP.
- Incorrect retries do not remove previously recorded correct exercise completion.

### Streak logic

- Every lesson visit and every exercise submission increments `dailyActivity[dateKey]`.
- Streak is the count of consecutive calendar days (including today) where `dailyActivity[dateKey] > 0`.
- Streak resets when a day has no activity.

### Review spacing and mastery review

- On first lesson completion, `reviewLevel = 0` and `nextReviewAt` is set to now + 1 day.
- If the lesson is already complete and user answers correctly after `nextReviewAt`, increase `reviewLevel` by 1.
- Review intervals (days): `[1, 3, 7, 14, 30]`.
- For review levels beyond the list, use the last interval (`30` days).

### Badge criteria

- `first_steps`: total attempts across all lessons >= 1.
- `lesson_finisher`: completed lessons >= 1.
- `streak_3`: current streak >= 3 days.
- `mastery_5`: completed lessons >= 5.

## Progress semantics

### Lesson level

- Driven by `mastery`, `attempts`, `correctAttempts`, and `completed`.

### Chapter level

- `chapterProgress = completedLessonsInChapter / totalLessonsInChapter`.
- This is a derived UI metric from lesson completion state.

### Subject level

- `subjectProgress = completedLessonsInSubject / totalLessonsInSubject`.
- This is a derived UI metric from lesson completion state.

## Determinism and testability

- Rules are pure state transitions over persisted progress state.
- No randomness is used for XP, badges, streak, or completion.
- Time-sensitive behavior depends only on explicit timestamps (`Date.now()` at action time).

## Frontend ticket references

- `FE-011` uses these rules for persistence, completion flags, and review due logic.
- `FE-013` uses these rules for badge display and progress celebrations.
- `PROD-011` builds mastery/review UI from the same lesson completion and review intervals.

## Deferred (post-MVP) enhancements

- Weekly streak surfaces and streak freeze mechanics.
- Difficulty-weighted XP and anti-farming caps.
- Additional badge categories for depth and consistency.
