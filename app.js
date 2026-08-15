/* ==========================================================================
   WEBBLOCKS 2.0 · MAIN APPLICATION ENTRY POINT & EVENT LISTENERS
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    console.log("🧱 WebBlocks 2.0 iniciado");

    /* ==========================================================================
       1. DRAG & DROP DESDE LA PALETA LATERAL AL LIENZO
       ========================================================================== */
    const paletteBlocks = document.querySelectorAll(".palette-block");
    const canvas = document.getElementById("canvas");

    paletteBlocks.forEach(block => {
        block.addEventListener("dragstart", (e) => {
            AppState.draggedBlockType = block.dataset.type;
            e.dataTransfer.effectAllowed = "copy";
            e.dataTransfer.setData("text/plain", block.dataset.type);
        });
    });

    if (canvas) {
        canvas.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
            canvas.classList.add("drag-over");
        });

        canvas.addEventListener("dragleave", (e) => {
            if (!canvas.contains(e.relatedTarget)) {
                canvas.classList.remove("drag-over");
            }
        });

        canvas.addEventListener("drop", (e) => {
            e.preventDefault();
            canvas.classList.remove("drag-over");

            const blockType = AppState.draggedBlockType || e.dataTransfer.getData("text/plain");
            if (!blockType) return;

            // Calcular coordenadas exactas donde soltó el bloque (Modo Libre)
            const canvasRect = canvas.getBoundingClientRect();
            let posX = e.clientX - canvasRect.left;
            let posY = e.clientY - canvasRect.top;

            // Ajustar a cuadrícula magnética de 10px
            posX = Math.max(20, Math.round((posX - 80) / 10) * 10);
            posY = Math.max(20, Math.round((posY - 20) / 10) * 10);

            const newBlock = createBlock(blockType, posX, posY);
            if (newBlock) {
                addNode(newBlock);
                renderCanvas();
                renderInspector();
                showToast(`¡Añadido: ${newBlock.label}!`);
            }

            AppState.draggedBlockType = null;
        });

        // Clic en el fondo del lienzo para deseleccionar
        canvas.addEventListener("click", (e) => {
            if (e.target === canvas || e.target.classList.contains("empty-canvas") || e.target.closest(".empty-canvas")) {
                AppState.selectedNodeId = null;
                renderCanvas();
                renderInspector();
            }
        });
    }

    /* ==========================================================================
       2. SELECTOR DE MODOS (MODO LIBRE vs MODO FLUJO)
       ========================================================================== */
    const modeFreeBtn = document.getElementById("modeFreeBtn");
    const modeFlowBtn = document.getElementById("modeFlowBtn");
    const canvasModeLabel = document.getElementById("canvasModeLabel");

    if (modeFreeBtn && modeFlowBtn) {
        modeFreeBtn.addEventListener("click", () => {
            AppState.canvasMode = "free";
            modeFreeBtn.classList.add("active");
            modeFlowBtn.classList.remove("active");
            if (canvasModeLabel) canvasModeLabel.textContent = "📐 Posicionamiento Libre";
            renderCanvas();
            showToast("Modo Libre activado: Arrastra los elementos a cualquier posición.");
        });

        modeFlowBtn.addEventListener("click", () => {
            AppState.canvasMode = "flow";
            modeFlowBtn.classList.add("active");
            modeFreeBtn.classList.remove("active");
            if (canvasModeLabel) canvasModeLabel.textContent = "📑 Modo Flujo Auto-Organizado";
            renderCanvas();
            showToast("Modo Flujo activado: Elementos alineados verticalmente.");
        });
    }

    /* ==========================================================================
       3. BOTONES DE ACCIÓN SUPERIOR (VISTA PREVIA, CÓDIGO, EXPORTAR, LIMPIAR)
       ========================================================================== */
    document.getElementById("previewBtn")?.addEventListener("click", openPreview);
    document.getElementById("codeBtn")?.addEventListener("click", openCodeModal);

    document.getElementById("clearBtn")?.addEventListener("click", () => {
        if (AppState.project.nodes.length === 0) return;
        const confirmClear = confirm("¿Estás seguro de que deseas vaciar el lienzo?");
        if (confirmClear) {
            clearProject();
            renderCanvas();
            renderInspector();
            showToast("Lienzo vaciado.");
        }
    });

    document.getElementById("exportBtn")?.addEventListener("click", () => {
        const html = generateHTML();
        const css = generateCSS();
        const js = generateJS();

        downloadProjectFile("index.html", html);
        setTimeout(() => downloadProjectFile("style.css", css), 250);
        setTimeout(() => downloadProjectFile("script.js", js), 500);

        showToast("📦 ¡Archivos index.html, style.css y script.js descargados!");
    });

    // Deshacer / Rehacer
    document.getElementById("undoBtn")?.addEventListener("click", undo);
    document.getElementById("redoBtn")?.addEventListener("click", redo);

    /* ==========================================================================
       4. MODAL DE CÓDIGO (TABS, COPIAR, DESCARGAR)
       ========================================================================== */
    document.querySelectorAll(".code-tabs .tab").forEach(tab => {
        tab.addEventListener("click", () => {
            AppState.codeTab = tab.dataset.codeTab;
            updateCodeOutput();
        });
    });

    document.getElementById("closeCode")?.addEventListener("click", () => {
        document.getElementById("codeModal")?.close();
    });

    document.getElementById("copyCode")?.addEventListener("click", async () => {
        const codeText = document.getElementById("codeOutput")?.textContent || "";
        try {
            await navigator.clipboard.writeText(codeText);
            const copyBtn = document.getElementById("copyCode");
            if (copyBtn) {
                copyBtn.textContent = "✅ ¡Copiado!";
                setTimeout(() => copyBtn.textContent = "📋 Copiar Código", 1500);
            }
        } catch (err) {
            console.error("Error al copiar:", err);
        }
    });

    document.getElementById("downloadCode")?.addEventListener("click", () => {
        const codeText = document.getElementById("codeOutput")?.textContent || "";
        const filenames = { html: "index.html", css: "style.css", js: "script.js" };
        const filename = filenames[AppState.codeTab] || "archivo.txt";
        downloadProjectFile(filename, codeText);
        showToast(`Descargado: ${filename}`);
    });

    /* ==========================================================================
       5. MODAL DE VISTA PREVIA (SIMULADOR DE DISPOSITIVOS)
       ========================================================================== */
    document.querySelectorAll(".device-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            setPreviewDevice(btn.dataset.device);
        });
    });

    document.getElementById("closePreview")?.addEventListener("click", () => {
        document.getElementById("previewModal")?.close();
    });

    /* ==========================================================================
       6. ATAJOS DE TECLADO
       ========================================================================== */
    document.addEventListener("keydown", (e) => {
        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : "";
        const isEditingInput = activeTag === "input" || activeTag === "textarea" || activeTag === "select";

        // Deshacer con Ctrl+Z
        if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey && !isEditingInput) {
            e.preventDefault();
            undo();
        }

        // Rehacer con Ctrl+Y o Ctrl+Shift+Z
        if (((e.ctrlKey || e.metaKey) && e.key === "y") || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z") && !isEditingInput) {
            e.preventDefault();
            redo();
        }

        // Eliminar bloque con Delete / Backspace
        if ((e.key === "Delete" || e.key === "Backspace") && AppState.selectedNodeId && !isEditingInput) {
            e.preventDefault();
            removeNode(AppState.selectedNodeId);
            renderCanvas();
            renderInspector();
        }

        // Deseleccionar o cerrar con Escape
        if (e.key === "Escape") {
            const codeModal = document.getElementById("codeModal");
            const previewModal = document.getElementById("previewModal");
            if (codeModal?.open) codeModal.close();
            else if (previewModal?.open) previewModal.close();
            else {
                AppState.selectedNodeId = null;
                renderCanvas();
                renderInspector();
            }
        }
    });

    /* ==========================================================================
       7. ESTADO INICIAL AMIGABLE
       ========================================================================== */
    const initialHeading = createBlock("heading", 60, 40);
    initialHeading.properties.text = "🧱 ¡Mi Primera Página Web!";

    const initialDivider = createBlock("divider", 60, 105);
    initialDivider.properties.thickness = 3;
    initialDivider.properties.color = "#4f46e5";

    const initialText = createBlock("paragraph", 60, 135);
    initialText.properties.text = "Crea tu página web moviendo los bloques con libertad y configurando lógica en JavaScript.";

    const initialButton = createBlock("button", 180, 210);
    initialButton.properties.text = "¡Haz Clic Aquí!";

    const initialQuestionCond = createBlock("question_condition", 60, 280);

    AppState.project.nodes = [initialHeading, initialDivider, initialText, initialButton, initialQuestionCond];
    AppState.selectedNodeId = initialHeading.id;

    saveHistory();
    renderCanvas();
    renderInspector();
});