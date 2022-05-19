const fs = require('fs');
const path = require('path');
const filePath = path.resolve(__dirname, 'secret-folder');

async function myReadDir(filePath) {
  const files = await fs.promises.readdir(filePath, { withFileTypes: true }, (err) => {
    if (err) throw err;
  });
  files.forEach((file) => {
    if (!file.isDirectory()) {
      const fileInFolder = path.resolve(__dirname, 'secret-folder', `${file.name.toString()}`);
      fs.stat(fileInFolder, (err, stats) => {
        if (err) throw err;
        const fileName = file.name.split('.')[0];
        const fileType = file.name.split('.')[1];
        const fileSize = (stats.size / 1024).toFixed(3);
        console.log(`${fileName} - ${fileType} - ${fileSize}kb`);
      });
      
    }
  });
}

try {
  myReadDir(filePath);
} catch (err) {
  console.error(err);
}
