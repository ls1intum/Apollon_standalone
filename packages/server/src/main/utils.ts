const alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function randomString(length: number) {
  let result = "";
  for (let i = length; i > 0; --i) result += alphabet[Math.floor(Math.random() * alphabet.length)];
  return result;
}
