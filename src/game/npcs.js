// ============================================
// SISTEMA DE DIÁLOGOS Y NPCs
// ============================================

class DialogSystem {
    constructor() {
        this.active = false;
        this.currentDialog = null;
        this.currentLine = 0;
        this.choices = [];
        this.onComplete = null;
    }

    // Iniciar diálogo
    start(dialog, onComplete = null) {
        this.active = true;
        this.currentDialog = dialog;
        this.currentLine = 0;
        this.onComplete = onComplete;
        gameState = 'dialog';
    }

    // Siguiente línea
    next() {
        if (this.currentLine < this.currentDialog.lines.length - 1) {
            this.currentLine++;
            playSound('dialog');
        } else if (this.currentDialog.choices) {
            // Mostrar opciones
            this.choices = this.currentDialog.choices;
        } else {
            this.close();
        }
    }

    // Seleccionar opción
    selectChoice(index) {
        if (this.choices[index] && this.choices[index].callback) {
            this.choices[index].callback();
        }
        this.close();
    }

    // Cerrar diálogo
    close() {
        this.active = false;
        this.currentDialog = null;
        this.currentLine = 0;
        this.choices = [];
        if (this.onComplete) this.onComplete();
        if (gameState === 'dialog') gameState = 'playing';
    }

    // Dibujar ventana de diálogo
    draw(ctx, canvasWidth, canvasHeight) {
        if (!this.active || !this.currentDialog) return;

        const dialog = this.currentDialog;
        const line = dialog.lines[this.currentLine];

        ctx.save();

        // Fondo oscuro
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Ventana de diálogo
        const boxWidth = canvasWidth - 100;
        const boxHeight = this.choices.length > 0 ? 250 : 150;
        const boxX = 50;
        const boxY = canvasHeight - boxHeight - 20;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 4;
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        // Nombre del personaje
        ctx.fillStyle = '#2d5016';
        ctx.font = 'bold 20px Arial';
        ctx.fillText(dialog.speaker, boxX + 20, boxY + 30);

        // Avatar
        ctx.font = '40px Arial';
        ctx.fillText(dialog.avatar || '👤', boxX + 20, boxY + 80);

        // Texto del diálogo
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        this.wrapText(ctx, line, boxX + 90, boxY + 60, boxWidth - 110, 22);

        // Indicador de continuar o mostrar opciones
        if (this.choices.length === 0) {
            ctx.fillStyle = '#4a7c2c';
            ctx.font = 'bold 14px Arial';
            ctx.fillText('Presiona ESPACIO para continuar...', boxX + 20, boxY + boxHeight - 20);
        } else {
            // Dibujar opciones
            this.choices.forEach((choice, index) => {
                const choiceY = boxY + 110 + index * 40;
                
                ctx.fillStyle = 'rgba(74, 124, 44, 0.1)';
                ctx.fillRect(boxX + 90, choiceY - 25, boxWidth - 110, 35);
                ctx.strokeStyle = '#4a7c2c';
                ctx.lineWidth = 2;
                ctx.strokeRect(boxX + 90, choiceY - 25, boxWidth - 110, 35);

                ctx.fillStyle = '#2d5016';
                ctx.font = 'bold 14px Arial';
                ctx.fillText(`${index + 1}. ${choice.text}`, boxX + 100, choiceY - 5);
            });

            ctx.fillStyle = '#666';
            ctx.font = '12px Arial';
            ctx.fillText('Presiona 1, 2 o 3 para elegir', boxX + 20, boxY + boxHeight - 20);
        }

        ctx.restore();
    }

    // Envolver texto
    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        let lineCount = 0;

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, y + lineCount * lineHeight);
                line = words[i] + ' ';
                lineCount++;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y + lineCount * lineHeight);
    }

    // Manejar input
    handleInput(key) {
        if (!this.active) return;

        if (this.choices.length === 0) {
            if (key === ' ' || key === 'Enter') {
                this.next();
            }
        } else {
            if (key >= '1' && key <= '9') {
                const index = parseInt(key) - 1;
                if (index < this.choices.length) {
                    this.selectChoice(index);
                }
            }
        }
    }
}

// ============================================
// CLASE NPC
// ============================================

