import CryptoJS from 'crypto-js'



export function encryptPassword(plainPassword) {

    const secretKey = 'c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7e';

    // Match PHP's binary hash key



    const key = CryptoJS.enc.Latin1.parse(

        CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Latin1)

    )



    // PHP IV is a 16-character *string* (not hex)



    const ivString = CryptoJS.SHA256(secretKey).toString().substring(0, 16)



    const iv = CryptoJS.enc.Latin1.parse(ivString) // treat as string, not hex



    const encrypted = CryptoJS.AES.encrypt(plainPassword, key, {

        iv: iv,



        mode: CryptoJS.mode.CBC,



        padding: CryptoJS.pad.Pkcs7,

    })



    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext)

}


export function decryptPassword(encryptedPassword) {

    const secretKey = 'c2ec6f788fb85720bf48c8cc7c2db572596c585a15df18583e1234f147b1c2897aad12e7bebbc4c03c765d0e878427ba6370439d38f39340d7e'
    try {

        // Generate the same key and IV as encryption

        const key = CryptoJS.enc.Latin1.parse(

            CryptoJS.SHA256(secretKey).toString(CryptoJS.enc.Latin1)

        )



        const ivString = CryptoJS.SHA256(secretKey).toString().substring(0, 16)

        const iv = CryptoJS.enc.Latin1.parse(ivString)



        // Decrypt the base64 encoded ciphertext

        const ciphertext = CryptoJS.enc.Base64.parse(encryptedPassword)



        const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext }, key, {

            iv: iv,

            mode: CryptoJS.mode.CBC,

            padding: CryptoJS.pad.Pkcs7,

        })



        return decrypted.toString(CryptoJS.enc.Utf8)

    } catch (error) {

        return 'Decryption failed'

    }

}