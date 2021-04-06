import { execSync } from 'child_process';

const TARGET = 'M src/data.json';
const result = execSync('git status --porcelain -b');
const lines = result.toString()
  .trim()
  .split('\n')
  .map((line) => line.trim());
const has_content = !!lines.filter((line) => line === TARGET);

if (!has_content) {
  process.exit(0);
}

execSync('npm version minor');
const { version } = require('../package.json');

execSync('npm install');
execSync('git add .');
execSync('git status');
execSync('git commit -m "update src/data.json"');
execSync('git push');
execSync(`git tag -a ${version} -m "v${version}"`);
execSync(`git push origin ${version}`);
execSync('git push');

process.exit(0);