class NPC {
    constructor(x, y, type, name) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.type = type; // 'scout', 'elder', 'animal'
        this.name = name;
        this.dialogs = this.getDialogsByType(type);
        this.currentDialogIndex = 0;
        this.hasQuest = true;
        this.questCompleted = false;
        this.animationFrame = 0;
    }

    // Obtener diálogos según tipo
    getDialogsByType(type) {
        const dialogDatabase = {
            scout: [
                {
                    speaker: 'Scout Compañero',
                    avatar: '🧑',
                    lines: [
                        '¡Hola! ¿Eres nuevo en la patrulla?',
                        'Estoy buscando ayuda para recolectar ramas para el fuego.',
                        '¿Podrías ayudarme a encontrar 5 ramas?'
                    ],
                    choices: [
                        { text: '¡Claro! Te ayudo', callback: () => acceptQuest('collect_branches') },
                        { text: 'Ahora no puedo', callback: () => showMessage('Tal vez más tarde...') },
                        { text: '¿Qué gano yo?', callback: () => showMessage('¡Ganarás 50 puntos y mi gratitud!') }
                    ]
                },
                {
                    speaker: 'Scout Compañero',
                    avatar: '🧑',
                    lines: [
                        '¡Gracias por tu ayuda!',
                        'Eres un verdadero scout. ¡Siempre Listo!'
                    ]
                }
            ],
            elder: [
                {
                    speaker: 'Jefe Scout',
                    avatar: '👴',
                    lines: [
                        'Bienvenido, joven scout.',
                        'Veo que tienes potencial para ser un gran líder.',
                        'Te enseñaré los valores del movimiento scout: hermandad, servicio y superación.',
                        '¿Estás listo para aprender?'
                    ],
                    choices: [
                        { text: 'Sí, estoy listo', callback: () => learnScoutValues() },
                        { text: 'Cuéntame más', callback: () => showMessage('Los scouts ayudan a construir un mundo mejor') },
                        { text: 'Quiero una misión', callback: () => generateSpecialMission() }
                    ]
                }
            ],
            animal: [
                {
                    speaker: 'Mapache Curioso',
                    avatar: '🦝',
                    lines: [
                        '*El mapache te mira con curiosidad*',
                        'Parece que quiere mostrarte algo...',
                        '*Te guía hacia un árbol donde hay frutas*'
                    ]
                }
            ]
        };

        return dialogDatabase[type] || [];
    }

    // Verificar si el jugador está cerca
    isNear(playerX, playerY, radius = 60) {
        const dx = (playerX + 20) - (this.x + this.width / 2);
        const dy = (playerY + 25) - (this.y + this.height / 2);
        return Math.sqrt(dx * dx + dy * dy) < radius;
    }

    // Interactuar con el NPC
    interact(dialogSystem) {
        if (this.currentDialogIndex < this.dialogs.length) {
            dialogSystem.start(this.dialogs[this.currentDialogIndex], () => {
                this.currentDialogIndex++;
                if (this.currentDialogIndex >= this.dialogs.length) {
                    this.questCompleted = true;
                }
            });
        } else {
            showMessage(`${this.name}: ¡Ya hemos hablado antes!`);
        }
    }

    // Dibujar NPC
    draw(ctx) {
        ctx.save();

        // Animación simple
        this.animationFrame = (this.animationFrame + 0.1) % (Math.PI * 2);
        const bounce = Math.sin(this.animationFrame) * 3;

        // Dibujar según tipo
        if (this.type === 'scout') {
            // Scout similar al jugador
            ctx.fillStyle = '#d4b896';
            ctx.fillRect(this.x + 10, this.y + 20 + bounce, 20, 25);

            ctx.fillStyle = '#f4c2a8';
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 15 + bounce, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#4a7c2c';
            ctx.beginPath();
            ctx.moveTo(this.x + 8, this.y + 8 + bounce);
            ctx.lineTo(this.x + 32, this.y + 8 + bounce);
            ctx.lineTo(this.x + 20, this.y - 2 + bounce);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#0066cc';
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y + 22 + bounce);
            ctx.lineTo(this.x + 25, this.y + 22 + bounce);
            ctx.lineTo(this.x + 20, this.y + 30 + bounce);
            ctx.closePath();
            ctx.fill();

        } else if (this.type === 'elder') {
            // Jefe scout más grande
            ctx.fillStyle = '#8b6f47';
            ctx.fillRect(this.x + 8, this.y + 25 + bounce, 24, 30);

            ctx.fillStyle = '#f4c2a8';
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 18 + bounce, 15, 0, Math.PI * 2);
            ctx.fill();

            // Sombrero más elegante
            ctx.fillStyle = '#2d5016';
            ctx.fillRect(this.x + 5, this.y + 8 + bounce, 30, 5);
            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 8 + bounce);
            ctx.lineTo(this.x + 30, this.y + 8 + bounce);
            ctx.lineTo(this.x + 20, this.y - 5 + bounce);
            ctx.closePath();
            ctx.fill();

            // Barba
            ctx.fillStyle = '#ccc';
            ctx.fillRect(this.x + 12, this.y + 28 + bounce, 16, 8);

        } else if (this.type === 'animal') {
            // Animal (mapache)
            ctx.font = '40px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🦝', this.x + 20, this.y + 30 + bounce);
        }

        // Nombre sobre el NPC
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.x - 10, this.y - 20, 60, 18);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + 20, this.y - 8);

        // Indicador de quest
        if (this.hasQuest && !this.questCompleted) {
            ctx.fillStyle = '#ffd700';
            ctx.font = '20px Arial';
            ctx.fillText('❗', this.x + 20, this.y - 25 + bounce);
        }

        ctx.restore();
    }

    // Dibujar indicador de interacción
    drawInteractionPrompt(ctx, playerX, playerY) {
        if (this.isNear(playerX, playerY)) {
            ctx.save();
            ctx.fillStyle = 'rgba(74, 124, 44, 0.9)';
            ctx.fillRect(this.x - 20, this.y + 60, 80, 25);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Presiona T', this.x + 20, this.y + 77);
            ctx.restore();
        }
    }
}

// Funciones auxiliares para callbacks de diálogos
function acceptQuest(questId) {
    showMessage('📋 ¡Misión aceptada!');
    if (window.missionSystem) {
        // Agregar misión personalizada
        window.missionSystem.currentMissions.push({
            id: questId,
            name: 'Ayuda al Scout',
            description: 'Recolecta 5 ramas',
            type: 'collect',
            target: 5,
            progress: 0,
            reward: { points: 50 },
            icon: '🪵',
            active: true
        });
    }
}

function learnScoutValues() {
    showMessage('🏕️ Has aprendido sobre los valores scout');
    if (window.scout) {
        window.scout.points += 75;
        window.levelSystem?.addXP(50);
    }
}

function generateSpecialMission() {
    showMessage('⭐ Misión especial desbloqueada');
    if (window.missionSystem) {
        window.missionSystem.currentMissions.push({
            id: 'special_elder',
            name: 'Prueba del Jefe',
            description: 'Alcanza 500 puntos',
            type: 'points',
            target: 500,
            progress: 0,
            reward: { points: 200 },
            icon: '👴',
            active: true
        });
    }
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DialogSystem, NPC };
}
