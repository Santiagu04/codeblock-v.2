/* ==========================================================================
   WEBBLOCKS 2.0 · CANVAS RENDERER & INTERACTIVE DRAG ENGINE
   ========================================================================== */

function renderCanvas(options = {}) {
    const { preserveInspector = false } = options;
    const canvas = document.getElementById("canvas");
    if (!canvas) return;

    canvas.innerHTML = "";
    canvas.className = `canvas ${AppState.canvasMode === "free" ? "free-mode" : "flow-mode"}`;
    canvas.dataset.mode = AppState.canvasMode;

    const nodes = AppState.project.nodes;

    // Estado vacío amigable
    if (nodes.length === 0) {
        canvas.innerHTML = `
            <div class="empty-canvas">
                <div class="empty-icon">🎨</div>
                <h3>¡Tu lienzo está listo!</h3>
                <p>Arrastra cualquier bloque desde la barra izquierda para comenzar a crear tu página.</p>
            </div>
        `;
        updateStatusBadge();
        if (!preserveInspector) renderInspector();
        return;
    }

    // Renderizar cada bloque en el lienzo
    nodes.forEach(node => {
        const visualNode = createVisualNode(node);
        canvas.appendChild(visualNode);
    });

    updateStatusBadge();
    if (!preserveInspector) renderInspector();
}

function createVisualNode(node) {
    const container = document.createElement("div");
    container.className = "canvas-node";
    container.dataset.id = node.id;
    container.dataset.type = node.type;

    if (node.category === "logic") {
        container.classList.add("logic-node-container");
    }

    const isSelected = node.id === AppState.selectedNodeId;
    if (isSelected) container.classList.add("selected");

    // Posicionamiento en Modo Libre
    if (AppState.canvasMode === "free") {
        container.style.left = `${node.posX || 40}px`;
        container.style.top = `${node.posY || 40}px`;
        if (node.width && node.width !== "auto") {
            container.style.width = typeof node.width === "number" ? `${node.width}px` : node.width;
        }
        if (node.zIndex) {
            container.style.zIndex = node.zIndex;
        }
    }

    // Etiqueta de tipo de bloque
    const typeTag = document.createElement("span");
    typeTag.className = `node-type-tag ${node.category === 'logic' ? 'logic-tag' : ''}`;
    typeTag.textContent = node.label || node.type;
    container.appendChild(typeTag);

    // Barra de herramientas flotante al estar seleccionado
    if (isSelected) {
        const toolbar = createFloatingToolbar(node);
        container.appendChild(toolbar);

        // Tirador de redimensión (Modo Libre)
        if (AppState.canvasMode === "free") {
            const resizeHandle = document.createElement("div");
            resizeHandle.className = "resize-handle";
            setupResizeHandle(resizeHandle, node, container);
            container.appendChild(resizeHandle);
        }
    }

    // Contenido visual del bloque
    const content = document.createElement("div");
    content.className = "node-content-wrapper";
    renderNodeInnerContent(content, node);
    container.appendChild(content);

    // Configurar Selección y Arrastre libre
    setupEditInteractions(container, node);

    return container;
}

// Barra de herramientas flotante para el nodo seleccionado
function createFloatingToolbar(node) {
    const toolbar = document.createElement("div");
    toolbar.className = "node-floating-toolbar";

    // Botón Duplicar
    const dupBtn = document.createElement("button");
    dupBtn.className = "tool-btn";
    dupBtn.title = "Duplicar bloque";
    dupBtn.textContent = "📋";
    dupBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        duplicateNode(node.id);
        renderInspector();
    });
    toolbar.appendChild(dupBtn);

    // Botón Traer al frente
    if (AppState.canvasMode === "free") {
        const frontBtn = document.createElement("button");
        frontBtn.className = "tool-btn";
        frontBtn.title = "Traer al frente";
        frontBtn.textContent = "⬆";
        frontBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            bringNodeToFront(node.id);
        });
        toolbar.appendChild(frontBtn);

        const backBtn = document.createElement("button");
        backBtn.className = "tool-btn";
        backBtn.title = "Enviar al fondo";
        backBtn.textContent = "⬇";
        backBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            sendNodeToBack(node.id);
        });
        toolbar.appendChild(backBtn);
    }

    // Botón Eliminar
    const delBtn = document.createElement("button");
    delBtn.className = "tool-btn delete-btn";
    delBtn.title = "Eliminar bloque";
    delBtn.textContent = "🗑";
    delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeNode(node.id);
        renderCanvas();
        renderInspector();
    });
    toolbar.appendChild(delBtn);

    return toolbar;
}

