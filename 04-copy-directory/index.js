const fs = require('fs');
const path = require('path');
const copyFilePath = path.resolve(__dirname, 'files-copy');
const originalFilePath = path.resolve(__dirname, 'files');

async function cleanAndFillAssetsFolder(originalFilePath, copyFilePath) {
  await fs.promises.rm(copyFilePath, { force: true, recursive: true }, (err) => {
    if (err) throw err;
  });

  copyDir(originalFilePath, copyFilePath);
}

async function copyDir(originalFilePath, copyFilePath) {
  await fs.promises.mkdir(copyFilePath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const filesInOriginalPath = await fs.promises.readdir(originalFilePath, (err) => {
    if (err) throw err;
  });

  for (let file of filesInOriginalPath) {
    const folder = path.join(originalFilePath, file.toString());
    const folderToCopy = path.join(copyFilePath, file.toString());
    const isDir = await fs.promises.stat(folder);

    if (isDir.isDirectory()) {
      await copyDir(folder, folderToCopy);
    } else {
      await fs.promises.copyFile(folder, folderToCopy);
    }
  }
}

async function showFinishMessage() {
  console.log('Копирование завершено');
}

try {
  cleanAndFillAssetsFolder(originalFilePath, copyFilePath);
  showFinishMessage();
} catch (err) {
  console.error(err);
}