import * as path from 'path';

const getFileName = (filePath: string): string => {
  return path.basename(filePath);
};

const checkForUpwardDir = (filePath: string): boolean => {
  return path.normalize(filePath).startsWith('..');
};

export { getFileName, checkForUpwardDir };
