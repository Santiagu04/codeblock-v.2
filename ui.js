/* ==========================================================================
   WEBBLOCKS 2.0 · USER INTERFACE & INSPECTOR CONTROLLER
   ========================================================================== */

function renderInspector() {
    const container = document.getElementById("inspectorContent");
    if (!container) return;

    container.innerHTML = "";
    const node = getSelectedNode();

    if (!node) {
        container.innerHTML = `
            <div class="empty-inspector">
                <div class="empty-inspector-icon">👆</div>
                <p><strong>Ningún bloque seleccionado</strong></p>
                <p>Haz clic en cualquier elemento del lienzo para modificar su texto, color, tamaño, grosor y opciones.</p>
            </div>
        `;
        return;
    }

    const p = node.properties || {};

    // 1. TÍTULO Y TIPO DE BLOQUE
    const headerGroup = document.createElement("div");
    headerGroup.className = "prop-group";
    headerGroup.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:15px; display:flex; align-items:center; gap:6px;">
                <span>${node.icon || '🧱'}</span> ${node.label || node.type}
            </strong>
            <span style="font-size:11px; background:#eef2ff; color:#4f46e5; padding:2px 8px; border-radius:99px; font-weight:700;">#${node.id}</span>
        </div>
    `;
    container.appendChild(headerGroup);

    // =========================================================================
    // BLOQUE INTERACTIVO: PREGUNTA ➔ VARIABLE ➔ CONDICIÓN (JS)
    // =========================================================================
    if (node.type === "question_condition") {
        const logicGroup = document.createElement("div");
        logicGroup.className = "prop-group";
        logicGroup.innerHTML = `<span class="prop-group-title">Configuración de Pregunta & Condición</span>`;

        logicGroup.appendChild(createTextControl("1. Pregunta que se le hará al usuario:", p.question || "¿Cuántos años tienes?", (val) => {
            p.question = val;
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createTextControl("2. Nombre de la variable (donde se guarda la respuesta):", p.variableName || "edad", (val) => {
            p.variableName = val.replace(/\s+/g, "_");
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createSelectControl("3. Operador de comparación:", [
            { id: ">=", label: ">=  (Mayor o igual que)" },
            { id: "<=", label: "<=  (Menor o igual que)" },
            { id: "==", label: "==  (Igual que)" },
            { id: "!=", label: "!=  (Diferente de)" },
            { id: ">",  label: ">   (Mayor que)" },
            { id: "<",  label: "<   (Menor que)" }
        ], p.operator || ">=", (val) => {
            p.operator = val;
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createTextControl("4. Valor para que se cumpla la condición:", p.targetValue || "18", (val) => {
            p.targetValue = val;
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createTextControl("5. Respuesta si se cumple la condición (Éxito):", p.successMessage || "¡Eres mayor de edad! Acceso permitido 🎉", (val) => {
            p.successMessage = val;
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createTextControl("6. Respuesta si NO se cumple la condición:", p.failMessage || "Aún eres menor de edad.", (val) => {
            p.failMessage = val;
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createTextControl("7. Texto del Botón:", p.buttonText || "Verificar Edad", (val) => {
            p.buttonText = val;
            renderCanvas({ preserveInspector: true });
        }));

        logicGroup.appendChild(createColorControl("Color del Botón:", p.buttonColor || "#4f46e5", (val) => {
            p.buttonColor = val;
            renderCanvas({ preserveInspector: true });
        }));

        container.appendChild(logicGroup);
    }

    // =========================================================================
    // BLOQUES VISUALES (HTML)
    // =========================================================================
    else {
        // 2. CONTENIDO (Texto, Título, Imagen...)
        const contentGroup = document.createElement("div");
        contentGroup.className = "prop-group";
        contentGroup.innerHTML = `<span class="prop-group-title">Contenido</span>`;

        if ("text" in p) {
            contentGroup.appendChild(createTextControl("Texto del elemento", p.text, (val) => {
                p.text = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("title" in p) {
            contentGroup.appendChild(createTextControl("Título", p.title, (val) => {
                p.title = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("src" in p) {
            contentGroup.appendChild(createTextControl("Enlace de la imagen (URL)", p.src, (val) => {
                p.src = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("placeholder" in p) {
            contentGroup.appendChild(createTextControl("Texto de ayuda (Placeholder)", p.placeholder, (val) => {
                p.placeholder = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("label" in p && node.type === "input") {
            contentGroup.appendChild(createTextControl("Etiqueta del campo", p.label, (val) => {
                p.label = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if (contentGroup.children.length > 1) {
            container.appendChild(contentGroup);
        }

        // 3. APARIENCIA, COLORES Y GROSOR
        const styleGroup = document.createElement("div");
        styleGroup.className = "prop-group";
        styleGroup.innerHTML = `<span class="prop-group-title">Diseño & Estilo</span>`;

        // SEPARADOR ESPECÍFICO: COLOR Y GROSOR
        if (node.type === "divider") {
            styleGroup.appendChild(createColorControl("Color del Separador", p.color || "#4f46e5", (val) => {
                p.color = val;
                renderCanvas({ preserveInspector: true });
            }, COLOR_PRESETS.divider));

            styleGroup.appendChild(createSliderControl("Grosor del Separador", p.thickness || 3, 1, 20, "px", (val) => {
                p.thickness = val;
                renderCanvas({ preserveInspector: true });
            }));

            styleGroup.appendChild(createSliderControl("Espacio de separación (Margen)", p.margin || 16, 4, 60, "px", (val) => {
                p.margin = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        // OTROS ELEMENTOS VISUALES
        if ("color" in p || "textColor" in p) {
            const key = "color" in p ? "color" : "textColor";
            styleGroup.appendChild(createColorControl("Color del Texto", p[key], (val) => {
                p[key] = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("background" in p && node.type !== "divider") {
            styleGroup.appendChild(createColorControl("Color de Fondo", p.background, (val) => {
                p.background = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("fontSize" in p) {
            styleGroup.appendChild(createSliderControl("Tamaño de Fuente", p.fontSize, 12, 64, "px", (val) => {
                p.fontSize = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("align" in p) {
            styleGroup.appendChild(createAlignControl("Alineación", p.align, (val) => {
                p.align = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("borderRadius" in p && node.type !== "divider") {
            styleGroup.appendChild(createSliderControl("Bordes Redondeados", p.borderRadius, 0, 40, "px", (val) => {
                p.borderRadius = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        if ("paddingY" in p && node.type === "button") {
            styleGroup.appendChild(createSliderControl("Relleno Vertical (Padding)", p.paddingY, 6, 30, "px", (val) => {
                p.paddingY = val;
                renderCanvas({ preserveInspector: true });
            }));
        }

        container.appendChild(styleGroup);
    }

    // 4. POSICIÓN Y DIMENSIONES (Modo Libre)
    if (AppState.canvasMode === "free") {
        const posGroup = document.createElement("div");
        posGroup.className = "prop-group";
        posGroup.innerHTML = `<span class="prop-group-title">Posición en el Lienzo</span>`;

        const coordsRow = document.createElement("div");
        coordsRow.style.display = "grid";
        coordsRow.style.gridTemplateColumns = "1fr 1fr";
        coordsRow.style.gap = "10px";

        coordsRow.appendChild(createNumberControl("Posición X", node.posX || 0, (val) => {
            node.posX = val;
            renderCanvas({ preserveInspector: true });
        }));

        coordsRow.appendChild(createNumberControl("Posición Y", node.posY || 0, (val) => {
            node.posY = val;
            renderCanvas({ preserveInspector: true });
        }));

        posGroup.appendChild(coordsRow);
        container.appendChild(posGroup);
    }

    // 5. BOTÓN ELIMINAR BLOQUE
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger-outline";
    deleteBtn.style.width = "100%";
    deleteBtn.style.marginTop = "14px";
    deleteBtn.innerHTML = "🗑 Eliminar este bloque";
    deleteBtn.addEventListener("click", () => {
        removeNode(node.id);
        renderCanvas();
        renderInspector();
    });
    container.appendChild(deleteBtn);
}

/* ==========================================================================
   COMPONENTES DE CONTROL PARA EL INSPECTOR
   ========================================================================== */

function createTextControl(label, value, onChange) {
    const row = document.createElement("div");
    row.className = "prop-row";

    const lbl = document.createElement("label");
    lbl.textContent = label;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "prop-input";
    input.value = value || "";

    input.addEventListener("input", (e) => onChange(e.target.value));

    row.appendChild(lbl);
    row.appendChild(input);
    return row;
}

function createNumberControl(label, value, onChange) {
    const row = document.createElement("div");
    row.className = "prop-row";

    const lbl = document.createElement("label");
    lbl.textContent = label;

    const input = document.createElement("input");
    input.type = "number";
    input.className = "prop-input";
    input.value = value || 0;

    input.addEventListener("input", (e) => onChange(Number(e.target.value)));

    row.appendChild(lbl);
    row.appendChild(input);
    return row;
}

function createSelectControl(label, options, selectedValue, onChange) {
    const row = document.createElement("div");
    row.className = "prop-row";

    const lbl = document.createElement("label");
    lbl.textContent = label;

    const select = document.createElement("select");
    select.className = "prop-select";

    options.forEach(opt => {
        const option = document.createElement("option");
        option.value = opt.id;
        option.textContent = opt.label;
        if (opt.id === selectedValue) option.selected = true;
        select.appendChild(option);
    });

    select.addEventListener("change", (e) => onChange(e.target.value));

    row.appendChild(lbl);
    row.appendChild(select);
    return row;
}

function createSliderControl(label, value, min, max, unit, onChange) {
    const row = document.createElement("div");
    row.className = "prop-row";

    const lbl = document.createElement("label");
    lbl.textContent = label;

    const wrap = document.createElement("div");
    wrap.className = "range-wrapper";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "range-slider";
    slider.min = min;
    slider.max = max;
    slider.value = value || min;

    const valBadge = document.createElement("span");
    valBadge.className = "range-value";
    valBadge.textContent = `${slider.value}${unit}`;

    slider.addEventListener("input", (e) => {
        valBadge.textContent = `${e.target.value}${unit}`;
        onChange(Number(e.target.value));
    });

    wrap.appendChild(slider);
    wrap.appendChild(valBadge);
    row.appendChild(lbl);
    row.appendChild(wrap);
    return row;
}

function createColorControl(label, currentColor, onChange, customPalette = null) {
    const row = document.createElement("div");
    row.className = "prop-row";

    const lbl = document.createElement("label");
    lbl.textContent = label;

    const wrap = document.createElement("div");
    wrap.className = "color-input-wrapper";

    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.className = "color-picker";
    colorPicker.value = currentColor?.startsWith("#") ? currentColor : "#4f46e5";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.className = "prop-input";
    textInput.value = currentColor || "#4f46e5";

    colorPicker.addEventListener("input", (e) => {
        textInput.value = e.target.value;
        onChange(e.target.value);
    });

    textInput.addEventListener("input", (e) => {
        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
            colorPicker.value = e.target.value;
        }
        onChange(e.target.value);
    });

    wrap.appendChild(colorPicker);
    wrap.appendChild(textInput);
    row.appendChild(lbl);
    row.appendChild(wrap);

    // Paletas sugeridas con 1 clic
    const swatches = document.createElement("div");
    swatches.className = "palette-swatches";
    const paletteToUse = customPalette || COLOR_PRESETS.modern.concat(COLOR_PRESETS.pastel).slice(0, 12);
    paletteToUse.forEach(color => {
        const swatch = document.createElement("button");
        swatch.className = "swatch-btn";
        swatch.style.backgroundColor = color;
        swatch.type = "button";
        swatch.title = color;
        swatch.addEventListener("click", () => {
            colorPicker.value = color;
            textInput.value = color;
            onChange(color);
        });
        swatches.appendChild(swatch);
    });
    row.appendChild(swatches);

    return row;
}

function createAlignControl(label, currentAlign, onChange) {
    const row = document.createElement("div");
    row.className = "prop-row";

    const lbl = document.createElement("label");
    lbl.textContent = label;

    const group = document.createElement("div");
    group.className = "align-group";

    const options = [
        { id: "left", label: "⬅ Izquierda" },
        { id: "center", label: "⏸ Centro" },
        { id: "right", label: "➡ Derecha" }
    ];

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `align-btn ${currentAlign === opt.id ? 'active' : ''}`;
        btn.textContent = opt.label;
        btn.addEventListener("click", () => {
            group.querySelectorAll(".align-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            onChange(opt.id);
        });
        group.appendChild(btn);
    });

    row.appendChild(lbl);
    row.appendChild(group);
    return row;
}

/* ==========================================================================
   MODAL DE CÓDIGO GENERADO
   ========================================================================== */
function openCodeModal() {
    updateCodeOutput();
    document.getElementById("codeModal")?.showModal();
}

function updateCodeOutput() {
    const codeEl = document.getElementById("codeOutput");
    if (!codeEl) return;

    if (AppState.codeTab === "html") {
        codeEl.textContent = generateHTML();
    } else if (AppState.codeTab === "css") {
        codeEl.textContent = generateCSS();
    } else if (AppState.codeTab === "js") {
        codeEl.textContent = generateJS();
    }

    document.querySelectorAll(".code-tabs .tab").forEach(tab => {
        tab.classList.toggle("active", tab.dataset.codeTab === AppState.codeTab);
    });
}

/* ==========================================================================
   MODAL DE VISTA PREVIA MULTIDISPOSITIVO
   ========================================================================== */
function openPreview() {
    const html = generateHTML();
    const css = generateCSS();
    const js = generateJS();

    const fullDoc = html
        .replace(/<link\b[^>]*href=["']style\.css["'][^>]*>/i, `<style>${css}</style>`)
        .replace(/<script\b[^>]*src=["']script\.js["'][^>]*><\/script>/i, `<script>${js}<\/script>`);

    const frame = document.getElementById("previewFrame");
    if (frame) frame.srcdoc = fullDoc;

    document.getElementById("previewModal")?.showModal();
}

function setPreviewDevice(device) {
    AppState.previewDevice = device;
    const frame = document.getElementById("deviceFrame");
    if (frame) {
        frame.className = `device-frame ${device}`;
    }
    document.querySelectorAll(".device-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.device === device);
    });
}

/* ==========================================================================
   DESCARGA Y EXPORTACIÓN
   ========================================================================== */
function downloadProjectFile(filename, content) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerHTML = `<span>✨</span> ${message}`;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}