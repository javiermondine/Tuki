// ============================================
// SISTEMA DE ZONAS
// Gestiona las diferentes zonas del juego con sus características únicas
// ============================================

class Zone {
    constructor(name, config) {
        this.name = name;
        this.icon = config.icon;
        this.displayName = config.displayName;
        this.skyColor = config.skyColor;
        this.groundColor = config.groundColor;
        this.roadColor = config.roadColor;
        this.treeColor = config.treeColor;
        this.ambientSound = config.ambientSound;
        this.itemTypes = config.itemTypes;
        this.npcTypes = config.npcTypes;
        this.description = config.description;
    }

    // Generar items específicos de esta zona
    generateItems(count) {
        const items = [];
        const canvas = document.getElementById('gameCanvas');
        
        for (let i = 0; i < count; i++) {
            const itemConfig = this.itemTypes[Math.floor(Math.random() * this.itemTypes.length)];
            const x = Math.random() * (canvas.width - 50) + 25;
            const y = Math.random() * (canvas.height - 150) + 50;
            
            items.push(new Item(x, y, itemConfig.icon, itemConfig.name, itemConfig.points, itemConfig.type));
        }
        
        return items;
    }

    // Generar NPCs específicos de esta zona
    generateNPCs(count) {
        const npcsArray = [];
        const canvas = document.getElementById('gameCanvas');
        
        for (let i = 0; i < count; i++) {
            const npcConfig = this.npcTypes[Math.floor(Math.random() * this.npcTypes.length)];
            const x = Math.random() * (canvas.width - 100) + 50;
            const y = Math.random() * (canvas.height - 200) + 80;
            
            npcsArray.push(new NPC(x, y, npcConfig.name, npcConfig.icon, npcConfig.dialogs, npcConfig.color));
        }
        
        return npcsArray;
    }

