// ============================================
// SISTEMA DE GUARDADO Y PROGRESIÓN
// ============================================

class SaveSystem {
    constructor() {
        this.storageKey = 'scout_adventure_save';
        this.autoSaveInterval = 30000; // 30 segundos
        this.autoSaveTimer = null;
    }

    // Guardar partida
    save() {
        try {
            const saveData = {
                version: '2.0',
                timestamp: Date.now(),
                scout: {
                    x: window.scout?.x || 0,
                    y: window.scout?.y || 0,
                    energy: window.scout?.energy || 100,
                    points: window.scout?.points || 0,
                    badges: window.scout?.badges || []
                },
                level: {
                    level: window.levelSystem?.level || 1,
                    xp: window.levelSystem?.xp || 0,
                    difficulty: window.levelSystem?.difficulty || 'explorer'
                },
                missions: {
                    completed: window.missionSystem?.completedMissions || []
                },
                inventory: {
                    items: window.inventory?.items || []
                },
                time: {
                    timeOfDay: window.dayNightCycle?.timeOfDay || 360
                },
                stats: {
                    playTime: this.getPlayTime(),
                    itemsCollected: this.getItemsCollected(),
                    npcsInteracted: this.getNPCsInteracted()
                }
            };

            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            showMessage('💾 Partida guardada');
            console.log('Partida guardada exitosamente');
            return true;
        } catch (e) {
            console.error('Error al guardar:', e);
            showMessage('Error al guardar partida');
            return false;
        }
    }

    // Cargar partida
    load() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                console.log('No hay partida guardada');
                return null;
            }

            const data = JSON.parse(savedData);
            console.log('Partida encontrada:', data);

            // Verificar versión
            if (data.version !== '2.0') {
                console.warn('Versión de guardado incompatible');
                return null;
            }

            return data;
        } catch (e) {
            console.error('Error al cargar:', e);
            return null;
        }
    }

    // Aplicar datos guardados
    applyLoadedData(data) {
        if (!data) return false;

        try {
            // Restaurar scout
            if (window.scout && data.scout) {
                window.scout.x = data.scout.x;
                window.scout.y = data.scout.y;
                window.scout.energy = data.scout.energy;
                window.scout.points = data.scout.points;
                window.scout.badges = data.scout.badges || [];

                // Actualizar insignias en UI
                data.scout.badges.forEach(badgeId => {
                    const badge = document.getElementById(`badge-${badgeId}`);
                    if (badge) {
                        badge.classList.remove('locked');
                        badge.classList.add('unlocked');
                    }
                });
            }

            // Restaurar nivel y XP
            if (window.levelSystem && data.level) {
                window.levelSystem.level = data.level.level;
                window.levelSystem.xp = data.level.xp;
                window.levelSystem.difficulty = data.level.difficulty;
            }

            // Restaurar misiones completadas
            if (window.missionSystem && data.missions) {
                window.missionSystem.completedMissions = data.missions.completed || [];
            }

            // Restaurar inventario
            if (window.inventory && data.inventory) {
                window.inventory.items = data.inventory.items.map(item => {
                    // Recrear funciones de items
                    const itemType = ITEM_TYPES[item.id];
                    return { ...itemType, quantity: item.quantity };
                });
            }

            // Restaurar hora del día
            if (window.dayNightCycle && data.time) {
                window.dayNightCycle.timeOfDay = data.time.timeOfDay;
            }

            showMessage('📂 Partida cargada exitosamente');
            return true;
        } catch (e) {
            console.error('Error al aplicar datos guardados:', e);
            return false;
        }
    }

    // Borrar partida guardada
    delete() {
        try {
            localStorage.removeItem(this.storageKey);
            showMessage('🗑️ Partida eliminada');
            return true;
        } catch (e) {
            console.error('Error al borrar:', e);
            return false;
        }
    }

    // Verificar si existe guardado
    hasSave() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    // Iniciar guardado automático
    startAutoSave() {
        if (this.autoSaveTimer) return;

        this.autoSaveTimer = setInterval(() => {
            if (gameState === 'playing') {
                this.save();
            }
        }, this.autoSaveInterval);

        console.log('Auto-guardado activado cada 30 segundos');
    }

    // Detener guardado automático
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    // Estadísticas auxiliares
    getPlayTime() {
        // Implementar contador de tiempo jugado
        return 0;
    }

    getItemsCollected() {
        return window.scout?.points || 0;
    }

    getNPCsInteracted() {
        return window.npcs?.filter(npc => npc.questCompleted).length || 0;
    }

    // Exportar partida a JSON
    exportSave() {
        const data = this.load();
        if (!data) return null;

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `scout_adventure_save_${Date.now()}.json`;
        a.click();

        URL.revokeObjectURL(url);
        showMessage('📥 Partida exportada');
    }

    // Importar partida desde JSON
    importSave(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                localStorage.setItem(this.storageKey, JSON.stringify(data));
                showMessage('📤 Partida importada');
                
                // Recargar página para aplicar cambios
                setTimeout(() => location.reload(), 1000);
            } catch (err) {
                console.error('Error al importar:', err);
                showMessage('Archivo inválido');
            }
        };
        reader.readAsText(file);
    }
}

