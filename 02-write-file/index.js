const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.resolve(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

function createFile() {
  fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
    if (err) throw err;
  });
}

function create() {
  createFile();
  stdout.write('Пожалуйста, введите текст?\n');
  stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
      console.log('Вы нажали exit. Всего доброго!');
      process.exit();
    }

    process.on('SIGINT', function () {
      console.log('Вы нажали Ctrl+C. Хорошего дня!');
      process.exit();
    });

    writeStream.write(data);
  });
}

create();
