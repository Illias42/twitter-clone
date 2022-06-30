import crypto from "crypto";
export default function createHash(password, salt) {
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash;
}
