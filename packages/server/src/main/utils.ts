const crypto = require("crypto");
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function randomString(length: number) {
  let result = '';
  for (let i = length; i > 0; --i) result += alphabet[crypto.randomInt(0,alphabet.length)];
  return result;
}
