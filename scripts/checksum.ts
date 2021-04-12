import crypto from 'crypto';
import fs, { PathLike } from 'fs';

export function generateFromFile(file: PathLike) {
  const data: string = fs.readFileSync(file)
    .toString('utf-8')
    .trim();
    return generate(data);
}

export function generate(str: string, algorithm = 'md5', encoding: BufferEncoding = 'hex'): string {
    return crypto
        .createHash(algorithm)
        .update(str.trim(), 'utf8')
        .digest()
        .toString(encoding);
};

export default {
  generate,
  generateFromFile,
};
