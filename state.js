/* ==========================================================================
   WEBBLOCKS 2.0 · APPLICATION STATE & HISTORY MANAGEMENT
   ========================================================================== */

const AppState = {
    project: {
        version: "2.0",
        metadata: {
            name: "Mi primera página web",
            author: "Creador Web"
        },
        nodes: []
    },

    // UI & Canvas Controls
    selectedNodeId: null,
    canvasMode: "free", // "free" (posicionamiento libre) | "flow" (flujo normal)

    // Drag & Drop State
    draggedBlockType: null,
    draggedNodeId: null,
    isDraggingOnCanvas: false,
    dragOffset: { x: 0, y: 0 },

    // Modals
    codeTab: "html",
    previewDevice: "desktop",

    // Undo / Redo History
    history: [],
    historyIndex: -1,
    maxHistory: 30
};

// Generador de IDs únicos legibles
function generateId(prefix = "bloque") {
    const random = Math.random().toString(36).substring(2, 7);
    return `${prefix}_${random}`;
}

// Obtener el nodo actualmente seleccionado
function getSelectedNode() {
    return findNodeById(AppState.selectedNodeId, AppState.project.nodes);
}

// Buscar un nodo por ID de manera recursiva
function findNodeById(id, nodes = AppState.project.nodes) {
    if (!id || !Array.isArray(nodes)) return null;

    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children && node.children.length) {
            const found = findNodeById(id, node.children);
            if (found) return found;
        }
    }
    return null;
}

// Contar todos los nodos
function countNodes(nodes = AppState.project.nodes) {
    return nodes.reduce((total, node) => total + 1 + countNodes(node.children || []), 0);
}

// Guardar punto en el historial para Undo / Redo
function saveHistory() {
    // Truncar historial si estamos en medio de la pila
    if (AppState.historyIndex < AppState.history.length - 1) {
        AppState.history = AppState.history.slice(0, AppState.historyIndex + 1);
    }

    // Clonar estado de los nodos
    const snapshot = JSON.parse(JSON.stringify(AppState.project.nodes));
    AppState.history.push(snapshot);

    // Limitar tamaño máximo
    if (AppState.history.length > AppState.maxHistory) {
        AppState.history.shift();
    } else {
        AppState.historyIndex++;
    }

    updateUndoRedoButtons();
}

// Deshacer (Undo)
function undo() {
    if (AppState.historyIndex > 0) {
        AppState.historyIndex--;
        AppState.project.nodes = JSON.parse(JSON.stringify(AppState.history[AppState.historyIndex]));
        AppState.selectedNodeId = null;
        renderCanvas();
        updateUndoRedoButtons();
    }
}

// Rehacer (Redo)
function redo() {
    if (AppState.historyIndex < AppState.history.length - 1) {
        AppState.historyIndex++;
        AppState.project.nodes = JSON.parse(JSON.stringify(AppState.history[AppState.historyIndex]));
        AppState.selectedNodeId = null;
        renderCanvas();
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById("undoBtn");
    const redoBtn = document.getElementById("redoBtn");
    if (undoBtn) undoBtn.disabled = AppState.historyIndex <= 0;
    if (redoBtn) redoBtn.disabled = AppState.historyIndex >= AppState.history.length - 1;
}

// Añadir un nuevo nodo al proyecto
function addNode(node, parentId = null) {
    if (!node) return;

    if (parentId) {
        const parent = findNodeById(parentId, AppState.project.nodes);
        if (parent) {
            parent.children = parent.children || [];
            parent.children.push(node);
            node.parentId = parentId;
        } else {
            AppState.project.nodes.push(node);
            node.parentId = null;
        }
    } else {
        AppState.project.nodes.push(node);
        node.parentId = null;
    }

    AppState.selectedNodeId = node.id;
    saveHistory();
}

// Actualizar propiedades de un nodo
function updateNode(id, updates) {
    const node = findNodeById(id);
    if (!node) return;

    Object.assign(node, updates);
    saveHistory();
}

// Eliminar un nodo
function removeNode(id) {
    if (!id) return;
    const removed = removeNodeFromList(id, AppState.project.nodes);
    if (removed) {
        if (AppState.selectedNodeId === id) {
            AppState.selectedNodeId = null;
        }
        saveHistory();
    }
}

function removeNodeFromList(id, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
            return nodes.splice(i, 1)[0];
        }
        if (node.children && node.children.length) {
            const found = removeNodeFromList(id, node.children);
            if (found) return found;
        }
    }
    return null;
}

// Duplicar un nodo
function duplicateNode(id) {
    const original = findNodeById(id);
    if (!original) return;

    const cloned = JSON.parse(JSON.stringify(original));
    cloned.id = generateId(original.type);
    cloned.posX = (cloned.posX || 20) + 30;
    cloned.posY = (cloned.posY || 20) + 30;
    
    AppState.project.nodes.push(cloned);
    AppState.selectedNodeId = cloned.id;
    saveHistory();
    renderCanvas();
}

// Traer nodo al frente (subir z-index)
function bringNodeToFront(id) {
    const node = findNodeById(id);
    if (!node) return;

    let maxZ = 1;
    AppState.project.nodes.forEach(n => {
        if (n.zIndex && n.zIndex > maxZ) maxZ = n.zIndex;
    });
    node.zIndex = maxZ + 1;
    saveHistory();
    renderCanvas();
}

// Enviar nodo al fondo (bajar z-index)
function sendNodeToBack(id) {
    const node = findNodeById(id);
    if (!node) return;

    let minZ = 1;
    AppState.project.nodes.forEach(n => {
        if (n.zIndex && n.zIndex < minZ) minZ = n.zIndex;
    });
    node.zIndex = Math.max(1, minZ - 1);
    saveHistory();
    renderCanvas();
}

// Limpiar todo el proyecto
function clearProject() {
    AppState.project.nodes = [];
    AppState.selectedNodeId = null;
    saveHistory();
}