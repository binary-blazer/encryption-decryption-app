export function generatePolybiosMatrix(key: string) {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const keyUpper = key.toUpperCase().replace(/J/g, "I");
    const uniqueKey = Array.from(new Set(keyUpper + alphabet)).join("");
    const matrix = [];
    for (let i = 0; i < 5; i++) {
        matrix.push(uniqueKey.slice(i * 5, i * 5 + 5).split(""));
    }
    return matrix;
}

export function caesarCipher(text: string, shift: number) {
    return text.replace(/[a-z]/gi, (char) => {
        const start = char <= "Z" ? 65 : 97;
        const offset = (char.charCodeAt(0) - start + shift) % 26;
        return String.fromCharCode(
            offset < 0 ? offset + 26 + start : offset + start,
        );
    });
}

export function railFenceCipherEncrypt(text: string, numRails: number) {
    if (numRails === 1) return text;
    const rail: string[][] = Array.from({ length: numRails }, () => []);
    const textArray = text.split("");
    let railIndex = 0;
    let direction = 1;
    for (const char of textArray) {
        rail[railIndex].push(char);
        railIndex += direction;
        if (railIndex === 0 || railIndex === numRails - 1) direction *= -1;
    }
    return rail.flat().join("");
}

export function railFenceCipherDecrypt(text: string, numRails: number) {
    if (numRails === 1) return text;
    const rail: string[][] = Array.from({ length: numRails }, () => []);
    const len = text.length;
    let railIndex = 0;
    let direction = 1;
    const railLengths = Array(numRails).fill(0);
    for (let i = 0; i < len; i++) {
        railLengths[railIndex]++;
        railIndex += direction;
        if (railIndex === 0 || railIndex === numRails - 1) direction *= -1;
    }
    let index = 0;
    for (let i = 0; i < numRails; i++) {
        for (let j = 0; j < railLengths[i]; j++) {
            rail[i].push(text[index++]);
        }
    }
    railIndex = 0;
    direction = 1;
    let result = "";
    for (let i = 0; i < len; i++) {
        result += rail[railIndex].shift();
        railIndex += direction;
        if (railIndex === 0 || railIndex === numRails - 1) direction *= -1;
    }
    return result;
}

export function bulkCaesarDecrypt(text: string) {
    const results = [];
    for (let shift = 1; shift < 26; shift++) {
        results.push(`Shift ${shift}: ${caesarCipher(text, -shift)}`);
    }
    return results.join("\n");
}

export function bulkRailFenceDecrypt(text: string) {
    const results = [];
    for (let numRails = 2; numRails <= 10; numRails++) {
        results.push(
            `Rails ${numRails}: ${railFenceCipherDecrypt(text, numRails)}`,
        );
    }
    return results.join("\n");
}

export function vigenereCipherEncrypt(text: string, key: string) {
    let result = "";
    for (let i = 0, j = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const start = char <= "Z" ? 65 : 97;
            const keyChar = key[j % key.length].toUpperCase();
            const shift = keyChar.charCodeAt(0) - 65;
            result += String.fromCharCode(
                ((char.charCodeAt(0) - start + shift) % 26) + start,
            );
            j++;
        } else {
            result += char;
        }
    }
    return result;
}

export function vigenereCipherDecrypt(text: string, key: string) {
    let result = "";
    for (let i = 0, j = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[a-z]/i)) {
            const start = char <= "Z" ? 65 : 97;
            const keyChar = key[j % key.length].toUpperCase();
            const shift = keyChar.charCodeAt(0) - 65;
            result += String.fromCharCode(
                ((char.charCodeAt(0) - start - shift + 26) % 26) + start,
            );
            j++;
        } else {
            result += char;
        }
    }
    return result;
}

export function polybiosEncrypt(text: string, matrix: string[][]) {
    return text.toUpperCase().replace(/[A-Z]/g, (char) => {
        if (char === "J") char = "I";
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === char) {
                    return `${i + 1}${j + 1}`;
                }
            }
        }
        return char;
    });
}

export function polybiosDecrypt(text: string, matrix: string[][]) {
    return text.replace(/(\d\d)/g, (pair) => {
        const row = parseInt(pair[0]) - 1;
        const col = parseInt(pair[1]) - 1;
        return matrix[row][col];
    });
}

const tapirTable = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
    ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'
];

export function tapirEncrypt(text: string, key: string) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charIndex = tapirTable.indexOf(text[i]);
        const keyIndex = tapirTable.indexOf(key[i % key.length]);
        if (charIndex === -1 || keyIndex === -1) {
            result += text[i];
        } else {
            result += tapirTable[(charIndex + keyIndex) % tapirTable.length];
        }
    }
    return result;
}

export function tapirDecrypt(text: string, key: string) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        const charIndex = tapirTable.indexOf(text[i]);
        const keyIndex = tapirTable.indexOf(key[i % key.length]);
        if (charIndex === -1 || keyIndex === -1) {
            result += text[i];
        } else {
            result += tapirTable[(charIndex - keyIndex + tapirTable.length) % tapirTable.length];
        }
    }
    return result;
}
