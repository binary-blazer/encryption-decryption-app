import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faWaveSquare,
    faFont,
    faKey,
    faTh,
    faPaw,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

const encryptionMethods = [
    { name: "Gartenzaun", icon: faWaveSquare },
    { name: "Cäsar", icon: faFont },
    { name: "Vigenere", icon: faKey },
    { name: "Polybios", icon: faTh },
    { name: "Tapir", icon: faPaw },
];

function generatePolybiosMatrix(key: string) {
    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    const keyUpper = key.toUpperCase().replace(/J/g, "I");
    const uniqueKey = Array.from(new Set(keyUpper + alphabet)).join("");
    const matrix = [];
    for (let i = 0; i < 5; i++) {
        matrix.push(uniqueKey.slice(i * 5, i * 5 + 5).split(""));
    }
    return matrix;
}

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
        results.push(
            `Rails ${numRails}: ${railFenceCipherDecrypt(text, numRails)}`,
        );
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

function polybiosEncrypt(text: string, matrix: string[][]) {
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

function polybiosDecrypt(text: string, matrix: string[][]) {
    return text.replace(/(\d\d)/g, (pair) => {
        const row = parseInt(pair[0]) - 1;
        const col = parseInt(pair[1]) - 1;
        return matrix[row][col];
    });
}

const tapirTable = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '!', '"', '#', '$', '%', '&', "'", '(', ')', '*', '+', ',', '-', '.', '/',
    ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'
];

function tapirEncrypt(text: string, key: string) {
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

function tapirDecrypt(text: string, key: string) {
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

function App() {
    const [encryptionMethod, setEncryptionMethod] = useState(
        encryptionMethods[0].name,
    );
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [caesarShift, setCaesarShift] = useState(3);
    const [numRails, setNumRails] = useState(2);
    const [vigenereKey, setVigenereKey] = useState("");
    const [polybiosKey, setPolybiosKey] = useState("");
    const [tapirKey, setTapirKey] = useState("");
    const [bulkDecryptResults, setBulkDecryptResults] = useState("");

    function clearAll() {
        setInputText("");
        setOutputText("");
        setCaesarShift(3);
        setNumRails(2);
        setVigenereKey("");
        setPolybiosKey("");
        setTapirKey("");
        setBulkDecryptResults("");
    }

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
                const polybiosMatrix = generatePolybiosMatrix(polybiosKey);
                result = polybiosEncrypt(inputText, polybiosMatrix);
                break;
            case "Tapir":
                result = tapirEncrypt(inputText, tapirKey);
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
                const polybiosMatrix = generatePolybiosMatrix(polybiosKey);
                result = polybiosDecrypt(inputText, polybiosMatrix);
                break;
            case "Tapir":
                result = tapirDecrypt(inputText, tapirKey);
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
        <main className="container">
            <div className="flex-row">
                <div className="column sidebar">
                    <h2>Select Encryption Method</h2>
                    <div className="tabs">
                        {encryptionMethods.map((method) => (
                            <button
                                key={method.name}
                                className={`tab ${encryptionMethod === method.name ? "active" : ""}`}
                                onClick={() => setEncryptionMethod(method.name)}
                            >
                                <FontAwesomeIcon icon={method.icon} />{" "}
                                {method.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="column content">
                    <h2>Encryption Method: {encryptionMethod}</h2>
                    <AnimatePresence>
                        {encryptionMethod === "Polybios" && (
                            <motion.div
                                key="Polybios"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <h3>Polybios Matrix:</h3>
                                {generatePolybiosMatrix(polybiosKey).map(
                                    (row, i) => (
                                        <div key={i} className="polybios-row">
                                            {row.map((char, j) => (
                                                <div
                                                    key={j}
                                                    className="polybios-cell"
                                                >
                                                    {char}
                                                </div>
                                            ))}
                                        </div>
                                    ),
                                )}
                                <div className="polybios-key-selector">
                                    <label htmlFor="polybios-key">Key:</label>
                                    <input
                                        id="polybios-key"
                                        type="text"
                                        value={polybiosKey}
                                        onChange={(e) =>
                                            setPolybiosKey(e.target.value)
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}
                        {encryptionMethod === "Cäsar" && (
                            <motion.div
                                key="Cäsar"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="shift-selector">
                                    <label htmlFor="shift">Shift:</label>
                                    <select
                                        id="shift"
                                        value={caesarShift}
                                        onChange={(e) =>
                                            setCaesarShift(
                                                parseInt(e.target.value),
                                            )
                                        }
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
                            </motion.div>
                        )}
                        {encryptionMethod === "Gartenzaun" && (
                            <motion.div
                                key="Gartenzaun"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="shift-selector">
                                    <label htmlFor="rails">Zäune/Rows:</label>
                                    <select
                                        id="rails"
                                        value={numRails}
                                        onChange={(e) =>
                                            setNumRails(
                                                parseInt(e.target.value),
                                            )
                                        }
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
                            </motion.div>
                        )}
                        {encryptionMethod === "Vigenere" && (
                            <motion.div
                                key="Vigenere"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="vigenere-key-selector">
                                    <label htmlFor="vigenere-key">Key:</label>
                                    <input
                                        id="vigenere-key"
                                        type="text"
                                        value={vigenereKey}
                                        onChange={(e) =>
                                            setVigenereKey(e.target.value)
                                        }
                                    />
                                </div>
                            </motion.div>
                        )}
                        {encryptionMethod === "Tapir" && (
                            <motion.div
                                key="Tapir"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="vigenere-key-selector">
                                    <label htmlFor="tapir-key">Key:</label>
                                    <input
                                        id="tapir-key"
                                        type="text"
                                        value={tapirKey}
                                        onChange={(e) => setTapirKey(e.target.value)}
                                    />
                                </div>
                            </motion.div>
                        )}
                        <motion.div
                            key="InputOutput"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="input-output-container"
                        >
                            <textarea
                                className="input-text"
                                placeholder="Enter text to encrypt/decrypt"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <FontAwesomeIcon
                                icon={faArrowRight}
                                className="arrow-icon"
                            />
                            <textarea
                                className="output-text"
                                placeholder="Output"
                                value={outputText}
                                readOnly
                            />
                        </motion.div>
                        <motion.div
                            key="Buttons"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="button-container"
                        >
                            <motion.button
                                onClick={handleEncrypt}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Encrypt
                            </motion.button>
                            <motion.button
                                onClick={handleDecrypt}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Decrypt
                            </motion.button>
                            {(encryptionMethod === "Gartenzaun" ||
                                encryptionMethod === "Cäsar") && (
                                <motion.button
                                    onClick={handleBulkDecrypt}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    Bulk Decrypt
                                </motion.button>
                            )}
                            <motion.button
                                onClick={clearAll}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                Clear All
                            </motion.button>
                        </motion.div>
                        {bulkDecryptResults && (
                            <motion.div
                                key="BulkDecryptResults"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bulk-decrypt-results"
                            >
                                <h3>Bulk Decrypt Results:</h3>
                                <pre>{bulkDecryptResults}</pre>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}

export default App;
