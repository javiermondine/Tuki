// ============================================
// SISTEMA DE MISIONES DINÁMICAS
// ============================================

class MissionSystem {
    constructor() {
        this.currentMissions = [];
        this.completedMissions = [];
        this.missionTypes = [
            // Misiones de exploración
            {
                id: 'explore_area',
                name: 'Explorador del Bosque',
                description: 'Explora 5 veces diferentes áreas',
                type: 'explore',
                target: 5,
                reward: { points: 50, badge: null },
                icon: '🧭'
            },
            {
                id: 'collect_items',
                name: 'Recolector Experto',
                description: 'Recolecta 10 objetos del bosque',
                type: 'collect',
                target: 10,
                reward: { points: 75, badge: null },
                icon: '🌿'
            },
            {
                id: 'help_scouts',
                name: 'Scout Servicial',
                description: 'Ayuda a otros scouts 5 veces',
                type: 'help',
                target: 5,
                reward: { points: 100, badge: null },
                icon: '🤝'
            },
            {
                id: 'camp_master',
                name: 'Maestro del Campamento',
                description: 'Acampa 3 veces para recuperar energía',
                type: 'camp',
                target: 3,
                reward: { points: 60, badge: null },
                icon: '⛺'
            },
            {
                id: 'night_explorer',
                name: 'Explorador Nocturno',
                description: 'Explora durante la noche',
                type: 'night_explore',
                target: 1,
                reward: { points: 80, badge: null },
                icon: '🌙'
            },
            {
                id: 'forest_guardian',
                name: 'Guardián del Bosque',
                description: 'Recolecta 5 flores sin dejar basura',
                type: 'collect_flowers',
                target: 5,
                reward: { points: 90, badge: null },
                icon: '🌸'
            },
            {
                id: 'survival_expert',
                name: 'Experto en Supervivencia',
                description: 'Mantén tu energía arriba del 50% por 2 minutos',
                type: 'maintain_energy',
                target: 120, // frames
                reward: { points: 120, badge: null },
                icon: '⚡'
            },
            {
                id: 'treasure_hunter',
                name: 'Cazador de Tesoros',
                description: 'Encuentra el tesoro escondido',
                type: 'find_treasure',
                target: 1,
                reward: { points: 150, badge: null },
                icon: '💎'
            }
        ];
    }

    // Generar misiones aleatorias
    generateRandomMissions(count = 3, difficulty = 'explorer') {
        this.currentMissions = [];
        const availableMissions = [...this.missionTypes].filter(m => 
            !this.completedMissions.includes(m.id)
        );

        // Ajustar según dificultad
        const difficultyMultiplier = {
            explorer: 1,
            guide: 1.5,
            leader: 2
        };

        for (let i = 0; i < Math.min(count, availableMissions.length); i++) {
            const randomIndex = Math.floor(Math.random() * availableMissions.length);
            const mission = { ...availableMissions[randomIndex] };
            
            // Ajustar recompensas según dificultad
            mission.reward.points = Math.floor(mission.reward.points * difficultyMultiplier[difficulty]);
            mission.progress = 0;
            mission.active = true;
            
            this.currentMissions.push(mission);
            availableMissions.splice(randomIndex, 1);
        }

        return this.currentMissions;
    }

    // Actualizar progreso de misión
    updateProgress(missionType, amount = 1) {
        this.currentMissions.forEach(mission => {
            if (mission.type === missionType && mission.active) {
                mission.progress += amount;
                
                // Verificar si se completó
                if (mission.progress >= mission.target) {
                    this.completeMission(mission);
                }
            }
        });
    }

    // Completar misión
    completeMission(mission) {
        mission.active = false;
        this.completedMissions.push(mission.id);
        
        // Notificación visual
        showMessage(`${mission.icon} ¡Misión completada: ${mission.name}! +${mission.reward.points} puntos`);
        playSound('mission_complete');
        
        return mission.reward;
    }

    // Obtener misiones activas
    getActiveMissions() {
        return this.currentMissions.filter(m => m.active);
    }

