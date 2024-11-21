const editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/javascript");

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
    output.innerHTML = ""; // Membersihkan output sebelumnya
    appendToOutput("Memulai eksekusi kode...", false);

    if (language === "javascript") {
        const originalConsoleLog = console.log;
        console.log = (message) => appendToOutput(message);
        
        try {
            const startTime = performance.now();
            new Function(code)(); // Menjalankan kode JavaScript
            const endTime = performance.now();
            appendToOutput(`Eksekusi selesai dalam ${(endTime - startTime).toFixed(2)} ms`, false);
        } catch (error) {
            handleError(error);
        }
        
        console.log = originalConsoleLog;
        
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
        output.innerHTML = marked(code);
    }
}

function handleError(error) {
    let errorMessage = `Error: ${error.message}`;
    const stack = error.stack.split('\n');
    const lineMatch = stack[0].match(/<anonymous>:(\d+):\d+/);
    const lineNumber = lineMatch ? lineMatch[1] : "unknown";
    errorMessage += ` di baris ${lineNumber}`;
    errorMessage += "<br>" + stack.slice(1).join("<br>");
    appendToOutput(errorMessage, true);
}