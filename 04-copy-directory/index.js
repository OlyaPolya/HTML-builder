const fs = require('fs');
const path = require('path');
const copyFilePath = path.resolve(__dirname, 'files-copy');
const originalFilePath = path.resolve(__dirname, 'files');

async function copyDir() {
  await fs.promises.mkdir(copyFilePath, { recursive: true }, (err) => {
    if (err) throw err;
  });

  const filesInOriginalPath = await fs.promises.readdir(originalFilePath);

  filesInOriginalPath.forEach((file) => {
    fs.writeFile(path.join(copyFilePath, `${file.toString()}`), '', (err) => {
      if (err) throw err;
    });
    fs.readFile(path.join(originalFilePath, `${file.toString()}`), 'utf-8', (err, data) => {
      if (err) throw err;
      fs.appendFile(path.join(copyFilePath, `${file.toString()}`), `${data}`, (err) => {
        if (err) throw err;
      });
    });
  });

  const filesInCopyPath = await fs.promises.readdir(copyFilePath);

  filesInCopyPath.forEach((file) => {
    if (!filesInOriginalPath.includes(file)) {
      const pathOfNonexistentFile = path.resolve(__dirname, 'files-copy', `${file}`);
      fs.unlink(pathOfNonexistentFile, function (err) {
        if (err) throw err;
      });
    }
  });

  console.log('Папка files-copy готова. Содержимое папки files скопировано в папку files-copy ');
}

try {
  copyDir();
} catch (err) {
  console.error(err);
}