// Renderizado interno de cada elemento
function renderNodeInnerContent(container, node) {
    const p = node.properties || {};

    switch (node.type) {
        case "heading": {
            const h1 = document.createElement("h1");
            h1.className = "rendered-heading";
            h1.textContent = p.text || "Título Principal";
            h1.style.color = p.color || "#1e293b";
            h1.style.fontSize = `${p.fontSize || 34}px`;
            h1.style.fontWeight = p.fontWeight || 800;
            h1.style.textAlign = p.align || "center";
            container.appendChild(h1);
            break;
        }

        case "subheading": {
            const h2 = document.createElement("h2");
            h2.className = "rendered-subheading";
            h2.textContent = p.text || "Subtítulo";
            h2.style.color = p.color || "#4f46e5";
            h2.style.fontSize = `${p.fontSize || 22}px`;
            h2.style.fontWeight = p.fontWeight || 700;
            h2.style.textAlign = p.align || "center";
            container.appendChild(h2);
            break;
        }

        case "paragraph": {
            const pEl = document.createElement("p");
            pEl.className = "rendered-paragraph";
            pEl.textContent = p.text || "Texto";
            pEl.style.color = p.color || "#475569";
            pEl.style.fontSize = `${p.fontSize || 16}px`;
            pEl.style.textAlign = p.align || "center";
            pEl.style.lineHeight = p.lineHeight || 1.6;
            container.appendChild(pEl);
            break;
        }

        case "button": {
            const btn = document.createElement("button");
            btn.className = "rendered-button";
            btn.textContent = p.text || "Botón";
            btn.style.color = p.color || "#ffffff";
            btn.style.background = p.background || "#4f46e5";
            btn.style.fontSize = `${p.fontSize || 16}px`;
            btn.style.fontWeight = p.fontWeight || 700;
            btn.style.borderRadius = `${p.borderRadius || 12}px`;
            btn.style.padding = `${p.paddingY || 12}px ${p.paddingX || 24}px`;
            if (p.border && p.border !== "none") btn.style.border = p.border;
            container.appendChild(btn);
            break;
        }

        case "image": {
            const img = document.createElement("img");
            img.className = "rendered-image";
            img.src = p.src || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80";
            img.alt = p.alt || "Imagen";
            img.style.borderRadius = `${p.borderRadius || 16}px`;
            img.style.width = "100%";
            img.style.height = typeof node.height === "number" ? `${node.height}px` : "100%";
            container.appendChild(img);
            break;
        }

        case "card": {
            const card = document.createElement("div");
            card.className = "rendered-card";
            card.style.background = p.background || "#ffffff";
            card.style.borderColor = p.borderColor || "#e2e8f0";
            card.style.borderRadius = `${p.borderRadius || 16}px`;
            card.style.padding = `${p.padding || 24}px`;

            const title = document.createElement("h3");
            title.textContent = p.title || "Título de Tarjeta";
            title.style.color = p.titleColor || "#4f46e5";
            title.style.marginBottom = "8px";

            const text = document.createElement("p");
            text.textContent = p.text || "Descripción de la tarjeta.";
            text.style.color = p.textColor || "#0f172a";

            card.appendChild(title);
            card.appendChild(text);
            container.appendChild(card);
            break;
        }

        case "badge": {
            const badge = document.createElement("span");
            badge.className = "rendered-badge";
            badge.textContent = p.text || "Etiqueta";
            badge.style.color = p.color || "#4f46e5";
            badge.style.background = p.background || "#eef2ff";
            badge.style.fontSize = `${p.fontSize || 12}px`;
            badge.style.fontWeight = p.fontWeight || 800;
            badge.style.borderRadius = `${p.borderRadius || 20}px`;
            badge.style.padding = `${p.paddingY || 4}px ${p.paddingX || 12}px`;
            container.appendChild(badge);
            break;
        }

        case "input": {
            const wrap = document.createElement("div");
            wrap.style.display = "flex";
            wrap.style.flexDirection = "column";
            wrap.style.gap = "6px";

            if (p.label) {
                const lbl = document.createElement("label");
                lbl.textContent = p.label;
                lbl.style.fontSize = "13px";
                lbl.style.fontWeight = "700";
                lbl.style.color = "#334155";
                wrap.appendChild(lbl);
            }

            const input = document.createElement("input");
            input.className = "rendered-input";
            input.placeholder = p.placeholder || "Escribe aquí...";
            input.style.borderColor = p.borderColor || "#cbd5e1";
            input.style.borderRadius = `${p.borderRadius || 10}px`;
            wrap.appendChild(input);
            container.appendChild(wrap);
            break;
        }

        case "divider": {
            const hr = document.createElement("div");
            hr.className = "rendered-divider";
            const thickness = p.thickness || 3;
            hr.style.height = `${thickness}px`;
            hr.style.backgroundColor = p.color || "#4f46e5";
            hr.style.borderRadius = `${Math.round(thickness / 2)}px`;
            hr.style.margin = `${p.margin || 16}px 0`;
            hr.style.width = "100%";
            container.appendChild(hr);
            break;
        }

        /* Bloque Ligado: Pregunta ➔ Variable ➔ Condición */
        case "question_condition": {
            const card = document.createElement("div");
            card.className = "logic-card-canvas cond-card";
            card.innerHTML = `
                <div class="logic-card-header">
                    <span>⚡</span> <strong>Pregunta & Condición (JS)</strong>
                </div>
                <div class="logic-card-content">
                    <div style="font-size:12px; margin-bottom:4px;">
                        ❓ <b>Pregunta:</b> "${p.question || '¿Cuántos años tienes?'}"
                    </div>
                    <div style="font-size:12px; margin-bottom:4px;">
                        📦 <b>Variable:</b> <code>let ${p.variableName || 'edad'}</code>
                    </div>
                    <div class="logic-code-badge" style="margin-bottom:6px;">
                        ⚖ Si <b>${p.variableName || 'edad'}</b> ${p.operator || '>='} ${p.targetValue || '18'}
                    </div>
                    <div style="font-size:11px; color:#15803d;">
                        ✅ Si cumple: "${p.successMessage || '¡Mayor de edad!'}"
                    </div>
                    <div style="font-size:11px; color:#b91c1c; margin-bottom:8px;">
                        ❌ Si no cumple: "${p.failMessage || 'Menor de edad'}"
                    </div>
                    <button class="rendered-button" style="background:${p.buttonColor || '#4f46e5'}; color:#fff; padding:6px 14px; font-size:12px; border-radius:8px;">
                        ${p.buttonText || 'Verificar Edad'}
                    </button>
                </div>
            `;
            container.appendChild(card);
            break;
        }
    }
}

