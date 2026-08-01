const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');

const schemaPath = process.argv[2] || path.join(__dirname, '../../schemas/curriculum-v1.json');
const curriculumDir = process.argv[3] || path.join(__dirname, '../../curriculum');

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const validateSubject = ajv.compile({
  ...schema.definitions.subject,
  definitions: schema.definitions,
});
const validateChapter = ajv.compile({
  ...schema.definitions.chapter,
  definitions: schema.definitions,
});
const validatePedagogyBlock = ajv.compile({
  ...schema.definitions.pedagogyBlock,
  definitions: schema.definitions,
});

function blockSignature(block) {
  return JSON.stringify({
    type: block.type,
    title: block.title ?? null,
    content: block.content,
  });
}

function validateFile(filePath, validator) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const valid = validator(data);
  if (!valid) {
    console.error(`Validation failed for ${filePath}:`);
    console.error(validator.errors);
    return false;
  }
  return true;
}

function findFiles(dir, name) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findFiles(fullPath, name));
    } else if (entry.name === name) {
      files.push(fullPath);
    }
  }
  return files;
}

function validatePedagogyLibraries(curriculumRoot, chapterFiles) {
  const pedagogyDir = path.join(curriculumRoot, 'pedagogy');
  if (!fs.existsSync(pedagogyDir)) {
    console.error(`Missing pedagogy library directory: ${pedagogyDir}`);
    return false;
  }

  const libraryFiles = fs
    .readdirSync(pedagogyDir)
    .filter((fileName) => fileName.endsWith('.json'))
    .map((fileName) => path.join(pedagogyDir, fileName));

  if (libraryFiles.length === 0) {
    console.error('No pedagogy library JSON files found.');
    return false;
  }

  let valid = true;
  const librarySignatures = new Set();
  let blockCount = 0;

  for (const filePath of libraryFiles) {
    const payload = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!Array.isArray(payload.blocks)) {
      console.error(`Pedagogy library ${filePath} must contain a blocks array.`);
      valid = false;
      continue;
    }

    for (const block of payload.blocks) {
      if (!validatePedagogyBlock(block)) {
        console.error(`Pedagogy block validation failed in ${filePath}:`);
        console.error(validatePedagogyBlock.errors);
        valid = false;
        continue;
      }
      librarySignatures.add(blockSignature(block));
      blockCount += 1;
    }
  }

  if (blockCount < 20) {
    console.error(`Pedagogy library must include at least 20 blocks, found ${blockCount}.`);
    valid = false;
  }

  // MVP lessons are arithmetic + algebra lessons.
  const mvpChapterFiles = chapterFiles.filter(
    (filePath) => filePath.includes(`${path.sep}arithmetic${path.sep}`) || filePath.includes(`${path.sep}algebra${path.sep}`)
  );

  for (const chapterFile of mvpChapterFiles) {
    const chapter = JSON.parse(fs.readFileSync(chapterFile, 'utf8'));
    for (const lesson of chapter.lessons ?? []) {
      const lessonBlocks = Array.isArray(lesson.pedagogy) ? lesson.pedagogy : [];
      const hasLibraryBlock = lessonBlocks.some((block) => librarySignatures.has(blockSignature(block)));
      if (!hasLibraryBlock) {
        console.error(
          `Lesson ${lesson.id} in ${chapterFile} does not reference any block from curriculum/pedagogy/*.json.`
        );
        valid = false;
      }
    }
  }

  return valid;
}

const chapterFiles = findFiles(curriculumDir, 'chapter.json');
const subjectFiles = findFiles(curriculumDir, 'subject.json');
let allValid = true;

for (const file of chapterFiles) {
  if (!validateFile(file, validateChapter)) {
    allValid = false;
  }
}

for (const file of subjectFiles) {
  if (!validateFile(file, validateSubject)) {
    allValid = false;
  }
}

if (!validatePedagogyLibraries(curriculumDir, chapterFiles)) {
  allValid = false;
}

if (allValid) {
  console.log(`All ${chapterFiles.length} chapters, ${subjectFiles.length} subjects, and pedagogy libraries passed validation.`);
  process.exit(0);
} else {
  console.error('Some curriculum files failed validation.');
  process.exit(1);
}
