import _ from 'lodash';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const buildDiff = (obj1, obj2) => {
  const unionKeys = _.sortBy(_.union(_.keys(obj1), _.keys(obj2)));

  const lines = unionKeys.reduce((acc, key) => {
    if (!_.has(obj1, key)) {
      const value = obj2[key];
      const str = `+ ${key}: ${value}`;
      return [...acc, str];
    }

    if (!_.has(obj2, key)) {
      const value = obj1[key];
      const str = `- ${key}: ${value}`;
      return [...acc, str];
    }

    const value1 = obj1[key];
    const value2 = obj2[key];

    if (value1 !== value2) {
      const removed = `- ${key}: ${value1}`;
      const added = `+ ${key}: ${value2}`;
      return [...acc, removed, added];
    }

    return [...acc, `${key}: ${value1}`];
  }, []);

  return lines.join('\n');
};

const genDiff = (filepath1, filepath2) => {
  const cwd = process.cwd();

  const path1 = path.resolve(cwd, filepath1);
  const path2 = path.resolve(cwd, filepath2);

  const data1 = fs.readFileSync(path1);
  const data2 = fs.readFileSync(path2);

  const json1 = JSON.parse(data1);
  const json2 = JSON.parse(data2);

  const diff = buildDiff(json1, json2);

  return diff;
};

export default genDiff;
