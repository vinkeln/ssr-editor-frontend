import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import "../styles/CodeEditor.scss";

interface CodeEditorProps {
    value: string,
    onChange: (value: string) => void;
}

function CodeEditor({ value, onChange }: CodeEditorProps) {
    const [output, setOutput] = useState<string>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const runCode = async () => {
        setIsRunning(true);
        setOutput("");

        try {
            // Using base64Code
            const base64Code = btoa(value);

            // Send to execution server

            const response = await fetch("https://execjs.emilfolino.se/code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: base64Code }),
            });

            const result = await response.json();

            if (result.data) {
                const decodedOutput = atob(result.data);
                setOutput(decodedOutput);
            } else {
                setOutput("Sorry! There was an error executing your code.");
            }
        } catch (error) {
            setOutput("Error executing code: " + error);
        } finally {
            setIsRunning(false);
        };
    };

        return (
            <div className="code-editor-container">
                <div className="editor-header">
                    <h3>Javascript code editor</h3>
                    <button onClick={runCode} disabled={isRunning} className="run-button">
                        {isRunning ? "Running..." : "Run Code"}
                    </button>
                </div>
                <CodeMirror
                    value={value}
                    height="60vh"
                    width="120vh"
                    theme="dark"
                    extensions={[javascript()]}
                    onChange={(val) => onChange(val)}
                />

                {output && (
                    <div className="output-container">
                        <h4>Output:</h4>
                        <pre>{output}</pre>
                    </div>
                )}

            </div>
        )
    };

export default CodeEditor;
