const editor = ace.edit("editor", {
    theme: "ace/theme/monokai",
    mode: "ace/mode/javascript",
    autoScrollEditorIntoView: true
});

function changeMode() {
    const language = document.getElementById("language").value;
    if (language === "javascript") {
        editor.session.setMode("ace/mode/javascript");
    } else if (language === "html") {
        editor.session.setMode("ace/mode/html");
    } else if (language === "markdown") {
        editor.session.setMode("ace/mode/markdown");
    }
}

function appendToOutput(message, isError = false) {
    const output = document.getElementById("output");
    const span = document.createElement("span");
    span.style.color = isError ? "red" : "lightgreen";
    span.innerHTML = message;
    output.appendChild(span);
    output.appendChild(document.createElement("br"));
    output.scrollTop = output.scrollHeight;
}

function runCode() {
    const language = document.getElementById("language").value;
    const code = editor.getValue();
    const output = document.getElementById("output");
    output.style.display = "block";
    output.innerHTML = "";
    if (language === "javascript") {
        const originalConsole = { ...console };
        console.log = (message) => appendToOutput(message);
        console.warn = (message) => appendToOutput(`${message}`, true);
        console.error = (message) => appendToOutput(`${message}`, true);
        console.info = (message) => appendToOutput(`${message}`);
        try {
            const startTime = performance.now();
            if (code.includes("fetch") || code.includes("axios")) {
                new Function(`
                    (async () => {
                        try {
                            ${code}
                        } catch (error) {
                            appendToOutput("Error: " + error.message, true);
                        }
                    })();
                `)();
            } else {
                new Function(code)();
            }
            const endTime = performance.now();
        } catch (error) {
            handleError(error);
        }
        console.log = originalConsole.log;
        console.warn = originalConsole.warn;
        console.error = originalConsole.error;
        console.info = originalConsole.info;
    } else if (language === "html") {
        output.innerHTML = "";
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        output.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(code);
        doc.close();
    } else if (language === "markdown") {
        output.innerHTML = marked.parse(code);
    }
}

function handleError(error) {
    let errorMessage = `Error: ${error.message}`;
    const stack = error.stack.split('\n');
    const filteredStack = stack.filter(line => !line.includes("http", "https"));
    const lineMatch = stack[1].match(/<anonymous>:(\d+):(\d+)/);
    let lineNumber = "unknown";
    if (lineMatch) {
        lineNumber = parseInt(lineMatch[1]) - 1;
    } else {
        const aceCursorPosition = editor.getCursorPosition();
        lineNumber = aceCursorPosition.row + 1;
    }
    errorMessage += ` di baris ${lineNumber}`;
    errorMessage += "<br>" + filteredStack.slice(1).join("<br>");
    appendToOutput(errorMessage, true);
}