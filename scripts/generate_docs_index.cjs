const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(DOCS_DIR, 'index.html');

function getFiles(dir, allFiles = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getFiles(filePath, allFiles);
        } else if (file.endsWith('.mmd') || file.endsWith('.md')) {
            if (file !== 'index.html' && !file.endsWith('style.css')) {
                allFiles.push(filePath);
            }
        }
    });
    return allFiles;
}

const filesPaths = getFiles(DOCS_DIR);
const fileData = filesPaths.map(file => {
    const relativePath = path.relative(DOCS_DIR, file);
    const content = fs.readFileSync(file, 'utf8');
    return {
        path: relativePath,
        content: content,
        type: file.endsWith('.mmd') ? 'mermaid' : 'md'
    };
});

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Architect | Tech Docs</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script type="module">
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
        mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        window.mermaid = mermaid;
    </script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <link rel="stylesheet" href="style.css">
    <style>
        .sidebar-item.active { @apply bg-blue-600 text-white shadow-lg border-blue-400; }
        .folder-header { @apply flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-3 py-6 mt-4 border-t border-gray-800/50; }
        .folder-header:first-child { @apply border-t-0 mt-0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { @apply bg-[#0d1117]; }
        ::-webkit-scrollbar-thumb { @apply bg-gray-700 rounded-full; }
    </style>
</head>
<body class="bg-[#0d1117] text-gray-200 flex h-screen overflow-hidden">
    <aside class="w-72 bg-[#161b22] border-r border-gray-800 flex flex-col shadow-2xl z-10">
        <div class="p-6 border-b border-gray-800 bg-[#0d1117]/80 backdrop-blur-md">
            <h1 class="text-lg font-black text-white flex items-center gap-3">
                <span class="bg-blue-600 p-1.5 rounded-lg shadow-inline">💠</span>
                <span class="tracking-tighter">TECH DOCS</span>
            </h1>
            <p class="text-[10px] text-gray-500 mt-2 uppercase font-bold tracking-widest flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                System Architect
            </p>
        </div>
        <nav class="flex-1 overflow-y-auto p-4 space-y-1" id="file-list"></nav>
    </aside>

    <main class="flex-1 flex flex-col overflow-hidden bg-[#0d1117]">
        <header class="h-14 bg-[#161b22]/50 border-b border-gray-800 flex items-center px-8 justify-between backdrop-blur-sm">
            <div id="breadcrumb" class="text-[11px] text-gray-500 font-mono uppercase tracking-widest flex items-center gap-2"></div>
        </header>

        <section id="content-area" class="flex-1 overflow-y-auto p-12 lg:p-20 scroll-smooth">
            <div id="welcome-screen" class="max-w-3xl mx-auto text-center py-20">
                <div class="w-20 h-20 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20 shadow-xl text-3xl">📜</div>
                <h2 class="text-3xl font-black text-white mb-4 tracking-tight">Technical Repository</h2>
                <p class="text-gray-400 leading-relaxed">Select a module to visualize architecture and requirements.</p>
            </div>
            
            <div id="file-viewer" class="hidden max-w-5xl mx-auto">
                <div id="mermaid-container" class="hidden mb-16 shadow-2xl border border-gray-800 rounded-xl overflow-hidden">
                    <div class="bg-[#161b22] px-4 py-2 border-b border-gray-800 flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Visual Analysis Diagram</span>
                        <div class="flex gap-1"><div class="w-1.5 h-1.5 rounded-full bg-red-500/30"></div><div class="w-1.5 h-1.5 rounded-full bg-yellow-500/30"></div><div class="w-1.5 h-1.5 rounded-full bg-green-500/30"></div></div>
                    </div>
                    <div class="mermaid" id="mermaid-graph"></div>
                </div>
                <div id="rendered-md" class="markdown-body mb-20"></div>
                <div id="raw-code-section" class="mt-20 pt-10 border-t border-gray-800/50">
                    <pre class="rounded-xl !bg-[#010409] border border-gray-800 p-6 overflow-auto text-sm"><code id="code-block"></code></pre>
                </div>
            </div>
        </section>
    </main>

    <script>
        const files = ___FILES_DATA___;
        const nav = document.getElementById('file-list');
        const viewer = document.getElementById('file-viewer');
        const welcome = document.getElementById('welcome-screen');
        const mdArea = document.getElementById('rendered-md');
        const mermaidContainer = document.getElementById('mermaid-container');
        const mermaidGraph = document.getElementById('mermaid-graph');
        const codeBlock = document.getElementById('code-block');
        const breadcrumb = document.getElementById('breadcrumb');

        const folders = {};
        files.forEach(f => {
            const parts = f.path.split('/');
            const folderName = parts.length > 1 ? parts[0] : 'General';
            if (!folders[folderName]) folders[folderName] = [];
            folders[folderName].push(f);
        });

        Object.keys(folders).sort().forEach(folderName => {
            const header = document.createElement('div');
            header.className = 'folder-header';
            header.innerHTML = '📂 ' + folderName.replace(/[0-9]+_/g, '').replace(/_/g, ' ');
            nav.appendChild(header);

            folders[folderName].sort((a,b) => a.path.localeCompare(b.path)).forEach(f => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-item w-full text-left px-3 py-2 rounded-lg text-xs transition-all hover:bg-gray-800/50 flex items-center gap-3 group border border-transparent mb-1';
                const fileName = f.path.split('/').pop().replace('.md', '').replace('.mmd', '');
                const icon = f.type === 'mermaid' ? '<span class="text-blue-500 font-bold">DIAG</span>' : '<span class="text-gray-500 font-bold">DOCS</span>';
                btn.innerHTML = icon + ' <span class="truncate font-medium text-gray-400 group-hover:text-gray-200">' + fileName.replace(/_/g, ' ') + '</span>';
                btn.onclick = () => loadFile(f, btn);
                nav.appendChild(btn);
            });
        });

        async function loadFile(file, element) {
            document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            welcome.classList.add('hidden');
            viewer.classList.remove('hidden');
            breadcrumb.textContent = 'Docs / ' + file.path.replace(/_/g, ' ').replace('.md', '').replace('.mmd', '');

            if (file.type === 'mermaid') {
                mermaidContainer.classList.remove('hidden');
                mermaidGraph.removeAttribute('data-processed');
                mermaidGraph.innerHTML = file.content;
                mdArea.innerHTML = '';
                codeBlock.className = 'language-mermaid';
                if (window.mermaid) { await window.mermaid.run({ nodes: [mermaidGraph] }); }
            } else {
                mermaidContainer.classList.add('hidden');
                mdArea.innerHTML = marked.parse(file.content);
                codeBlock.className = 'language-markdown';
            }
            codeBlock.textContent = file.content;
            Prism.highlightElement(codeBlock);
            viewer.scrollTo({ top: 0, behavior: 'smooth' });
        }
    </script>
</body>
</html>`.replace('___FILES_DATA___', JSON.stringify(fileData));

fs.writeFileSync(OUTPUT_FILE, htmlContent);
console.log('Architect Portal Updated with style.css: ' + OUTPUT_FILE);
