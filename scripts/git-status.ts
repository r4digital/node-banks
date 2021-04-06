import { execSync } from 'child_process';

const TARGET = 'M src/data.json';
const result = execSync('git status --porcelain -b');
const lines = result.toString()
  .trim()
  .split('\n')
  .map((line) => line.trim());
const has_content = lines.find((line) => line === TARGET);

if (!has_content) {
  process.exit(0);
}

console.info(execSync('npm version minor -f').toString());
const { version } = require('../package.json');
try {
  console.info(execSync('git config user.name github-actions').toString());
  console.info(execSync('git config user.email github-actions@github.com').toString());
  console.info(execSync('npm install').toString());
  console.info(execSync('git add .').toString());
  console.info(execSync('git status').toString());
  console.info(execSync('git commit -m "update src/data.json"').toString());
  console.info(execSync('git push').toString());
  console.info(execSync(`git tag -a ${version} -m "v${version}"`).toString());
  console.info(execSync(`git push origin ${version}`).toString());
  console.info(execSync('git push').toString());
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
