const fs = require('fs/promises');
const { stdout } = require('process');
const path = require('path');

const buildHTML = async (templateFile, componentsFolder, destIndexHtml) => {
  let template = await fs.readFile(templateFile, 'utf-8');
  const componentsFiles = await fs.readdir(componentsFolder, { withFileTypes: true });

  for (const file of componentsFiles) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const filePath = path.join(componentsFolder, file.name);
      const fileData = await fs.readFile(filePath, 'utf-8');
      const extName = path.extname(file.name);
      const baseName = path.basename(file.name, extName);
      const reg = RegExp(`{{${baseName}}}`, 'gi');

      template = template.replace(reg, fileData);
    }
  }

  await fs.writeFile(destIndexHtml, template);
};

const buildCSS = async (srcCSSFolder, destBundleFile) => {
  let result = [];
  const srcFiles = await fs.readdir(srcCSSFolder, { withFileTypes: true });

  for (const srcFile of srcFiles) {
    if (srcFile.isFile() && path.extname(srcFile.name) === '.css') {
      result.push(await fs.readFile(path.join(srcCSSFolder, srcFile.name), 'utf-8'));
    }
  }

  await fs.writeFile(destBundleFile, result.join('\n'));
};

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

const buildPage = async () => {
  const projectDestFolder = path.join(__dirname, 'project-dist');

  const templateFile = path.join(__dirname, 'template.html');
  const destIndexHtml = path.join(projectDestFolder, 'index.html');
  const componentsFolder = path.join(__dirname, 'components');

  const destCSSFile = path.join(projectDestFolder, 'style.css');
  const srcCSSFolder = path.join(__dirname, 'styles');

  const srcAssets = path.join(__dirname, 'assets');
  const destAssets = path.join(projectDestFolder, 'assets');

  await fs.mkdir(projectDestFolder, { recursive: true });
  await buildHTML(templateFile, componentsFolder, destIndexHtml);
  await buildCSS(srcCSSFolder, destCSSFile);
  await copyDirectory(srcAssets, destAssets);
};

buildPage();
