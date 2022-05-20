const fs = require('fs');
const path = require('path');
const outputFile = path.resolve(__dirname, 'project-dist', 'bundle.css');
const inputFiles = path.resolve(__dirname, 'styles');

async function mergeStyle() {
  fs.writeFile(outputFile, '', (err) => {
    if (err) throw err;
  });

  const filesInOriginalPath = await fs.promises.readdir(inputFiles);

  filesInOriginalPath.forEach((file) => {
    if (file.split('.')[1] === 'css') {
      fs.readFile(path.join(inputFiles, `${file.toString()}`), 'utf-8', (err, data) => {
        if (err) throw err;
        fs.appendFile(outputFile, `${data}`, (err) => {
          if (err) throw err;
        });
      });
    }
  });

  console.log('Сборка завершена. Файл bundle.css собран');
}

try {
  mergeStyle();
} catch (err) {
  console.error(err);
}
