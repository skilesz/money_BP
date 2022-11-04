const fs = require('fs');
const content = "";

// Open money file
fs.readFile('money.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
});