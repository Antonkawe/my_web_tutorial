function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    const accountMenu = document.getElementById("account-menu");

    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        accountMenu.classList.remove('active');
    } else {
        sidebar.style.width = "250px";
        accountMenu.classList.add('active');
    }
}

function Home() {
    if (document.referrer) {
        window.history.back();
    } else {
        window.location.href = '/index.html';
    }
}

function closeSidebar() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("account-menu").classList.remove('active');
}

function showKalkulator() {
    window.location.href = "script/kalt.html";
}

function showJavascriptr() {
    window.location.href = "javascript/index.html";
}

function showEditor() {
    window.location.href = "editor/index.html";
}

function showHtmll() {
    window.location.href = "html/index.html";
}

function showPython() {
    window.location.href = "python/py.html";
}

function show061288() {
    window.location.href = "./tiktok/vkv0-w3zd-muiq6-2j5b.html";
}

function showScript() {
    window.location.href = "script/jumscrape.html";
}

function showHtml1() {
    window.location.href = "HTML1.html";
}

function showHtml2() {
    window.location.href = "HTML2.html";
}

function showHtml3() {
    window.location.href = "HTML3.html";
}

function showHtml4() {
    window.location.href = "HTML4.html";
}

function showHtml5() {
    window.location.href = "HTML5.html";
}

function showTerminal() {
    window.location.href = "terminal/index.html";
}

function showPjsn() {
    window.location.href = "penjelasan/penjelasan-js.html";
}

function showNode1() {
    window.location.href = "javascript1.html";
}

function showNode2() {
    window.location.href = "javascript2.html";
}

function showNode3() {
    window.location.href = "javascript3.html";
}

function showNode4() {
    window.location.href = "javascript4.html";
}

function show1() {
    window.location.href = "python/projek-praktis.html";
}

function show2() {
    window.location.href = "python/Struktur-Kontrol.html";
}

function show3() {
    window.location.href = "python/Fungsi-di-Python.html";
}

function show4() {
    window.location.href = "python/variables.html";
}

function show5() {
    window.location.href = "python/conditional.html";
}

function show6() {
    window.location.href = "python/lists.html";
}

function show7() {
    window.location.href = "python/loops.html";
}

function show8() {
    window.location.href = "python/tuples.html";
}

function show9() {
    window.location.href = "python/dictionaries.html";
}

function show10() {
    window.location.href = "python/exceptions.html";
}

function show11() {
    window.location.href = "python/classes.html";
}

function show12() {
    window.location.href = "python/imports.html";
}

function show13() {
    window.location.href = "python/lambda-functions.html";
}

function show14() {
    window.location.href = "python/map-filter-reduce.html";
}

function show15() {
    window.location.href = "python/decorators.html";
}

function show16() {
    window.location.href = "python/recursion.html";
}

function show17() {
    window.location.href = "python/generators.html";
}

function show18() {
    window.location.href = "python/context-managers.html";
}

function show19() {
    window.location.href = "python/args-kwargs.html";
}

function show20() {
    window.location.href = "python/comprehensions.html";
}

function show21() {
    window.location.href = "python/importing-modules.html";
}

function show22() {
    window.location.href = "python/multi-threading.html";
}

function show23() {
    window.location.href = "python/parallel-processing.html";
}

function show24() {
    window.location.href = "python/dynamic-class-generation.html";
}

function showMarket() {
    window.location.href = "./markets/x8j2-Vn3w-0mw2-A;jsw-ke3s.html";
}

function copyCode() {
    const code = document.querySelector('.code-container pre code').innerText;
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    });
}


function runCode() {
    const userCode = document.getElementById('jsInput').value;
    try {
        const result = eval(userCode);
        document.getElementById('output').textContent = result;
    } catch (error) {
        document.getElementById('output').textContent = 'Error: ' + error.message;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("pre").forEach((pre) => {
        const header = document.createElement("div");
        header.className = "code-header";
        const codeBlock = pre.querySelector("code");
        if (!codeBlock) return;
        const languageClass = codeBlock.className.match(/language-(\w+)/);
        const language = languageClass ? languageClass[1].toUpperCase() : "CODE";
        header.innerHTML = `<span class="language-label">${language}</span>`;
        const button = document.createElement("button");
        button.className = "copy-btn";
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H8c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V3c0-1.1-.9-2-2-2zm-8 2h8v1H8V3zm9 3v14H5V6h12z"/>
            </svg>
            Salin Kode
        `;
        header.appendChild(button);
        pre.parentNode.insertBefore(header, pre);
        button.addEventListener("click", () => {
            if (!codeBlock) {
                alert("Kode tidak ditemukan!");
                return;
            }
            const codeText = codeBlock.innerText;
            navigator.clipboard.writeText(codeText)
                .then(() => {
                    button.innerHTML = '<span class="copied">Tersalin</span>';
                    setTimeout(() => {
                        button.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 1H8c-1.1 0-2 .9-2 2v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-1V3c0-1.1-.9-2-2-2zm-8 2h8v1H8V3zm9 3v14H5V6h12z"/>
                            </svg>
                            Salin Kode
                        `;
                    }, 1500);
                })
                .catch(() => {
                    alert("Gagal menyalin kode");
                });
        });
    });
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
	link.addEventListener('click', function(e) {
		e.preventDefault();
		document.querySelectorAll('.content')
			.forEach(content => {
			content.style.display = 'none';
		});
		const targetId = this.getAttribute('href');
		document.querySelector(targetId)
			.style.display = 'block';
	});
});