    // Dibujar panel de misiones
    draw(ctx, x, y) {
        const activeMissions = this.getActiveMissions();
        if (activeMissions.length === 0) return;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 3;
        
        const panelWidth = 280;
        const panelHeight = 40 + activeMissions.length * 60;
        
        // Fondo del panel
        ctx.fillRect(x, y, panelWidth, panelHeight);
        ctx.strokeRect(x, y, panelWidth, panelHeight);

        // Título
        ctx.fillStyle = '#2d5016';
        ctx.font = 'bold 18px Arial';
        ctx.fillText('📋 Misiones Activas', x + 10, y + 25);

        // Misiones
        activeMissions.forEach((mission, index) => {
            const my = y + 50 + index * 60;
            
            // Nombre
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#4a7c2c';
            ctx.fillText(`${mission.icon} ${mission.name}`, x + 10, my);

            // Progreso
            ctx.font = '12px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText(mission.description, x + 10, my + 18);
            
            // Barra de progreso
            const progressBarWidth = panelWidth - 20;
            const progressBarHeight = 8;
            const progressPercent = mission.progress / mission.target;
            
            ctx.fillStyle = '#ddd';
            ctx.fillRect(x + 10, my + 25, progressBarWidth, progressBarHeight);
            
            ctx.fillStyle = '#4a7c2c';
            ctx.fillRect(x + 10, my + 25, progressBarWidth * progressPercent, progressBarHeight);
            
            ctx.font = 'bold 10px Arial';
            ctx.fillStyle = '#333';
            ctx.fillText(`${mission.progress}/${mission.target}`, x + progressBarWidth - 30, my + 32);
        });

        ctx.restore();
    }
}

// ============================================
// SISTEMA DE NIVELES Y EXPERIENCIA
// ============================================

class LevelSystem {
    constructor() {
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.difficulty = 'explorer'; // explorer, guide, leader
        
        this.difficultyLevels = {
            explorer: {
                name: 'Explorador',
                xpMultiplier: 1,
                energyCost: 1,
                rewards: 1,
                icon: '🔰'
            },
            guide: {
                name: 'Guía',
                xpMultiplier: 1.5,
                energyCost: 1.3,
                rewards: 1.5,
                icon: '⭐'
            },
            leader: {
                name: 'Líder',
                xpMultiplier: 2,
                energyCost: 1.5,
                rewards: 2,
                icon: '👑'
            }
        };
    }

    // Añadir experiencia
    addXP(amount) {
        const multiplier = this.difficultyLevels[this.difficulty].xpMultiplier;
        this.xp += Math.floor(amount * multiplier);

        // Verificar subida de nivel
        while (this.xp >= this.xpToNextLevel) {
            this.levelUp();
        }
    }

    // Subir de nivel
    levelUp() {
        this.level++;
        this.xp -= this.xpToNextLevel;
        this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        
        showMessage(`🎉 ¡Nivel ${this.level} alcanzado!`);
        playSound('level_up');

        // Cambiar dificultad automáticamente
        if (this.level >= 10 && this.difficulty === 'explorer') {
            this.setDifficulty('guide');
        } else if (this.level >= 20 && this.difficulty === 'guide') {
            this.setDifficulty('leader');
        }

        return {
            level: this.level,
            bonusPoints: this.level * 10,
            bonusEnergy: 20
        };
    }

    // Establecer dificultad
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        const diffData = this.difficultyLevels[difficulty];
        showMessage(`${diffData.icon} Ahora eres un ${diffData.name}!`);
    }

    // Obtener multiplicador de dificultad
    getDifficultyMultiplier(type) {
        return this.difficultyLevels[this.difficulty][type] || 1;
    }

    // Dibujar barra de XP
    draw(ctx, x, y, width) {
        ctx.save();
        
        // Fondo de la barra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x, y, width, 25);

        // Barra de progreso
        const progress = this.xp / this.xpToNextLevel;
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(x, y, width * progress, 25);

        // Borde
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, 25);

        // Texto
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(`Nivel ${this.level} - ${this.xp}/${this.xpToNextLevel} XP`, x + width / 2, y + 17);
        ctx.fillText(`Nivel ${this.level} - ${this.xp}/${this.xpToNextLevel} XP`, x + width / 2, y + 17);

        // Indicador de dificultad
        const diffData = this.difficultyLevels[this.difficulty];
        ctx.textAlign = 'left';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(`${diffData.icon} ${diffData.name}`, x + 5, y + 40);

        ctx.restore();
    }
}

