/* ==========================================================================
   WEBBLOCKS 2.0 · EDUCATIONAL CODE GENERATOR (HTML, CSS, JS)
   ========================================================================== */

function escapeHTML(str) {
    if (typeof str !== "string") return String(str ?? "");
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* ==========================================================================
   HTML GENERATION
   ========================================================================== */
function generateHTML() {
    const isFreeMode = AppState.canvasMode === "free";
    let bodyElements = "";

    AppState.project.nodes.forEach(node => {
        bodyElements += "    " + renderNodeHTML(node) + "\n";
    });

    if (!bodyElements.trim()) {
        bodyElements = "    <!-- Arrastra elementos al lienzo para verlos aquí -->\n";
    }

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHTML(AppState.project.metadata.name || "Mi Página Web")}</title>
    
    <!-- Fuentes Google -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
    
    <!-- Hoja de Estilos -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

<main class="${isFreeMode ? 'free-layout-container' : 'flow-layout-container'}">
${bodyElements}</main>

<!-- Lógica Interactiva en JavaScript -->
<script src="script.js"></script>
</body>
</html>`;
}

function renderNodeHTML(node) {
    const p = node.properties || {};
    const id = node.id;

    switch (node.type) {
        case "heading":
            return `<h1 id="${id}" class="wb-heading">${escapeHTML(p.text)}</h1>`;

        case "subheading":
            return `<h2 id="${id}" class="wb-subheading">${escapeHTML(p.text)}</h2>`;

        case "paragraph":
            return `<p id="${id}" class="wb-paragraph">${escapeHTML(p.text)}</p>`;

        case "button":
            return `<button id="${id}" class="wb-button">${escapeHTML(p.text)}</button>`;

        case "image":
            return `<img id="${id}" class="wb-image" src="${escapeHTML(p.src)}" alt="${escapeHTML(p.alt || 'Imagen')}" loading="lazy">`;

        case "card":
            return `<div id="${id}" class="wb-card">
        <h3 class="wb-card-title">${escapeHTML(p.title)}</h3>
        <p class="wb-card-text">${escapeHTML(p.text)}</p>
    </div>`;

        case "badge":
            return `<span id="${id}" class="wb-badge">${escapeHTML(p.text)}</span>`;

        case "input":
            return `<div id="${id}" class="wb-input-group">
        ${p.label ? `<label for="${id}_input">${escapeHTML(p.label)}</label>` : ''}
        <input type="text" id="${id}_input" class="wb-input" placeholder="${escapeHTML(p.placeholder || '')}">
    </div>`;

        case "divider":
            return `<hr id="${id}" class="wb-divider">`;

        case "question_condition":
            return `<div id="${id}" class="wb-question-box">
        <h3 class="wb-question-title">${escapeHTML(p.question || '¿Cuántos años tienes?')}</h3>
        <button id="${id}_btn" class="wb-button">${escapeHTML(p.buttonText || 'Verificar Edad')}</button>
    </div>`;

        default:
            return `<div id="${id}"><!-- Bloque ${node.type} --></div>`;
    }
}

/* ==========================================================================
   CSS GENERATION
   ========================================================================== */
function generateCSS() {
    const isFreeMode = AppState.canvasMode === "free";

    let css = `/* ==========================================================================
   ESTILOS GENERADOS POR WEBBLOCKS 2.0
   ========================================================================== */

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #f8fafc;
    color: #0f172a;
    min-height: 100vh;
    padding: 30px 20px;
    display: flex;
    justify-content: center;
    transition: background-color 0.4s ease;
}

h1, h2, h3 {
    font-family: 'Outfit', sans-serif;
}

/* Contenedor principal de la página */
.free-layout-container {
    position: relative;
    width: 100%;
    max-width: 960px;
    min-height: 800px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    padding: 20px;
}

.flow-layout-container {
    width: 100%;
    max-width: 800px;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    padding: 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    align-items: center;
}

/* ==========================================================================
   ESTILOS INDIVIDUALES DE CADA ELEMENTO
   ========================================================================== */
