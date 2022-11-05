const { readdir, stat } = require('fs/promises');
const path = require('path');
const { stdout } = require('process');

const secretFolderPath = path.join(__dirname, 'secret-folder');

const showInformationAboutFile = async (pathToFolder, fileName) => {
  const fullPath = path.join(pathToFolder, fileName);
  const fileExt = path.extname(fullPath);
  const baseName = path.basename(fullPath, fileExt);
  const fileSize = (await stat(fullPath)).size;
  stdout.write(`${baseName} - ${fileExt.slice(1)} - ${fileSize}b\n`);
};

const showFilesStats = async (pathToFolder) => {
  const files = await readdir(pathToFolder, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile()) {
      showInformationAboutFile(pathToFolder, file.name);
    }
  }
};

showFilesStats(secretFolderPath);