    // Dibujar fondo específico de la zona
    drawBackground(ctx, canvas, dayNightCycle) {
        // Cielo con gradiente según hora del día
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const timeColor = dayNightCycle.getSkyColor();
        gradient.addColorStop(0, timeColor);
        gradient.addColorStop(1, this.skyColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Elementos específicos según zona
        this.drawZoneElements(ctx, canvas);

        // Suelo
        ctx.fillStyle = this.groundColor;
        ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

        // Calle/camino
        ctx.fillStyle = this.roadColor;
        ctx.fillRect(canvas.width / 2 - 60, 0, 120, canvas.height);

        // Líneas del camino
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Dibujar elementos específicos de cada zona
    drawZoneElements(ctx, canvas) {
        // Implementado por cada zona específica
    }
}

// ============================================
// DEFINICIÓN DE LAS 5 ZONAS
// ============================================

const ZONES = {
    forest: new Zone('forest', {
        icon: '🌲',
        displayName: 'Bosque',
        skyColor: '#87CEEB',
        groundColor: '#4a7c2c',
        roadColor: '#8B7355',
        treeColor: '#2d5016',
        ambientSound: 'birds',
        description: 'Un frondoso bosque lleno de vida',
        itemTypes: [
            { icon: '🍄', name: 'Seta', points: 10, type: 'plant' },
            { icon: '🌿', name: 'Hierba medicinal', points: 15, type: 'plant' },
            { icon: '🍂', name: 'Hojas', points: 5, type: 'plant' },
            { icon: '🌰', name: 'Bellota', points: 8, type: 'food' },
            { icon: '🪵', name: 'Leña', points: 12, type: 'resource' }
        ],
        npcTypes: [
            {
                name: 'Guardabosques',
                icon: '🧑‍🌾',
                color: '#4a7c2c',
                dialogs: [
                    { text: '¡Hola scout! Este bosque necesita cuidado. ¿Puedes ayudarme a recolectar?', next: null },
                    { text: 'Los árboles son el pulmón de nuestro planeta. Cuídalos siempre.', next: null }
                ]
            },
            {
                name: 'Explorador Veterano',
                icon: '🧙',
                color: '#654321',
                dialogs: [
                    { text: 'He explorado este bosque por años. Tiene muchos secretos...', next: null },
                    { text: '¿Sabías que hay 5 zonas diferentes para descubrir?', next: null }
                ]
            }
        ]
    }),

    mountains: new Zone('mountains', {
        icon: '⛰️',
        displayName: 'Montañas',
        skyColor: '#B0C4DE',
        groundColor: '#8B8680',
        roadColor: '#696969',
        treeColor: '#5F5F5F',
        ambientSound: 'wind',
        description: 'Majestuosas montañas nevadas',
        itemTypes: [
            { icon: '💎', name: 'Cristal', points: 25, type: 'mineral' },
            { icon: '🪨', name: 'Roca especial', points: 15, type: 'mineral' },
            { icon: '❄️', name: 'Hielo', points: 10, type: 'resource' },
            { icon: '🏔️', name: 'Fósil', points: 30, type: 'mineral' },
            { icon: '🦅', name: 'Pluma de águila', points: 20, type: 'animal' }
        ],
        npcTypes: [
            {
                name: 'Montañista',
                icon: '🧗',
                color: '#696969',
                dialogs: [
                    { text: '¡Las vistas desde aquí son increíbles! La perseverancia te trajo hasta aquí.', next: null },
                    { text: 'En la montaña aprendes a valorar cada paso. ¡Sigue escalando!', next: null }
                ]
            },
            {
                name: 'Ermitaño Sabio',
                icon: '🧘',
                color: '#DEB887',
                dialogs: [
                    { text: 'He meditado en estas montañas por décadas. La paz interior es clave.', next: null },
                    { text: 'Las rocas guardan historias de millones de años...', next: null }
                ]
            }
        ]
    }),

    village: new Zone('village', {
        icon: '🏘️',
        displayName: 'Pueblo',
        skyColor: '#FFD700',
        groundColor: '#DEB887',
        roadColor: '#696969',
        treeColor: '#8B4513',
        ambientSound: 'village',
        description: 'Un acogedor pueblo scout',
        itemTypes: [
            { icon: '📦', name: 'Suministros', points: 15, type: 'resource' },
            { icon: '🍞', name: 'Pan', points: 10, type: 'food' },
            { icon: '🥕', name: 'Verduras', points: 12, type: 'food' },
            { icon: '📜', name: 'Mapa antiguo', points: 20, type: 'tool' },
            { icon: '🏺', name: 'Artesanía', points: 18, type: 'craft' }
        ],
        npcTypes: [
            {
                name: 'Aldeana',
                icon: '👩‍🌾',
                color: '#CD853F',
                dialogs: [
                    { text: '¡Bienvenido al pueblo! Aquí todos nos ayudamos. ¿Necesitas algo?', next: null },
                    { text: 'El mercado tiene provisiones frescas cada mañana.', next: null }
                ]
            },
            {
                name: 'Herrero',
                icon: ''worker'',
                color: '#8B4513',
                dialogs: [
                    { text: 'Puedo reparar tus herramientas. El trabajo duro siempre vale la pena.', next: null },
                    { text: 'Cada herramienta tiene su propósito. Úsalas sabiamente.', next: null }
                ]
            },
            {
                name: 'Maestro Scout',
                icon: '👨‍🏫',
                color: '#4169E1',
                dialogs: [
                    { text: 'Cada insignia representa un logro. ¡Sigue esforzándote!', next: null },
                    { text: 'La ley scout nos guía en todo momento. ¿La recuerdas?', next: null }
                ]
            }
        ]
    }),

    lake: new Zone('lake', {
        icon: '🏞️',
        displayName: 'Lago',
        skyColor: '#87CEEB',
        groundColor: '#90EE90',
        roadColor: '#D2B48C',
        treeColor: '#228B22',
        ambientSound: 'water',
        description: 'Un tranquilo lago cristalino',
        itemTypes: [
            { icon: '🐟', name: 'Pez', points: 20, type: 'animal' },
            { icon: '🦆', name: 'Pluma de pato', points: 10, type: 'animal' },
            { icon: '🪷', name: 'Lirio de agua', points: 15, type: 'flower' },
            { icon: '🦪', name: 'Concha', points: 12, type: 'mineral' },
            { icon: '🎣', name: 'Caña de pescar', points: 18, type: 'tool' }
        ],
        npcTypes: [
            {
                name: 'Pescador',
                icon: '🎣',
                color: '#4682B4',
                dialogs: [
                    { text: 'La paciencia es clave en la pesca. También en la vida.', next: null },
                    { text: 'Este lago es el más puro de toda la región. Cuidémoslo.', next: null }
                ]
            },
            {
                name: 'Biólogo Marino',
                icon: '🧑‍🔬',
                color: '#20B2AA',
                dialogs: [
                    { text: 'Estudio los ecosistemas acuáticos. ¡Son fascinantes!', next: null },
                    { text: 'Cada especie tiene su rol. El equilibrio es vital.', next: null }
                ]
            }
        ]
    }),

    meadow: new Zone('meadow', {
        icon: '🌾',
        displayName: 'Pradera',
        skyColor: '#FFD700',
        groundColor: '#90EE90',
        roadColor: '#D2B48C',
        treeColor: '#32CD32',
        ambientSound: 'wind',
        description: 'Una vasta pradera dorada',
        itemTypes: [
            { icon: '🌻', name: 'Girasol', points: 15, type: 'flower' },
            { icon: '🌾', name: 'Trigo', points: 10, type: 'plant' },
            { icon: '🦋', name: 'Mariposa', points: 12, type: 'animal' },
            { icon: '🐝', name: 'Miel', points: 20, type: 'food' },
            { icon: '🌼', name: 'Flor silvestre', points: 8, type: 'flower' }
        ],
        npcTypes: [
            {
                name: 'Granjero',
                icon: '👨‍🌾',
                color: '#DAA520',
                dialogs: [
                    { text: 'La tierra nos da todo. Hay que cuidarla con respeto.', next: null },
                    { text: 'Cada estación tiene su belleza. La pradera nunca duerme.', next: null }
                ]
            },
            {
                name: 'Apicultor',
                icon: '🧑‍🌾',
                color: '#FFD700',
                dialogs: [
                    { text: 'Las abejas son esenciales para la vida. ¡Sin ellas no habría flores!', next: null },
                    { text: 'La miel es oro líquido. La naturaleza es sabia.', next: null }
                ]
            }
        ]
    })
};

// Función helper para obtener zona por nombre
function getZone(zoneName) {
    return ZONES[zoneName] || ZONES.forest;
}

// Exportar para uso en el juego principal
window.Zone = Zone;
window.ZONES = ZONES;
window.getZone = getZone;
