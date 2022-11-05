const fs = require('fs/promises');
const path = require('path');

const srcCSSFolder = path.join(__dirname, 'styles');
const destBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');

const createBundleCSS = async (srcCSSFolder, destBundleFile) => {
  let result = [];
  const srcFiles = await fs.readdir(srcCSSFolder, { withFileTypes: true });

  for (const srcFile of srcFiles) {
    if (srcFile.isFile() && path.extname(srcFile.name) === '.css') {
      result.push(await fs.readFile(path.join(srcCSSFolder, srcFile.name), 'utf-8'));
    }
  }

  fs.writeFile(destBundleFile, result.join('\n'));
};

createBundleCSS(srcCSSFolder, destBundleFile);
