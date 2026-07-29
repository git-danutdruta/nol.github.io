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

if (allValid) {
  console.log(`All ${chapterFiles.length} chapters and ${subjectFiles.length} subjects passed validation.`);
  process.exit(0);
} else {
  console.error('Some curriculum files failed validation.');
  process.exit(1);
}
