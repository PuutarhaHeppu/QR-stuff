import { exec } from 'child_process';

const files = ['order.js', 'table.js', 'v1.js'];

files.forEach(file => {
  exec(`node backend/${file}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Error in ${file}:`, err);
      return;
    }
    console.log(`Output of ${file}:\n`, stdout);
  });
});
