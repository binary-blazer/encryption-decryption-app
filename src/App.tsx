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
import {
    caesarCipher,
    railFenceCipherEncrypt,
    railFenceCipherDecrypt,
    bulkCaesarDecrypt,
    bulkRailFenceDecrypt,
    vigenereCipherEncrypt,
    vigenereCipherDecrypt,
    polybiosEncrypt,
    polybiosDecrypt,
    generatePolybiosMatrix,
    tapirEncrypt,
    tapirDecrypt,
} from "./encryptionMethods";

const encryptionMethods = [
    { name: "Gartenzaun", icon: faWaveSquare },
    { name: "Cäsar", icon: faFont },
    { name: "Vigenere", icon: faKey },
    { name: "Polybios", icon: faTh },
    { name: "Tapir", icon: faPaw },
];

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
    const [bulkDecryptResults, setBulkDecryptResults] = useState("");

    function clearAll() {
        setInputText("");
        setOutputText("");
        setCaesarShift(3);
        setNumRails(2);
        setVigenereKey("");
        setPolybiosKey("");
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
                result = tapirEncrypt(inputText);
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
                result = tapirDecrypt(inputText);
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
                                <div className="tapir-table">
                                    {tapirEncrypt("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789").match(/.{1,2}/g)?.map((num, i) => (
                                        <div key={i} className="tapir-cell">
                                            {num}
                                        </div>
                                    ))}
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
