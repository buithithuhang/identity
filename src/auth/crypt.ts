import * as crypto from 'crypto';

export class Crypto {

    public static crypt = (text) => {
        let algorithm = 'aes-256-ctr';
        let secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
        let iv = "7436612439094238";

        const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return encrypted.toString('hex')

    };

    public static decrypt = (hash) => {

        let algorithm = 'aes-256-ctr';
        let secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
        let iv = "7436612439094238";
        const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

        const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);

        return decrpyted.toString();
    }

}