`;

    AppState.project.nodes.forEach(node => {
        const p = node.properties || {};
        const id = `#${node.id}`;

        let positioning = "";
        if (isFreeMode) {
            positioning = `    position: absolute;
    left: ${node.posX || 0}px;
    top: ${node.posY || 0}px;
    width: ${typeof node.width === 'number' ? node.width + 'px' : (node.width || 'auto')};
    z-index: ${node.zIndex || 1};\n`;
        }

        switch (node.type) {
            case "heading":
                css += `\n${id} {\n${positioning}    color: ${p.color || '#1e293b'};\n    font-size: ${p.fontSize || 34}px;\n    font-weight: ${p.fontWeight || 800};\n    text-align: ${p.align || 'center'};\n    line-height: 1.25;\n}\n`;
                break;

            case "subheading":
                css += `\n${id} {\n${positioning}    color: ${p.color || '#4f46e5'};\n    font-size: ${p.fontSize || 22}px;\n    font-weight: ${p.fontWeight || 700};\n    text-align: ${p.align || 'center'};\n    line-height: 1.3;\n}\n`;
                break;

            case "paragraph":
                css += `\n${id} {\n${positioning}    color: ${p.color || '#475569'};\n    font-size: ${p.fontSize || 16}px;\n    text-align: ${p.align || 'center'};\n    line-height: ${p.lineHeight || 1.6};\n}\n`;
                break;

            case "button":
                css += `\n${id} {\n${positioning}    color: ${p.color || '#ffffff'};\n    background: ${p.background || '#4f46e5'};\n    font-size: ${p.fontSize || 16}px;\n    font-weight: ${p.fontWeight || 700};\n    border-radius: ${p.borderRadius || 12}px;\n    padding: ${p.paddingY || 12}px ${p.paddingX || 24}px;\n    border: none;\n    cursor: pointer;\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    transition: transform 0.2s ease, filter 0.2s ease;\n}\n\n${id}:hover {\n    transform: translateY(-2px);\n    filter: brightness(1.08);\n}\n`;
                break;

            case "image":
                css += `\n${id} {\n${positioning}    width: ${typeof node.width === 'number' ? node.width + 'px' : '100%'};\n    height: ${typeof node.height === 'number' ? node.height + 'px' : 'auto'};\n    border-radius: ${p.borderRadius || 16}px;\n    object-fit: cover;\n    display: block;\n    margin: 0 auto;\n}\n`;
                break;

            case "card":
                css += `\n${id} {\n${positioning}    background: ${p.background || '#ffffff'};\n    border: 1px solid ${p.borderColor || '#e2e8f0'};\n    border-radius: ${p.borderRadius || 16}px;\n    padding: ${p.padding || 24}px;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n}\n\n${id} .wb-card-title {\n    color: ${p.titleColor || '#4f46e5'};\n    margin-bottom: 8px;\n}\n\n${id} .wb-card-text {\n    color: ${p.textColor || '#0f172a'};\n    line-height: 1.5;\n}\n`;
                break;

            case "badge":
                css += `\n${id} {\n${positioning}    color: ${p.color || '#4f46e5'};\n    background: ${p.background || '#eef2ff'};\n    font-size: ${p.fontSize || 12}px;\n    font-weight: ${p.fontWeight || 800};\n    border-radius: ${p.borderRadius || 20}px;\n    padding: ${p.paddingY || 4}px ${p.paddingX || 12}px;\n    display: inline-block;\n}\n`;
                break;

            case "input":
                css += `\n${id} {\n${positioning}    display: flex;\n    flex-direction: column;\n    gap: 6px;\n}\n\n${id} label {\n    font-size: 13px;\n    font-weight: 700;\n    color: #334155;\n}\n\n${id} .wb-input {\n    padding: 10px 14px;\n    border: 1px solid ${p.borderColor || '#cbd5e1'};\n    border-radius: ${p.borderRadius || 10}px;\n    font-size: 14px;\n    outline: none;\n}\n\n${id} .wb-input:focus {\n    border-color: #4f46e5;\n    box-shadow: 0 0 0 3px #e0e7ff;\n}\n`;
                break;

            case "divider":
                css += `\n${id} {\n${positioning}    border: 0;\n    height: ${p.thickness || 3}px;\n    background-color: ${p.color || '#4f46e5'};\n    margin: ${p.margin || 16}px 0;\n    border-radius: ${Math.round((p.thickness || 3) / 2)}px;\n}\n`;
                break;

            case "question_condition":
                css += `\n${id} {\n${positioning}    background: #ffffff;\n    border: 1px solid #c7d2fe;\n    border-radius: 16px;\n    padding: 24px;\n    text-align: center;\n    box-shadow: 0 4px 12px rgba(0,0,0,0.05);\n}\n\n${id} .wb-question-title {\n    color: #1e293b;\n    font-size: 18px;\n    margin-bottom: 14px;\n}\n\n${id} .wb-button {\n    background: ${p.buttonColor || '#4f46e5'};\n    color: #ffffff;\n    font-weight: 700;\n    padding: 10px 20px;\n    border: none;\n    border-radius: 10px;\n    cursor: pointer;\n    transition: transform 0.2s ease;\n}\n\n${id} .wb-button:hover {\n    transform: translateY(-2px);\n}\n`;
                break;
        }
    });

    return css;
}

/* ==========================================================================
   JAVASCRIPT GENERATION
   ========================================================================== */
function generateJS() {
    let js = `/* ==========================================================================
   LÓGICA Y FUNCIONES JAVASCRIPT
   Generado automáticamente por WebBlocks 2.0
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 ¡Página web cargada y lista!");

`;

    // Procesar bloques de Pregunta & Condición
    AppState.project.nodes.forEach(node => {
        if (node.type === "question_condition") {
            const p = node.properties || {};
            const varName = /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(p.variableName) ? p.variableName : "edad";
            let compVal = p.targetValue || "18";
            if (!isNaN(compVal) && compVal !== "") compVal = Number(compVal);
            else compVal = JSON.stringify(compVal);

            js += `    // -----------------------------------------------------\n`;
            js += `    // Pregunta ligada a variable '${varName}' y condición\n`;
            js += `    // -----------------------------------------------------\n`;
            js += `    const boton_${node.id} = document.getElementById("${node.id}_btn");\n\n`;
            js += `    boton_${node.id}?.addEventListener("click", () => {\n`;
            js += `        // 1. Preguntar al usuario y guardar respuesta en la variable\n`;
            js += `        let ${varName} = prompt(${JSON.stringify(p.question || "¿Cuántos años tienes?")});\n\n`;
            js += `        if (${varName} !== null && ${varName}.trim() !== "") {\n`;
            js += `            // 2. Evaluar la condición con la variable\n`;
            js += `            if (Number(${varName}) ${p.operator || ">="} ${compVal}) {\n`;
            js += `                alert(${JSON.stringify(p.successMessage || "¡Eres mayor de edad! Acceso permitido 🎉")});\n`;
            js += `            } else {\n`;
            js += `                alert(${JSON.stringify(p.failMessage || "Aún eres menor de edad.")});\n`;
            js += `            }\n`;
            js += `        }\n`;
            js += `    });\n\n`;
        }
    });

    js += `});\n`;
    return js;
}