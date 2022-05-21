const fs = require('fs');
const path = require('path');
const projectOutputPath = path.resolve(__dirname, 'project-dist');
const template = path.resolve(__dirname, 'template.html');
const assetsOriginalPath = path.resolve(__dirname, 'assets');
const assetsCopyPath = path.resolve(__dirname, 'project-dist', 'assets');
const components = path.resolve(__dirname, 'components');
const outputStyleFile = path.resolve(__dirname, 'project-dist', 'style.css');
const inputStyleFiles = path.resolve(__dirname, 'styles');

async function buildHtml() {
  await fs.promises.mkdir(projectOutputPath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const componentsFilePath = await fs.promises.readdir(components, (err) => {
    if (err) throw err;
  });
  let templateHtml = await fs.promises.readFile(template, 'utf-8', (err) => {
    if (err) throw err;
  });

  for (let componentFile of componentsFilePath) {
    const tagToReplace = `{{${componentFile.replace(/\..*/g, '')}}}`;
    const dataInComponent = await fs.promises.readFile(path.join(components, componentFile), 'utf-8', (err) => {
      if (err) throw err;
    });

    templateHtml = templateHtml.replace(tagToReplace, dataInComponent);
  }

  await fs.promises.writeFile(path.join(projectOutputPath, 'index.html'), templateHtml, 'utf-8');
}

async function mergeStyle() {
  await fs.promises.writeFile(outputStyleFile, '', 'utf-8');

  const filesInOriginalPath = await fs.promises.readdir(inputStyleFiles);

  filesInOriginalPath.forEach((file) => {
    if (file.split('.')[1] === 'css') {
      fs.readFile(path.join(inputStyleFiles, `${file.toString()}`), 'utf-8', (err, data) => {
        if (err) throw err;
        fs.appendFile(outputStyleFile, `${data}`, (err) => {
          if (err) throw err;
        });
      });
    }
  });
}

async function cleanAndFillAssetsFolder(assetsOriginalPath, assetsCopyPath) {
  await fs.promises.rm(assetsCopyPath, { force: true, recursive: true }, (err) => {
    if (err) throw err;
  });

  copyAssets(assetsOriginalPath, assetsCopyPath);
}

async function copyAssets(pathOriginal, pathCopy) {
  await fs.promises.mkdir(pathCopy, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const filesInOriginalAssets = await fs.promises.readdir(pathOriginal, (err) => {
    if (err) throw err;
  });

  for (let file of filesInOriginalAssets) {
    const folder = path.join(pathOriginal, file.toString());
    const folderToCopy = path.join(pathCopy, file.toString());
    const isDir = await fs.promises.stat(folder);

    if (isDir.isDirectory()) {
      await copyAssets(folder, folderToCopy);
    } else {
      await fs.promises.copyFile(folder, folderToCopy);
    }
  }
}

async function showFinishMessage() {
  console.log('Сборка HTML-страницы из компонентов и стилей выполнена');
}

try {
  buildHtml();
  mergeStyle();
  cleanAndFillAssetsFolder(assetsOriginalPath, assetsCopyPath);
  showFinishMessage();
} catch (err) {
  console.error(err);
}
