import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowRight,
    faWaveSquare,
    faFont,
    faKey,
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";

const encryptionMethods = [
    { name: "Gartenzaun", icon: faWaveSquare },
    { name: "Cäsar", icon: faFont },
    { name: "Vigenere", icon: faKey },
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

function App() {
    const [encryptionMethod, setEncryptionMethod] = useState(
        encryptionMethods[0].name,
    );
    const [inputText, setInputText] = useState("");
    const [outputText, setOutputText] = useState("");
    const [caesarShift, setCaesarShift] = useState(3);
    const [numRails, setNumRails] = useState(2);
    const [vigenereKey, setVigenereKey] = useState("");

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
            default:
                result = inputText;
        }
        setOutputText(result);
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
                    <p>
                        Information about {encryptionMethod} encryption method.
                    </p>
                    {encryptionMethod === "Cäsar" && (
                        <div className="shift-selector">
                            <label htmlFor="shift">Shift:</label>
                            <select
                                id="shift"
                                value={caesarShift}
                                onChange={(e) =>
                                    setCaesarShift(parseInt(e.target.value))
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
                    )}
                    {encryptionMethod === "Gartenzaun" && (
                        <div className="shift-selector">
                            <label htmlFor="rails">Zäune/Rows:</label>
                            <select
                                id="rails"
                                value={numRails}
                                onChange={(e) =>
                                    setNumRails(parseInt(e.target.value))
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
                    )}
                    {encryptionMethod === "Vigenere" && (
                        <div className="vigenere-key-selector">
                            <label htmlFor="vigenere-key">Key:</label>
                            <input
                                id="vigenere-key"
                                type="text"
                                value={vigenereKey}
                                onChange={(e) => setVigenereKey(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="input-output-container">
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
                    </div>
                    <div className="button-container">
                        <button onClick={handleEncrypt}>Encrypt</button>
                        <button onClick={handleDecrypt}>Decrypt</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