// ============================================
// SISTEMA DE LOGROS
// ============================================

class AchievementSystem {
    constructor() {
        this.achievements = [
            {
                id: 'first_steps',
                name: 'Primeros Pasos',
                description: 'Completa tu primera misión',
                icon: '👣',
                unlocked: false,
                condition: () => missionSystem.completedMissions.length >= 1
            },
            {
                id: 'explorer',
                name: 'Explorador Incansable',
                description: 'Explora 50 veces',
                icon: '🧭',
                unlocked: false,
                counter: 0,
                condition: () => this.achievements[1].counter >= 50
            },
            {
                id: 'collector',
                name: 'Coleccionista',
                description: 'Recolecta 100 objetos',
                icon: '🌿',
                unlocked: false,
                counter: 0,
                condition: () => this.achievements[2].counter >= 100
            },
            {
                id: 'social',
                name: 'Scout Social',
                description: 'Habla con todos los NPCs',
                icon: '💬',
                unlocked: false,
                condition: () => npcs.every(npc => npc.questCompleted)
            },
            {
                id: 'night_owl',
                name: 'Búho Nocturno',
                description: 'Explora durante toda la noche',
                icon: '🦉',
                unlocked: false,
                condition: () => dayNightCycle.isNight() && scout.points > 0
            },
            {
                id: 'master',
                name: 'Maestro Scout',
                description: 'Alcanza el nivel 20',
                icon: '🏅',
                unlocked: false,
                condition: () => levelSystem.level >= 20
            },
            {
                id: 'hoarder',
                name: 'Acumulador',
                description: 'Llena completamente tu inventario',
                icon: '🎒',
                unlocked: false,
                condition: () => inventory.items.length >= inventory.maxSlots
            },
            {
                id: 'speedrunner',
                name: 'Velocista',
                description: 'Completa 5 insignias en menos de 10 minutos',
                icon: '⚡',
                unlocked: false,
                condition: () => false // Requiere sistema de tiempo
            }
        ];

        this.loadProgress();
    }

    // Verificar logros
    check() {
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition()) {
                this.unlock(achievement);
            }
        });
    }

    // Desbloquear logro
    unlock(achievement) {
        achievement.unlocked = true;
        showMessage(`🏆 Logro desbloqueado: ${achievement.name}`);
        playSound('badge');
        this.saveProgress();
        
        // Crear efecto visual
        createParticles(canvas.width / 2, canvas.height / 2, 30, '#ffd700');
    }

    // Incrementar contador
    increment(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (achievement && achievement.counter !== undefined) {
            achievement.counter++;
            this.check();
        }
    }

    // Guardar progreso
    saveProgress() {
        const data = this.achievements.map(a => ({
            id: a.id,
            unlocked: a.unlocked,
            counter: a.counter || 0
        }));
        localStorage.setItem('scout_achievements', JSON.stringify(data));
    }

    // Cargar progreso
    loadProgress() {
        try {
            const saved = localStorage.getItem('scout_achievements');
            if (saved) {
                const data = JSON.parse(saved);
                data.forEach(saved => {
                    const achievement = this.achievements.find(a => a.id === saved.id);
                    if (achievement) {
                        achievement.unlocked = saved.unlocked;
                        achievement.counter = saved.counter || 0;
                    }
                });
            }
        } catch (e) {
            console.error('Error al cargar logros:', e);
        }
    }

    // Dibujar panel de logros
    draw(ctx, x, y) {
        ctx.save();
        
        const panelWidth = 300;
        const panelHeight = 400;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fillRect(x, y, panelWidth, panelHeight);
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, panelWidth, panelHeight);

        // Título
        ctx.fillStyle = '#2d5016';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('🏆 Logros', x + 10, y + 30);

        // Logros
        this.achievements.forEach((achievement, i) => {
            const ay = y + 60 + i * 40;
            
            ctx.font = '24px Arial';
            ctx.fillText(achievement.icon, x + 10, ay + 5);

            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = achievement.unlocked ? '#2d5016' : '#999';
            ctx.fillText(achievement.name, x + 50, ay);

            ctx.font = '11px Arial';
            ctx.fillText(achievement.description, x + 50, ay + 16);

            if (achievement.unlocked) {
                ctx.fillStyle = '#ffd700';
                ctx.fillText('✓', x + panelWidth - 30, ay + 8);
            }
        });

        ctx.restore();
    }
}

// Instancia global
const saveSystem = new SaveSystem();
const achievementSystem = new AchievementSystem();

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveSystem, AchievementSystem, saveSystem, achievementSystem };
}
