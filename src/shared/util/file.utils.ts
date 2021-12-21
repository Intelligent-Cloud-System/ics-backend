import * as path from 'path';

const getFileName = (filePath: string): string => {
  return path.basename(filePath);
};

export { getFileName };
