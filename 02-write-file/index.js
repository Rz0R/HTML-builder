const fs = require('fs/promises');
const path = require('path');
const { stdout, stdin } = require('process');
const process = require('process');

const pathToTextFile = path.join(__dirname, 'text.txt');

const showExitMessage = () => {
  stdout.write('The session is over, goodbye!\n');
  process.exit();
};

fs.writeFile(pathToTextFile, '', (err) => {
  if (err) {
    throw err;
  }
});

stdout.write('Welcome, enter your text, please:\n');

stdin.on('data', (data) => {
  data = data.toString();
  if (data.trim() === 'exit') {
    showExitMessage();
  }

  fs.appendFile(pathToTextFile, data, (err) => {
    if (err) {
      throw err;
    }
  });
});

process.on('SIGINT', () => {
  showExitMessage();
});
