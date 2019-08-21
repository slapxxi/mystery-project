import fs from 'fs';
import keys from 'lodash/keys';
import path from 'path';

const localesPath = path.join(__dirname, '../static/locales');
const enLocalesPath = path.join(localesPath, 'en');
const ruLocalesPath = path.join(localesPath, 'ru');

test('locales folder contains required subdirs', () => {
  let dirs = fs
    .readdirSync(localesPath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  expect(dirs).toContain('en');
  expect(dirs).toContain('ru');
});

test('common locales contain the same keys', () => {
  let enKeys = getKeys(path.join(enLocalesPath, 'common.json'));
  let ruKeys = getKeys(path.join(ruLocalesPath, 'common.json'));

  expect(enKeys).toEqual(ruKeys);
});

test('header locales contain the same keys', () => {
  let enKeys = getKeys(path.join(enLocalesPath, 'header.json'));
  let ruKeys = getKeys(path.join(ruLocalesPath, 'header.json'));

  expect(enKeys).toEqual(ruKeys);
});

function getKeys(path: string) {
  let content = fs.readFileSync(path, { encoding: 'utf-8' });
  content = JSON.parse(content);
  return keys(content).sort();
}
