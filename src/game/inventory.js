// ============================================
// SISTEMA DE INVENTARIO
// ============================================

class Inventory {
    constructor() {
        this.items = [];
        this.maxSlots = 12;
        this.selectedSlot = 0;
        this.visible = false;
    }

    // Agregar item
    addItem(item) {
        // Verificar si ya existe (stackeable)
        const existing = this.items.find(i => i.id === item.id && i.stackable);
        if (existing) {
            existing.quantity += item.quantity || 1;
            showMessage(`'bag' ${item.name} agregado al inventario (${existing.quantity})`);
        } else if (this.items.length < this.maxSlots) {
            this.items.push({
                ...item,
                quantity: item.quantity || 1
            });
            showMessage(`'bag' ${item.name} agregado al inventario`);
        } else {
            showMessage('⚠️ Inventario lleno');
            return false;
        }
        return true;
    }

    // Remover item
    removeItem(itemId, quantity = 1) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity -= quantity;
            if (item.quantity <= 0) {
                const index = this.items.indexOf(item);
                this.items.splice(index, 1);
            }
            return true;
        }
        return false;
    }

    // Usar item
    useItem(index) {
        if (index >= 0 && index < this.items.length) {
            const item = this.items[index];
            if (item.onUse) {
                item.onUse();
                if (item.consumable) {
                    this.removeItem(item.id, 1);
                }
                return true;
            }
        }
        return false;
    }

    // Verificar si tiene item
    hasItem(itemId) {
        return this.items.some(i => i.id === itemId);
    }

    // Obtener cantidad de item
    getItemQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    }

    // Toggle visibilidad
    toggle() {
        this.visible = !this.visible;
    }

    // Dibujar inventario
    draw(ctx, canvasWidth, canvasHeight) {
        if (!this.visible) {
            // Mostrar solo items equipados en barra rápida
            this.drawQuickBar(ctx, canvasWidth, canvasHeight);
            return;
        }

        ctx.save();

        // Fondo semi-transparente
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Panel de inventario
        const panelWidth = 480;
        const panelHeight = 400;
        const panelX = (canvasWidth - panelWidth) / 2;
        const panelY = (canvasHeight - panelHeight) / 2;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 4;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);

        // Título
        ctx.fillStyle = '#2d5016';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('🎒 Inventario', panelX + 20, panelY + 35);

        // Instrucciones
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666';
        ctx.fillText('ESC para cerrar | 1-9 para usar item | Click para seleccionar', panelX + 20, panelY + 60);

        // Grid de items
        const slotSize = 70;
        const slotsPerRow = 6;
        const startX = panelX + 20;
        const startY = panelY + 80;

        for (let i = 0; i < this.maxSlots; i++) {
            const row = Math.floor(i / slotsPerRow);
            const col = i % slotsPerRow;
            const x = startX + col * (slotSize + 5);
            const y = startY + row * (slotSize + 5);

            // Slot
            ctx.fillStyle = i === this.selectedSlot ? 'rgba(74, 124, 44, 0.2)' : 'rgba(200, 200, 200, 0.3)';
            ctx.fillRect(x, y, slotSize, slotSize);
            ctx.strokeStyle = i === this.selectedSlot ? '#4a7c2c' : '#999';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, slotSize, slotSize);

            // Item
            if (i < this.items.length) {
                const item = this.items[i];
                
                // Icono
                ctx.font = '32px Arial';
                ctx.fillText(item.icon, x + 20, y + 40);

                // Cantidad
                if (item.quantity > 1) {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(x + 45, y + 45, 20, 20);
                    ctx.fillStyle = '#000';
                    ctx.font = 'bold 12px Arial';
                    ctx.fillText(item.quantity, x + 50, y + 60);
                }
            }

            // Número de slot
            ctx.fillStyle = '#666';
            ctx.font = '10px Arial';
            ctx.fillText(i + 1, x + 5, y + 12);
        }

        // Descripción del item seleccionado
        if (this.selectedSlot < this.items.length) {
            const item = this.items[this.selectedSlot];
            const descY = panelY + panelHeight - 80;

            ctx.fillStyle = 'rgba(74, 124, 44, 0.1)';
            ctx.fillRect(panelX + 20, descY, panelWidth - 40, 60);

            ctx.fillStyle = '#2d5016';
            ctx.font = 'bold 16px Arial';
            ctx.fillText(`${item.icon} ${item.name}`, panelX + 30, descY + 20);

            ctx.fillStyle = '#666';
            ctx.font = '14px Arial';
            ctx.fillText(item.description, panelX + 30, descY + 40);
        }

        ctx.restore();
    }

    // Barra rápida (siempre visible)
    drawQuickBar(ctx, canvasWidth, canvasHeight) {
        const barWidth = 450;
        const barHeight = 60;
        const barX = (canvasWidth - barWidth) / 2;
        const barY = canvasHeight - barHeight - 10;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Primeros 6 slots
        const slotSize = 50;
        for (let i = 0; i < 6; i++) {
            const x = barX + 10 + i * (slotSize + 5);
            const y = barY + 5;

            ctx.fillStyle = i === this.selectedSlot ? 'rgba(255, 215, 0, 0.3)' : 'rgba(100, 100, 100, 0.3)';
            ctx.fillRect(x, y, slotSize, slotSize);
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, slotSize, slotSize);

            if (i < this.items.length) {
                const item = this.items[i];
                ctx.font = '24px Arial';
                ctx.fillText(item.icon, x + 13, y + 35);

                if (item.quantity > 1) {
                    ctx.fillStyle = '#fff';
                    ctx.font = 'bold 10px Arial';
                    ctx.fillText(item.quantity, x + 35, y + 45);
                }
            }

            // Número
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.fillText(i + 1, x + 5, y + 12);
        }

        // Texto de ayuda
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText('Presiona I para abrir inventario', barX + 350, barY + 35);

        ctx.restore();
    }

    // Manejar click
    handleClick(mouseX, mouseY, canvasWidth, canvasHeight) {
        if (!this.visible) return;

        const panelWidth = 480;
        const panelHeight = 400;
        const panelX = (canvasWidth - panelWidth) / 2;
        const panelY = (canvasHeight - panelHeight) / 2;

        const slotSize = 70;
        const slotsPerRow = 6;
        const startX = panelX + 20;
        const startY = panelY + 80;

        for (let i = 0; i < this.maxSlots; i++) {
            const row = Math.floor(i / slotsPerRow);
            const col = i % slotsPerRow;
            const x = startX + col * (slotSize + 5);
            const y = startY + row * (slotSize + 5);

            if (mouseX >= x && mouseX <= x + slotSize &&
                mouseY >= y && mouseY <= y + slotSize) {
                this.selectedSlot = i;
                if (i < this.items.length) {
                    playSound('click');
                }
                return true;
            }
        }
        return false;
    }
}

