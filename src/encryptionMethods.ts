// Caeser encryption methods
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

// Rail Fence encryption methods
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

// Bulk encryption methods
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

// Vigenere encryption method
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

// Polybios encryption method
export function polybiosEncrypt(text: string, matrix: string[][]) {
    return text.toUpperCase().replace(/[A-Z\s]/g, (char) => {
        if (char === " ") return " ";
        if (char === "J") char = "I";
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] === char) {
                    return `${i + 1}${j + 1}`;
                }
            }
        }
        return char;
    }).match(/.{1,2}|\s/g)?.join(" ") || "";
}

export function polybiosDecrypt(text: string, matrix: string[][]) {
    let addSpace = false;
    return text.replace(/(\d\d|\d \d|\s)/g, (pair) => {
        if (pair.trim() === "") {
            addSpace = true;
            return "";
        }
        const cleanedPair = pair.replace(" ", "");
        const row = parseInt(cleanedPair[0]) - 1;
        const col = parseInt(cleanedPair[1]) - 1;
        const char = matrix[row][col];
        if (addSpace) {
            addSpace = false;
            return " " + char;
        }
        return char;
    }).replace(/\s+/g, '');
}

// Tapir encryption method
const tapirEncoding: Record<string, string> = {
    "A": "0", "B": "50", "BE": "51", "C": "52", "CH": "53", "D": "54", "DE": "55",
    "E": "1", "F": "56", "G": "57", "GE": "58", "H": "59", "I": "2", "J": "60",
    "K": "61", "L": "62", "M": "63", "N": "3", "O": "64", "P": "67", "Q": "68",
    "R": "4", "S": "69", "T": "70", "TE": "71", "U": "72", "UN": "73", "V": "74",
    "W": "76", "X": "77", "Y": "78", "Z": "79", "Zi": "82", "ZwR": "83", "Ä": "66",
    "ß": "65", "0": "00", "1": "11", "2": "22", "3": "33", "4": "44", "5": "55",
    "6": "66", "7": "77", "8": "88", "9": "99", ".": "89", ":": "90", ",": "91",
    "-": "92", "/": "93", "(": "94", ")": "95", "+": "96", "=": "97", "\"": "98",
    "Leerzeichen": "83"
};

const tapirDecoding: Record<string, string> = Object.fromEntries(
    Object.entries(tapirEncoding).map(([key, value]) => [value, key])
);

export function tapirEncrypt(text: string): string {
    return text.toUpperCase().split("").map(char => {
        if (char === " ") return tapirEncoding["Leerzeichen"];
        return tapirEncoding[char] || "?";
    }).join(" ");
}

export function tapirDecrypt(code: string): string {
    return code.split(" ").map(part => {
        if (part === tapirEncoding["Leerzeichen"]) return " ";
        return tapirDecoding[part] || "?";
    }).join("");
}