// ============================================
// SISTEMA DÍA/NOCHE
// ============================================

class DayNightCycle {
    constructor() {
        this.timeOfDay = 360; // 0-720 (0=medianoche, 360=mediodía, 720=medianoche)
        this.speed = 0.00667; // Velocidad del ciclo (~30 minutos para ciclo completo)
        this.paused = false;
    }

    // Actualizar ciclo
    update() {
        if (!this.paused) {
            this.timeOfDay += this.speed;
            if (this.timeOfDay >= 720) {
                this.timeOfDay = 0;
            }
        }
    }

    // Obtener fase del día
    getPhase() {
        if (this.timeOfDay < 120) return 'night';      // 00:00 - 04:00
        if (this.timeOfDay < 180) return 'dawn';       // 04:00 - 06:00
        if (this.timeOfDay < 480) return 'day';        // 06:00 - 16:00
        if (this.timeOfDay < 540) return 'dusk';       // 16:00 - 18:00
        return 'night';                                 // 18:00 - 24:00
    }

    // Obtener color del cielo
    getSkyColor() {
        const phase = this.getPhase();
        const colors = {
            night: ['#0c1445', '#1a237e', '#2d3e50'],
            dawn: ['#ff6b6b', '#ffa07a', '#ffb6c1'],
            day: ['#87ceeb', '#90ee90', '#a8e6cf'],
            dusk: ['#ff7f50', '#ff6347', '#ff4500']
        };
        return colors[phase];
    }

    // Obtener opacidad de oscuridad (0-1)
    getDarknessOpacity() {
        const phase = this.getPhase();
        const opacity = {
            night: 0.6,
            dawn: 0.2,
            day: 0,
            dusk: 0.3
        };
        return opacity[phase];
    }

    // Obtener hora formateada
    getTimeString() {
        const hours = Math.floor(this.timeOfDay / 30);
        const minutes = Math.floor((this.timeOfDay % 30) * 2);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Es de noche?
    isNight() {
        return this.getPhase() === 'night';
    }

    // Es de día?
    isDay() {
        return this.getPhase() === 'day';
    }

    // Aplicar overlay de oscuridad
    applyDarknessOverlay(ctx, width, height) {
        const opacity = this.getDarknessOpacity();
        if (opacity > 0) {
            ctx.fillStyle = `rgba(0, 0, 20, ${opacity})`;
            ctx.fillRect(0, 0, width, height);
        }
    }

    // Dibujar sol o luna
    drawCelestialBody(ctx, x, y) {
        const phase = this.getPhase();
        
        if (phase === 'night') {
            // Luna
            ctx.fillStyle = '#f0f0f0';
            ctx.beginPath();
            ctx.arc(x, y, 35, 0, Math.PI * 2);
            ctx.fill();
            
            // Cráteres
            ctx.fillStyle = '#d0d0d0';
            ctx.beginPath();
            ctx.arc(x - 10, y - 5, 8, 0, Math.PI * 2);
            ctx.arc(x + 8, y + 10, 6, 0, Math.PI * 2);
            ctx.fill();

            // Estrellas
            for (let i = 0; i < 20; i++) {
                const sx = Math.random() * 800;
                const sy = Math.random() * 300;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(sx, sy, 1, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Sol
            ctx.fillStyle = '#ffff00';
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffa500';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Rayos del sol
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            for (let i = 0; i < 12; i++) {
                const angle = (i * Math.PI * 2) / 12;
                const startX = x + Math.cos(angle) * 45;
                const startY = y + Math.sin(angle) * 45;
                const endX = x + Math.cos(angle) * 60;
                const endY = y + Math.sin(angle) * 60;
                
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
        }
    }

    // Dibujar reloj
    drawClock(ctx, x, y) {
        const phase = this.getPhase();
        const icons = {
            night: '🌙',
            dawn: '🌅',
            day: '☀️',
            dusk: '🌇'
        };

        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(x, y, 120, 40);
        ctx.strokeStyle = '#4a7c2c';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, 120, 40);

        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#2d5016';
        ctx.fillText(`${icons[phase]} ${this.getTimeString()}`, x + 10, y + 25);
        ctx.restore();
    }
}

// Exportar para uso en game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MissionSystem, LevelSystem, DayNightCycle };
}
