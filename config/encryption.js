const crypto = require('crypto');
const fs = require('fs');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
exports.encryptFile = (inputPath, outputPath) => {
const cipher = crypto.createCipheriv(algorithm, key, iv);
const input = fs.createReadStream(inputPath);
const output = fs.createWriteStream(outputPath);
input.pipe(cipher).pipe(output);
};
exports.decryptFile = (inputPath, outputPath) => {
const decipher = crypto.createDecipheriv(algorithm, key, iv);
const input = fs.createReadStream(inputPath);
const output = fs.createWriteStream(outputPath);
input.pipe(decipher).pipe(output);
};