// ============================================
// ITEMS DISPONIBLES
// ============================================

const ITEM_TYPES = {
    compass: {
        id: 'compass',
        name: 'Brújula',
        description: 'Te ayuda a orientarte. Muestra el norte.',
        icon: '🧭',
        stackable: false,
        consumable: false,
        onUse: function() {
            showMessage('🧭 La brújula indica el norte');
            // Mostrar indicador de dirección
            if (window.showCompassIndicator) {
                window.showCompassIndicator = true;
                setTimeout(() => window.showCompassIndicator = false, 5000);
            }
        }
    },
    flashlight: {
        id: 'flashlight',
        name: 'Linterna',
        description: 'Ilumina el camino en la noche.',
        icon: '🔦',
        stackable: false,
        consumable: false,
        onUse: function() {
            if (window.dayNightCycle && window.dayNightCycle.isNight()) {
                showMessage('🔦 Linterna encendida');
                window.flashlightOn = !window.flashlightOn;
            } else {
                showMessage('⚠️ No necesitas la linterna de día');
            }
        }
    },
    rope: {
        id: 'rope',
        name: 'Cuerda',
        description: 'Útil para escalar o hacer nudos.',
        icon: '🪢',
        stackable: true,
        consumable: false,
        onUse: function() {
            showMessage('🪢 Cuerda equipada. Puedes escalar lugares altos.');
            window.canClimb = true;
        }
    },
    map: {
        id: 'map',
        name: 'Mapa',
        description: 'Muestra el mapa del mundo.',
        icon: '🗺️',
        stackable: false,
        consumable: false,
        onUse: function() {
            showMessage('🗺️ Consultando el mapa...');
            window.showMap = !window.showMap;
        }
    },
    firstAid: {
        id: 'firstAid',
        name: 'Botiquín',
        description: 'Restaura 50 de energía.',
        icon: '🩹',
        stackable: true,
        consumable: true,
        onUse: function() {
            if (window.scout) {
                window.scout.energy = Math.min(window.scout.maxEnergy, window.scout.energy + 50);
                showMessage('🩹 +50 energía restaurada');
                playSound('heal');
            }
        }
    },
    water: {
        id: 'water',
        name: 'Cantimplora',
        description: 'Restaura 30 de energía.',
        icon: '💧',
        stackable: true,
        consumable: true,
        onUse: function() {
            if (window.scout) {
                window.scout.energy = Math.min(window.scout.maxEnergy, window.scout.energy + 30);
                showMessage('💧 +30 energía restaurada');
                playSound('drink');
            }
        }
    },
    food: {
        id: 'food',
        name: 'Comida de Campamento',
        description: 'Restaura 40 de energía.',
        icon: '🍖',
        stackable: true,
        consumable: true,
        onUse: function() {
            if (window.scout) {
                window.scout.energy = Math.min(window.scout.maxEnergy, window.scout.energy + 40);
                showMessage('🍖 +40 energía restaurada');
                playSound('eat');
            }
        }
    },
    whistle: {
        id: 'whistle',
        name: 'Silbato',
        description: 'Llama a otros scouts cercanos.',
        icon: '📣',
        stackable: false,
        consumable: false,
        onUse: function() {
            showMessage('📣 *Sonido de silbato*');
            playSound('whistle');
            // Atraer NPCs cercanos
        }
    },
    matches: {
        id: 'matches',
        name: 'Fósforos',
        description: 'Para encender fogatas.',
        icon: '🔥',
        stackable: true,
        consumable: true,
        onUse: function() {
            showMessage('🔥 Encendiendo fuego...');
            // Permitir crear fogata
            window.canMakeFire = true;
        }
    },
    binoculars: {
        id: 'binoculars',
        name: 'Binoculares',
        description: 'Te permiten ver más lejos.',
        icon: '🔭',
        stackable: false,
        consumable: false,
        onUse: function() {
            showMessage('🔭 Observando a la distancia...');
            window.zoomOut = !window.zoomOut;
        }
    },
    book: {
        id: 'book',
        name: 'Manual Scout',
        description: 'Contiene conocimientos útiles.',
        icon: '📖',
        stackable: false,
        consumable: false,
        onUse: function() {
            showMessage('📖 Leyendo el manual scout...');
            // Mostrar tips o tutorial
            window.showScoutManual = true;
        }
    },
    trophy: {
        id: 'trophy',
        name: 'Trofeo Especial',
        description: 'Premio por completar desafíos.',
        icon: '🏆',
        stackable: true,
        consumable: false,
        onUse: function() {
            showMessage('🏆 ¡Qué orgullo! Has logrado grandes cosas.');
        }
    }
};

// Crear item desde tipo
function createItem(typeId, quantity = 1) {
    const type = ITEM_TYPES[typeId];
    if (type) {
        return { ...type, quantity };
    }
    return null;
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Inventory, ITEM_TYPES, createItem };
}
