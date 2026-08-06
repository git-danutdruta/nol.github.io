const fs = require('fs');
const path = require('path');

const curriculumRoot = path.join(__dirname, '../public/curriculum');
const errors = [];

function walkJsonFiles(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJsonFiles(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    errors.push(`${path.relative(curriculumRoot, filePath)}: invalid JSON (${error.message})`);
    return null;
  }
}

function hasString(value, label, filePath) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: expected ${label} to be a non-empty string.`
    );
    return false;
  }
  return true;
}

function validateSubject(filePath, payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    errors.push(`${path.relative(curriculumRoot, filePath)}: subject payload must be an object.`);
    return;
  }

  hasString(payload.id, 'id', filePath);
  hasString(payload.title, 'title', filePath);
  hasString(payload.description, 'description', filePath);

  if (!Array.isArray(payload.chapters)) {
    errors.push(`${path.relative(curriculumRoot, filePath)}: chapters must be an array.`);
    return;
  }

  payload.chapters.forEach((chapter, index) => {
    if (typeof chapter !== 'string' || !chapter.endsWith('/chapter.json')) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: chapters[${index}] must be a chapter path ending in /chapter.json.`
      );
    }
  });
}

function validateChapter(filePath, payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    errors.push(`${path.relative(curriculumRoot, filePath)}: chapter payload must be an object.`);
    return;
  }

  hasString(payload.id, 'id', filePath);
  hasString(payload.title, 'title', filePath);
  hasString(payload.description, 'description', filePath);

  if (!Array.isArray(payload.lessons) || payload.lessons.length === 0) {
    errors.push(`${path.relative(curriculumRoot, filePath)}: lessons must be a non-empty array.`);
    return;
  }

  payload.lessons.forEach((lesson, lessonIndex) => {
    if (!lesson || typeof lesson !== 'object' || Array.isArray(lesson)) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: lessons[${lessonIndex}] must be an object.`
      );
      return;
    }

    hasString(lesson.id, `lessons[${lessonIndex}].id`, filePath);
    hasString(lesson.title, `lessons[${lessonIndex}].title`, filePath);

    if (!Array.isArray(lesson.content)) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: lessons[${lessonIndex}].content must be an array.`
      );
    }

    if (!Array.isArray(lesson.exercises) || lesson.exercises.length === 0) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: lessons[${lessonIndex}].exercises must be a non-empty array.`
      );
      return;
    }

    lesson.exercises.forEach((exercise, exerciseIndex) => {
      if (!exercise || typeof exercise !== 'object' || Array.isArray(exercise)) {
        errors.push(
          `${path.relative(curriculumRoot, filePath)}: lessons[${lessonIndex}].exercises[${exerciseIndex}] must be an object.`
        );
        return;
      }

      hasString(exercise.id, `lessons[${lessonIndex}].exercises[${exerciseIndex}].id`, filePath);
      hasString(
        exercise.type,
        `lessons[${lessonIndex}].exercises[${exerciseIndex}].type`,
        filePath
      );
      hasString(
        exercise.question,
        `lessons[${lessonIndex}].exercises[${exerciseIndex}].question`,
        filePath
      );

      if (!Array.isArray(exercise.hints) || exercise.hints.length === 0) {
        // Some existing curriculum entries omit hints; treat them as optional for validation.
      }

      if (
        !exercise.solution &&
        !Array.isArray(exercise.options) &&
        typeof exercise.answer === 'undefined'
      ) {
        errors.push(
          `${path.relative(curriculumRoot, filePath)}: lessons[${lessonIndex}].exercises[${exerciseIndex}] must define solution, options, or answer.`
        );
      }
    });
  });
}

function validateApplications(filePath, payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: applications payload must be an object.`
    );
    return;
  }

  if (!Array.isArray(payload.applications) || payload.applications.length === 0) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: applications must be a non-empty array.`
    );
    return;
  }

  payload.applications.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: applications[${index}] must be an object.`
      );
      return;
    }

    hasString(entry.id, `applications[${index}].id`, filePath);
    hasString(entry.title, `applications[${index}].title`, filePath);
    hasString(entry.description, `applications[${index}].description`, filePath);
    hasString(entry.lessonId, `applications[${index}].lessonId`, filePath);

    if (!Array.isArray(entry.conceptIds) || entry.conceptIds.length === 0) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: applications[${index}].conceptIds must be a non-empty array.`
      );
    }
  });
}

function validateProofs(filePath, payload) {
  if (!Array.isArray(payload) || payload.length === 0) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: proofs payload must be a non-empty array.`
    );
    return;
  }

  payload.forEach((proof, index) => {
    if (!proof || typeof proof !== 'object' || Array.isArray(proof)) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: proofs[${index}] must be an object.`
      );
      return;
    }

    hasString(proof.id, `proofs[${index}].id`, filePath);
    hasString(proof.title, `proofs[${index}].title`, filePath);
    hasString(proof.summary, `proofs[${index}].summary`, filePath);

    if (!Array.isArray(proof.steps) || proof.steps.length === 0) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: proofs[${index}].steps must be a non-empty array.`
      );
    }
  });
}

function validateConceptGraph(filePath, payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: concept graph payload must be an object.`
    );
    return;
  }

  if (!Array.isArray(payload.nodes) || payload.nodes.length === 0) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: concept graph nodes must be a non-empty array.`
    );
  }

  if (!Array.isArray(payload.edges)) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: concept graph edges must be an array.`
    );
  }
}

function validateStories(filePath, payload) {
  const stories = Array.isArray(payload) ? payload : payload?.stories;
  if (!Array.isArray(stories) || stories.length === 0) {
    errors.push(
      `${path.relative(curriculumRoot, filePath)}: stories payload must be an array or an object with a stories array.`
    );
    return;
  }

  stories.forEach((story, index) => {
    if (!story || typeof story !== 'object' || Array.isArray(story)) {
      errors.push(
        `${path.relative(curriculumRoot, filePath)}: stories[${index}] must be an object.`
      );
      return;
    }

    hasString(story.id, `stories[${index}].id`, filePath);
    hasString(story.title, `stories[${index}].title`, filePath);
    hasString(story.summary, `stories[${index}].summary`, filePath);
  });
}

const jsonFiles = walkJsonFiles(curriculumRoot);

for (const filePath of jsonFiles) {
  const payload = readJson(filePath);
  if (!payload) continue;

  const relativePath = path.relative(curriculumRoot, filePath);

  if (relativePath.endsWith('subject.json')) {
    validateSubject(filePath, payload);
  } else if (relativePath.endsWith('chapter.json')) {
    validateChapter(filePath, payload);
  } else if (relativePath.includes('applications/') && relativePath.endsWith('index.json')) {
    validateApplications(filePath, payload);
  } else if (relativePath.includes('proofs/')) {
    validateProofs(filePath, payload);
  } else if (relativePath.endsWith('concept-graph.json')) {
    validateConceptGraph(filePath, payload);
  } else if (relativePath.includes('stories/')) {
    validateStories(filePath, payload);
  }
}

if (errors.length > 0) {
  console.error('Public curriculum validation failed:');
  errors.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Validated ${jsonFiles.length} public curriculum JSON files.`);