// Interacciones en Modo Edición (Selección y Arrastre Libre)
function setupEditInteractions(container, node) {
    container.addEventListener("click", (e) => {
        e.stopPropagation();
        AppState.selectedNodeId = node.id;
        renderCanvas({ preserveInspector: false });
        renderInspector();
    });

    if (AppState.canvasMode === "free") {
        container.addEventListener("mousedown", (e) => {
            if (e.target.closest(".node-floating-toolbar") || e.target.classList.contains("resize-handle")) {
                return;
            }

            e.preventDefault();
            e.stopPropagation();
            AppState.selectedNodeId = node.id;
            renderInspector();

            const canvas = document.getElementById("canvas");
            const canvasRect = canvas.getBoundingClientRect();

            const startX = e.clientX;
            const startY = e.clientY;
            const initialNodeX = node.posX || 0;
            const initialNodeY = node.posY || 0;

            function onMouseMove(moveEvent) {
                const deltaX = moveEvent.clientX - startX;
                const deltaY = moveEvent.clientY - startY;

                // Cuadrícula magnética de 10px para alineación perfecta
                let newX = Math.round((initialNodeX + deltaX) / 10) * 10;
                let newY = Math.round((initialNodeY + deltaY) / 10) * 10;

                // Limitar dentro del lienzo
                newX = Math.max(0, Math.min(canvasRect.width - (node.width || 120), newX));
                newY = Math.max(0, Math.min(canvasRect.height - 40, newY));

                node.posX = newX;
                node.posY = newY;

                container.style.left = `${newX}px`;
                container.style.top = `${newY}px`;
            }

            function onMouseUp() {
                document.removeEventListener("mousemove", onMouseMove);
                document.removeEventListener("mouseup", onMouseUp);
                saveHistory();
                renderCanvas({ preserveInspector: true });
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });
    }
}

// Redimensión en Modo Libre
function setupResizeHandle(handle, node, container) {
    handle.addEventListener("mousedown", (e) => {
        e.stopPropagation();
        e.preventDefault();

        const startX = e.clientX;
        const startY = e.clientY;
        const initialWidth = container.offsetWidth;
        const initialHeight = container.offsetHeight;

        function onMouseMove(moveEvent) {
            const newWidth = Math.max(80, initialWidth + (moveEvent.clientX - startX));
            const newHeight = Math.max(20, initialHeight + (moveEvent.clientY - startY));

            node.width = Math.round(newWidth / 10) * 10;
            if (node.type === "image") {
                node.height = Math.round(newHeight / 10) * 10;
            }

            container.style.width = `${node.width}px`;
            if (node.type === "image") {
                container.style.height = `${node.height}px`;
            }
        }

        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            saveHistory();
            renderCanvas({ preserveInspector: true });
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

function updateStatusBadge() {
    const badge = document.getElementById("statusBadge");
    if (!badge) return;
    const total = AppState.project.nodes.length;
    badge.textContent = `${total} elemento${total === 1 ? "" : "s"} en el lienzo`;
}