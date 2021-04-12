import { execSync } from 'child_process';
import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import checksum from './checksum';

const hash_location = join(__dirname, '..', 'src', 'data.checksum');
const file_location = join(__dirname, '..', 'src', 'data.json');
const current_hash = readFileSync(hash_location).toString('utf-8').trim();
const new_hash = checksum.generateFromFile(file_location);
const has_same_hash = current_hash === new_hash;

console.log('current_hash', current_hash);
console.log('new_hash', new_hash);

if (has_same_hash) {
  process.exit(0);
}

execSync('git config --global user.name henrique502');
execSync('git config --global user.email henrique.rieger@gmail.com');

console.info(execSync('npm version minor -f').toString());
const { version } = require('../package.json');
try {
  writeFileSync(hash_location, new_hash);
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
