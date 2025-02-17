import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faWaveSquare,
    faFont,
    faKey,
    faTh,
} from "@fortawesome/free-solid-svg-icons";

const encryptionMethods = [
    { name: "Gartenzaun", icon: faWaveSquare },
    { name: "Cäsar", icon: faFont },
    { name: "Vigenere", icon: faKey },
    { name: "Polybios", icon: faTh },
];

const polybiosMatrix = [
    ["A", "B", "C", "D", "E"],
    ["F", "G", "H", "I", "K"],
    ["L", "M", "N", "O", "P"],
    ["Q", "R", "S", "T", "U"],
    ["V", "W", "X", "Y", "Z"],
];

function caesarCipher(text: string, shift: number) {
    return text.replace(/[a-z]/gi, (char) => {
        const start = char <= "Z" ? 65 : 97;
        const offset = (char.charCodeAt(0) - start + shift) % 26;
        return String.fromCharCode(
            offset < 0 ? offset + 26 + start : offset + start,
        );
    });
}

function railFenceCipherEncrypt(text: string, numRails: number) {
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

function railFenceCipherDecrypt(text: string, numRails: number) {
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

function bulkCaesarDecrypt(text: string) {
    const results = [];
    for (let shift = 1; shift < 26; shift++) {
        results.push(`Shift ${shift}: ${caesarCipher(text, -shift)}`);
    }
    return results.join("\n");
}

function bulkRailFenceDecrypt(text: string) {
    const results = [];
    for (let numRails = 2; numRails <= 10; numRails++) {
        results.push(`Rails ${numRails}: ${railFenceCipherDecrypt(text, numRails)}`);
    }
    return results.join("\n");
}

function vigenereCipherEncrypt(text: string, key: string) {
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

function vigenereCipherDecrypt(text: string, key: string) {
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

function polybiosEncrypt(text: string) {
    const matrix = polybiosMatrix;
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

function polybiosDecrypt(text: string) {
    const matrix = polybiosMatrix;
    return text.replace(/(\d\d)/g, (pair) => {
        const row = parseInt(pair[0]) - 1;
        const col = parseInt(pair[1]) - 1;
        return matrix[row][col];
    });
}

function App() {
    const [encryptionMethod, setEncryptionMethod] = useState(
        encryptionMethods[0].name,
    );
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [caesarShift, setCaesarShift] = useState(3);
    const [numRails, setNumRails] = useState(2);
    const [vigenereKey, setVigenereKey] = useState("");
    const [bulkDecryptResults, setBulkDecryptResults] = useState("");

    function handleEncrypt() {
        let result;
        switch (encryptionMethod) {
            case "Gartenzaun":
                result = railFenceCipherEncrypt(inputText, numRails);
                break;
            case "Cäsar":
                result = caesarCipher(inputText, caesarShift);
                break;
            case "Vigenere":
                result = vigenereCipherEncrypt(inputText, vigenereKey);
                break;
            case "Polybios":
                result = polybiosEncrypt(inputText);
                break;
            default:
                result = inputText;
        }
        setOutputText(result);
    }

    function handleDecrypt() {
        let result;
        switch (encryptionMethod) {
            case "Gartenzaun":
                result = railFenceCipherDecrypt(inputText, numRails);
                break;
            case "Cäsar":
                result = caesarCipher(inputText, -caesarShift);
                break;
            case "Vigenere":
                result = vigenereCipherDecrypt(inputText, vigenereKey);
                break;
            case "Polybios":
                result = polybiosDecrypt(inputText);
                break;
            default:
                result = inputText;
        }
        setOutputText(result);
    }

    function handleBulkDecrypt() {
        let results;
        switch (encryptionMethod) {
            case "Gartenzaun":
                results = bulkRailFenceDecrypt(inputText);
                break;
            case "Cäsar":
                results = bulkCaesarDecrypt(inputText);
                break;
            default:
                results = "Bulk decryption not available for this method.";
        }
        setBulkDecryptResults(results);
    }

    return (
        <main className="container mx-auto p-4 bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white rounded-lg">
            <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 p-4 bg-gray-900 rounded-l-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Select Encryption Method</h2>
                    <div className="flex flex-col space-y-2">
                        {encryptionMethods.map((method) => (
                            <button
                                key={method.name}
                                className={`py-2 px-4 rounded-lg shadow-md transition-colors duration-300 ${encryptionMethod === method.name ? "bg-gray-700" : "bg-gray-600 hover:bg-gray-700"}`}
                                onClick={() => setEncryptionMethod(method.name)}
                            >
                                <FontAwesomeIcon icon={method.icon} className="mr-2" />{" "}
                                {method.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="md:w-3/4 p-4 bg-gray-900 rounded-r-lg shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Encryption Method: {encryptionMethod}</h2>
                    <p className="mb-4">
                        Information about {encryptionMethod} encryption method.
                    </p>
                    {encryptionMethod === "Polybios" && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Polybios Matrix:</h3>
                            <pre className="bg-gray-800 p-2 rounded-lg">{JSON.stringify(polybiosMatrix, null, 2)}</pre>
                        </div>
                    )}
                    {encryptionMethod === "Cäsar" && (
                        <div className="flex items-center mb-4">
                            <label htmlFor="shift" className="mr-2">Shift:</label>
                            <select
                                id="shift"
                                value={caesarShift}
                                onChange={(e) =>
                                    setCaesarShift(parseInt(e.target.value))
                                }
                                className="p-2 bg-gray-800 rounded-lg"
                            >
                                {Array.from(
                                    { length: 25 },
                                    (_, i) => i + 1,
                                ).map((shift) => (
                                    <option key={shift} value={shift}>
                                        {shift}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {encryptionMethod === "Gartenzaun" && (
                        <div className="flex items-center mb-4">
                            <label htmlFor="rails" className="mr-2">Zäune/Rows:</label>
                            <select
                                id="rails"
                                value={numRails}
                                onChange={(e) =>
                                    setNumRails(parseInt(e.target.value))
                                }
                                className="p-2 bg-gray-800 rounded-lg"
                            >
                                {Array.from(
                                    { length: 10 },
                                    (_, i) => i + 2,
                                ).map((rails) => (
                                    <option key={rails} value={rails}>
                                        {rails}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    {encryptionMethod === "Vigenere" && (
                        <div className="flex items-center mb-4">
                            <label htmlFor="vigenere-key" className="mr-2">Key:</label>
                            <input
                                id="vigenere-key"
                                type="text"
                                value={vigenereKey}
                                onChange={(e) => setVigenereKey(e.target.value)}
                                className="p-2 bg-gray-800 rounded-lg"
                            />
                        </div>
                    )}
                    <div className="flex items-center mb-4">
                        <textarea
                            className="w-full p-2 bg-gray-800 rounded-lg"
                            placeholder="Enter text to encrypt/decrypt"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                        />
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="mx-2 text-white"
                        />
                        <textarea
                            className="w-full p-2 bg-gray-800 rounded-lg"
                            placeholder="Output"
                            value={outputText}
                            readOnly
                        />
                    </div>
                    <div className="flex justify-center space-x-2 mb-4">
                        <button onClick={handleEncrypt} className="py-2 px-4 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300">Encrypt</button>
                        <button onClick={handleDecrypt} className="py-2 px-4 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300">Decrypt</button>
                        {(encryptionMethod === "Gartenzaun" || encryptionMethod === "Cäsar") && (
                            <button onClick={handleBulkDecrypt} className="py-2 px-4 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600 transition-colors duration-300">Bulk Decrypt</button>
                        )}
                    </div>
                    {bulkDecryptResults && (
                        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                            <h3 className="text-lg font-semibold mb-2">Bulk Decrypt Results:</h3>
                            <pre className="whitespace-pre-wrap">{bulkDecryptResults}</pre>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default App;
