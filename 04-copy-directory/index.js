const fs = require('fs/promises');
const { stdout } = require('process');
const path = require('path');

const folderSrc = path.join(__dirname, 'files');
const folderDest = path.join(__dirname, 'files-copy');

const copyDirectory = async (folderSrc, folderDest) => {
  await fs.mkdir(folderDest, { recursive: true });
  const srcFiles = await fs.readdir(folderSrc, { withFileTypes: true });
  const destFiles = await fs.readdir(folderDest, { withFileTypes: true });

  for (const file of destFiles) {
    try {
      await fs.rm(path.join(folderDest, file.name), { recursive: true });
    } catch (err) {
      stdout.write(`Error ${err}`);
    }
  }

  for (const file of srcFiles) {
    if (file.isDirectory()) {
      await copyDirectory(path.join(folderSrc, file.name), path.join(folderDest, file.name));
    } else if (file.isFile()) {
      try {
        await fs.copyFile(path.join(folderSrc, file.name), path.join(folderDest, file.name));
      } catch (err) {
        stdout.write(`Error ${err}`);
      }
    }
  }
};

copyDirectory(folderSrc, folderDest);
