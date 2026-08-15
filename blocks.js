/* ==========================================================================
   WEBBLOCKS 2.0 · BLOCK REGISTRY & DEFINITIONS
   ========================================================================== */

const BLOCK_REGISTRY = {
    /*
    ========================================
    ELEMENTOS VISUALES (HTML)
    ========================================
    */

    heading: {
        category: "html",
        label: "Título Principal (H1)",
        icon: "H1",
        create(posX = 40, posY = 40) {
            return {
                id: generateId("titulo"),
                type: "heading",
                category: "html",
                label: "Título Principal (H1)",
                posX: posX,
                posY: posY,
                width: 520,
                height: "auto",
                zIndex: 1,
                properties: {
                    text: "🧱 ¡Mi Primera Página Web!",
                    color: "#1e293b",
                    fontSize: 34,
                    align: "center",
                    fontWeight: 800,
                    margin: 10
                }
            };
        }
    },

    subheading: {
        category: "html",
        label: "Subtítulo (H2)",
        icon: "H2",
        create(posX = 40, posY = 110) {
            return {
                id: generateId("subtitulo"),
                type: "subheading",
                category: "html",
                label: "Subtítulo (H2)",
                posX: posX,
                posY: posY,
                width: 480,
                height: "auto",
                zIndex: 1,
                properties: {
                    text: "Creando mi primer sitio web sin programar",
                    color: "#4f46e5",
                    fontSize: 22,
                    align: "center",
                    fontWeight: 700,
                    margin: 8
                }
            };
        }
    },

    paragraph: {
        category: "html",
        label: "Párrafo de Texto",
        icon: "P",
        create(posX = 40, posY = 170) {
            return {
                id: generateId("texto"),
                type: "paragraph",
                category: "html",
                label: "Párrafo de Texto",
                posX: posX,
                posY: posY,
                width: 480,
                height: "auto",
                zIndex: 1,
                properties: {
                    text: "Esta página fue construida fácilmente combinando bloques visuales y condiciones en JavaScript.",
                    color: "#475569",
                    fontSize: 16,
                    align: "center",
                    lineHeight: 1.6,
                    margin: 10
                }
            };
        }
    },

    button: {
        category: "html",
        label: "Botón de Acción",
        icon: "BTN",
        create(posX = 180, posY = 250) {
            return {
                id: generateId("boton"),
                type: "button",
                category: "html",
                label: "Botón de Acción",
                posX: posX,
                posY: posY,
                width: 180,
                height: "auto",
                zIndex: 2,
                properties: {
                    text: "Haz Clic Aquí",
                    color: "#ffffff",
                    background: "#4f46e5",
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 12,
                    paddingY: 12,
                    paddingX: 24,
                    border: "none",
                    align: "center"
                }
            };
        }
    },

    image: {
        category: "html",
        label: "Imagen / Foto",
        icon: "IMG",
        create(posX = 40, posY = 330) {
            return {
                id: generateId("imagen"),
                type: "image",
                category: "html",
                label: "Imagen / Foto",
                posX: posX,
                posY: posY,
                width: 400,
                height: 220,
                zIndex: 1,
                properties: {
                    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80",
                    alt: "Espacio de trabajo creativo",
                    borderRadius: 16,
                    align: "center"
                }
            };
        }
    },

    card: {
        category: "html",
        label: "Tarjeta / Card",
        icon: "🎴",
        create(posX = 40, posY = 80) {
            return {
                id: generateId("tarjeta"),
                type: "card",
                category: "html",
                label: "Tarjeta Destacada",
                posX: posX,
                posY: posY,
                width: 380,
                height: "auto",
                zIndex: 1,
                properties: {
                    title: "🌟 Mi Proyecto Especial",
                    text: "Aquí puedes compartir información importante, un producto o tu presentación personal.",
                    background: "#ffffff",
                    textColor: "#0f172a",
                    titleColor: "#4f46e5",
                    borderColor: "#e2e8f0",
                    borderRadius: 16,
                    padding: 24
                }
            };
        }
    },

    badge: {
        category: "html",
        label: "Etiqueta / Badge",
        icon: "🏷",
        create(posX = 40, posY = 20) {
            return {
                id: generateId("etiqueta"),
                type: "badge",
                category: "html",
                label: "Etiqueta / Badge",
                posX: posX,
                posY: posY,
                width: 140,
                height: "auto",
                zIndex: 2,
                properties: {
                    text: "✨ NOVEDAD",
                    color: "#4f46e5",
                    background: "#eef2ff",
                    fontSize: 12,
                    fontWeight: 800,
                    borderRadius: 20,
                    paddingY: 4,
                    paddingX: 12
                }
            };
        }
    },

    input: {
        category: "html",
        label: "Campo de Texto",
        icon: "✏",
        create(posX = 40, posY = 240) {
            return {
                id: generateId("campo"),
                type: "input",
                category: "html",
                label: "Campo de Entrada",
                posX: posX,
                posY: posY,
                width: 280,
                height: "auto",
                zIndex: 1,
                properties: {
                    placeholder: "Escribe tu nombre aquí...",
                    label: "¿Cómo te llamas?",
                    color: "#0f172a",
                    background: "#ffffff",
                    borderColor: "#cbd5e1",
                    borderRadius: 10
                }
            };
        }
    },

    divider: {
        category: "html",
        label: "Separador Visual",
        icon: "―",
        create(posX = 40, posY = 145) {
            return {
                id: generateId("separador"),
                type: "divider",
                category: "html",
                label: "Separador Visual",
                posX: posX,
                posY: posY,
                width: 480,
                height: "auto",
                zIndex: 1,
                properties: {
                    color: "#4f46e5",
                    thickness: 3, // Grosor personalizable (1px a 20px)
                    margin: 16
                }
            };
        }
    },

    /*
    ========================================
    LÓGICA LIGADA: PREGUNTA ➔ VARIABLE ➔ CONDICIÓN (JS)
    ========================================
    */

    question_condition: {
        category: "logic",
        label: "Pregunta & Condición (JS)",
        icon: "⚡",
        create(posX = 40, posY = 240) {
            return {
                id: generateId("pregunta_condicion"),
                type: "question_condition",
                category: "logic",
                label: "Pregunta & Condición",
                posX: posX,
                posY: posY,
                width: 420,
                height: "auto",
                zIndex: 2,
                properties: {
                    question: "¿Cuántos años tienes?",
                    variableName: "edad",
                    operator: ">=",
                    targetValue: "18",
                    successMessage: "¡Eres mayor de edad! Acceso permitido 🎉",
                    failMessage: "Aún eres menor de edad.",
                    buttonText: "Verificar Edad",
                    buttonColor: "#4f46e5"
                }
            };
        }
    }
};

// Paletas de colores prearmadas para principiantes
const COLOR_PRESETS = {
    modern: ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#0f172a", "#ffffff"],
    pastel: ["#e0e7ff", "#cffafe", "#d1fae5", "#fef3c7", "#fee2e2", "#f1f5f9", "#ffffff"],
    ocean: ["#0284c7", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#0c4a6e", "#f0f9ff"],
    sunset: ["#e11d48", "#f43f5e", "#fb7185", "#f97316", "#fbbf24", "#881337", "#fff1f2"],
    divider: ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#cbd5e1", "#64748b", "#0f172a"]
};

// Función para crear un bloque a partir de su tipo
function createBlock(type, posX = 40, posY = 40) {
    const definition = BLOCK_REGISTRY[type];
    if (!definition) {
        console.error("Bloque no encontrado en el registro:", type);
        return null;
    }
    return definition.create(posX, posY);
}