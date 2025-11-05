// ============================================
// AVENTURA SCOUT - Juego Educativo
// ============================================

// ============================================
// CONFIGURACIÓN DEL CANVAS
// ============================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ============================================
// VARIABLES GLOBALES DEL JUEGO
// ============================================
let gameState = 'menu'; // Estados: 'menu', 'playing', 'paused', 'victory', 'dialog'
// ... (el resto del archivo permanece igual hasta la sección de inicialización)
let animationId = null;
let soundEnabled = true;
let missionsVisible = true; // Variable para mostrar/ocultar panel de misiones
let currentZone = 'forest'; // Zona actual del juego
let currentZoneObject = null; // Objeto de zona actual

// ============================================
// SISTEMAS DEL JUEGO
// ============================================
let missionSystem;
let levelSystem;
let dayNightCycle;
let dialogSystem;
let inventory;

// Variables globales para funcionalidades de items
window.showCompassIndicator = false;
window.flashlightOn = false;
window.canClimb = false;
window.showMap = false;
window.canMakeFire = false;
window.zoomOut = false;
window.showScoutManual = false;

// Referencias globales para callbacks
window.scout = null;

// ============================================
// CLASE SCOUT (PERSONAJE PRINCIPAL)
// ============================================
class Scout {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 50;
        this.speed = 3;
        this.energy = 100;
        this.maxEnergy = 100;
        this.points = 0;
        this.badges = [];
        this.direction = 'down'; // Dirección: up, down, left, right
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationCounter = 0;
    }

    // Método para mover al scout
    move(dx, dy) {
        if (this.energy <= 0) return;

        const newX = this.x + dx * this.speed;
        const newY = this.y + dy * this.speed;

        // Verificar transición de zona en los bordes de la calle
        const roadCenter = canvas.width / 2;
        const roadWidth = 120;
        const isOnRoad = Math.abs(this.x - roadCenter) < roadWidth / 2;

        // Transición arriba (borde superior en la calle)
        if (newY < 0 && isOnRoad) {
            changeZone('north');
            return;
        }
        // Transición abajo (borde inferior en la calle)
        if (newY > canvas.height - this.height && isOnRoad) {
            changeZone('south');
            return;
        }

        // Verificar límites del canvas normalmente
        if (newX >= 0 && newX <= canvas.width - this.width) {
            this.x = newX;
        }
        if (newY >= 0 && newY <= canvas.height - this.height) {
            this.y = newY;
        }

        // Actualizar dirección
        if (dx > 0) this.direction = 'right';
        else if (dx < 0) this.direction = 'left';
        else if (dy > 0) this.direction = 'down';
        else if (dy < 0) this.direction = 'up';

        this.isMoving = dx !== 0 || dy !== 0;

        // Consumir energía al moverse
        if (this.isMoving) {
            this.energy = Math.max(0, this.energy - 0.05);
        }
    }

    // Método para explorar (gana puntos)
    explore() {
        if (this.energy < 20) {
            showMessage('Energía insuficiente para explorar');
            return;
        }
        const points = 15 * levelSystem.getDifficultyMultiplier('rewards');
        this.points += points;
        this.energy = Math.max(0, this.energy - 10 * levelSystem.getDifficultyMultiplier('energyCost'));
        showMessage(`🔍 ¡Explorando el área! +${Math.floor(points)} puntos`);
        playSound('explore');
        
        // Actualizar progreso de misiones y XP
        missionSystem.updateProgress('explore', 1);
        levelSystem.addXP(15);
        
        this.checkBadgeProgress();
    }

    // Método para acampar (recupera energía)
    camp() {
        if (this.energy >= 100) {
            showMessage('Ya tienes energía completa');
            return;
        }
        this.energy = Math.min(this.maxEnergy, this.energy + 30);
        showMessage('⛺ ¡Acampando y descansando! +30 energía');
        playSound('camp');
        
        // Actualizar progreso de misiones
        missionSystem.updateProgress('camp', 1);
        
        this.checkBadgeProgress();
    }

    // Método para recolectar objetos
    collect() {
        const nearbyItem = this.findNearbyItem();
        if (nearbyItem) {
            const points = nearbyItem.points * levelSystem.getDifficultyMultiplier('rewards');
            this.points += points;
            showMessage(`🌿 ¡Recolectaste ${nearbyItem.name}! +${Math.floor(points)} puntos`);
            playSound('collect');
            items.splice(items.indexOf(nearbyItem), 1);
            
            // Actualizar progreso de misiones y XP
            missionSystem.updateProgress('collect', 1);
            if (nearbyItem.type === 'flower') {
                missionSystem.updateProgress('collect_flowers', 1);
            }
            levelSystem.addXP(10);
            
            this.checkBadgeProgress();
        } else {
            showMessage('No hay objetos cerca para recolectar');
        }
    }

    // Método para ayudar (misión de servicio)
    help() {
        if (this.energy < 15) {
            showMessage('Energía insuficiente para ayudar');
            return;
        }
        const points = 25 * levelSystem.getDifficultyMultiplier('rewards');
        this.points += points;
        this.energy = Math.max(0, this.energy - 15 * levelSystem.getDifficultyMultiplier('energyCost'));
        showMessage(`🤝 ¡Ayudando a otros! +${Math.floor(points)} puntos`);
        playSound('help');
        
        // Actualizar progreso de misiones y XP
        missionSystem.updateProgress('help', 1);
        levelSystem.addXP(25);
        
        this.checkBadgeProgress();
    }

    // Encontrar objeto cercano
    findNearbyItem() {
        const detectionRadius = 60;
        return items.find(item => {
            const dx = item.x - (this.x + this.width / 2);
            const dy = item.y - (this.y + this.height / 2);
            return Math.sqrt(dx * dx + dy * dy) < detectionRadius;
        });
    }

    // Verificar progreso de insignias
    checkBadgeProgress() {
        // Insignia de Explorador: 100 puntos
        if (this.points >= 100 && !this.badges.includes('explorer')) {
            this.unlockBadge('explorer', '🧭 Explorador');
        }
        // Insignia de Campista: acampar 3 veces (simulado con energía recuperada)
        if (this.energy === this.maxEnergy && !this.badges.includes('camper')) {
            this.unlockBadge('camper', '⛺ Campista');
        }
        // Insignia de Recolector: 200 puntos
        if (this.points >= 200 && !this.badges.includes('collector')) {
            this.unlockBadge('collector', '🌿 Recolector');
        }
        // Insignia de Servicial: 300 puntos
        if (this.points >= 300 && !this.badges.includes('helper')) {
            this.unlockBadge('helper', '🤝 Servicial');
        }
        // Insignia de Líder: 400 puntos
        if (this.points >= 400 && !this.badges.includes('leader')) {
            this.unlockBadge('leader', '👑 Líder');
        }
    }

    // Desbloquear insignia
    unlockBadge(badgeId, badgeName) {
        this.badges.push(badgeId);
        const badgeElement = document.getElementById(`badge-${badgeId}`);
        if (badgeElement) {
            badgeElement.classList.remove('locked');
            badgeElement.classList.add('unlocked');
        }
        showMessage(`Insignia desbloqueada: ${badgeName}!`);
        playSound('badge');

        // Verificar victoria
        if (this.badges.length >= 5) {
            setTimeout(() => {
                endGame();
            }, 1000);
        }
    }

    // Dibujar el scout
    draw() {
        // Actualizar animación
        if (this.isMoving) {
            this.animationCounter++;
            if (this.animationCounter % 10 === 0) {
                this.animationFrame = (this.animationFrame + 1) % 4;
            }
        }

        // Cuerpo (uniforme scout - beige)
        ctx.fillStyle = '#d4b896';
        ctx.fillRect(this.x + 10, this.y + 20, 20, 25);

        // Cabeza
        ctx.fillStyle = '#f4c2a8';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 15, 12, 0, Math.PI * 2);
        ctx.fill();

        // Sombrero scout
        ctx.fillStyle = '#4a7c2c';
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 8);
        ctx.lineTo(this.x + 32, this.y + 8);
        ctx.lineTo(this.x + 20, this.y - 2);
        ctx.closePath();
        ctx.fill();

        // Pañoleta
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.moveTo(this.x + 15, this.y + 22);
        ctx.lineTo(this.x + 25, this.y + 22);
        ctx.lineTo(this.x + 20, this.y + 30);
        ctx.closePath();
        ctx.fill();

        // Piernas
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(this.x + 12, this.y + 45, 7, 15);
        ctx.fillRect(this.x + 21, this.y + 45, 7, 15);

        // Brazos (animación de caminar)
        const armOffset = this.isMoving ? Math.sin(this.animationFrame) * 5 : 0;
        ctx.fillStyle = '#d4b896';
        ctx.fillRect(this.x + 5, this.y + 25 + armOffset, 5, 15);
        ctx.fillRect(this.x + 30, this.y + 25 - armOffset, 5, 15);

        // Mochila
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(this.x + 28, this.y + 25, 8, 12);
    }

    // Actualizar interfaz
    updateUI() {
        document.getElementById('energy-display').textContent = Math.round(this.energy);
        document.getElementById('points-display').textContent = this.points;
        document.getElementById('badges-display').textContent = `${this.badges.length}/5`;
        
        // Actualizar misión actual
        let mission = 'Explora el bosque';
        if (this.points < 100) mission = 'Explora para ganar 100 puntos';
        else if (this.badges.length < 2) mission = 'Acampa para recuperar energía';
        else if (this.badges.length < 3) mission = 'Recolecta objetos del bosque';
        else if (this.badges.length < 4) mission = 'Sigue explorando y ayudando';
        else if (this.badges.length < 5) mission = 'Una insignia más para ganar';
        else mission = '¡Todas las insignias completadas!';
        
        document.getElementById('mission-display').textContent = mission;
    }
}

// ============================================
// CLASE ITEM (OBJETOS RECOLECTABLES)
// ============================================
class Item {
    constructor(x, y, typeOrIcon, name, points, type) {
        this.x = x;
        this.y = y;
        this.size = 25;
        this.collected = false;
        
        // Si se pasan todos los parámetros (llamada desde zones.js)
        if (name !== undefined && points !== undefined && type !== undefined) {
            this.emoji = typeOrIcon; // El tercer parámetro es el emoji/icon
            this.name = name;
            this.points = points;
            this.type = type;
            this.color = '#ffa500'; // Color por defecto
        } else {
            // Si solo se pasa el tipo (llamada legacy)
            this.type = typeOrIcon;
            
            // Propiedades según tipo
            const itemData = {
                leaf: { name: 'Hoja', points: 10, color: '#90ee90', emoji: '🍃' },
                stone: { name: 'Piedra', points: 15, color: '#808080', emoji: '🪨' },
                flower: { name: 'Flor', points: 20, color: '#ffb6c1', emoji: '🌸' },
                mushroom: { name: 'Hongo', points: 25, color: '#ff6347', emoji: '🍄' }
            };
            
            Object.assign(this, itemData[this.type]);
        }
    }

    draw() {
        // Dibujar círculo con color
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#2d5016';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dibujar emoji
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, this.x, this.y);
    }
}

// ============================================
// VARIABLES DEL JUEGO
// ============================================
let scout; // Se inicializará en initializeGame
let items = [];
let npcs = [];


// Posiciones fijas de árboles (para evitar que se muevan)
const treePositions = [];
for (let i = 0; i < 8; i++) {
    treePositions.push({
        x: i * 110 + 50,
        y: 100 + (i % 3) * 20 // Patrón fijo en lugar de random
    });
}
let keys = {};
let messageQueue = [];
let messageTimer = 0;
let particles = [];

// ============================================
// SISTEMA DE PARTÍCULAS
// ============================================
class Particle {
    constructor(x, y, color, velocity) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x;
        this.vy = velocity.y;
        this.life = 1;
        this.decay = 0.02;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravedad
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

// Crear efecto de partículas
function createParticles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.push(new Particle(x, y, color, {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed - 2
        }));
    }
}

// ============================================
// GENERAR ITEMS ALEATORIOS Y NPCs
// ============================================
function generateItems() {
    items = [];
    const itemTypes = ['leaf', 'stone', 'flower', 'mushroom'];
    const itemCount = 15;

    for (let i = 0; i < itemCount; i++) {
        const x = Math.random() * (canvas.width - 50) + 25;
        const y = Math.random() * (canvas.height - 150) + 50;
        const type = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        items.push(new Item(x, y, type));
    }
}

function generateNPCs() {
    npcs = [];
    
    // Scout compañero
    npcs.push(new NPC(150, 200, 'scout', 'Lucas'));
    
    // Jefe scout
    npcs.push(new NPC(650, 150, 'elder', 'Jefe Pedro'));
    
    // Mapache
    npcs.push(new NPC(400, 300, 'animal', 'Mapache'));
}

function initializeInventory() {
    // Agregar items iniciales
    if (window.inventory && typeof createItem === 'function') {
        window.inventory.addItem(createItem('compass', 1));
        window.inventory.addItem(createItem('water', 3));
        window.inventory.addItem(createItem('map', 1));
    }
}

// ============================================
// DIBUJAR ESCENARIO (BOSQUE Y CAMPAMENTO)
// ============================================
function drawBackground() {
    // Usar el sistema de zonas si está disponible
    if (currentZoneObject) {
        currentZoneObject.drawBackground(ctx, canvas, dayNightCycle);
        
        // Sol o Luna
        dayNightCycle.drawCelestialBody(ctx, 700, 80);

        // Nubes
        if (!dayNightCycle.isNight()) {
            drawCloud(150, 60);
            drawCloud(450, 100);
            drawCloud(650, 50);
        }

        // Árboles de fondo con color de la zona
        ctx.fillStyle = currentZoneObject.treeColor;
        for (let i = 0; i < treePositions.length; i++) {
            const tree = treePositions[i];
            drawTree(tree.x, tree.y, 0.8, currentZoneObject.treeColor);
        }

        // Campamento base (tienda)
        drawTent(canvas.width - 150, canvas.height - 150);

        // Fogata (con partículas si es de noche)
        drawCampfire(120, canvas.height - 120);
        
        // Aplicar oscuridad según hora del día
        dayNightCycle.applyDarknessOverlay(ctx, canvas.width, canvas.height);
        
        // Efecto de linterna si está encendida de noche
        if (window.flashlightOn && dayNightCycle.isNight()) {
            drawFlashlight(scout.x + 20, scout.y + 25);
        }
    } else {
        // Fallback al dibujo original
        drawBackgroundLegacy();
    }
}

// Función legacy de fondo (por compatibilidad)
function drawBackgroundLegacy() {
    // Cielo con gradiente (cambia según hora del día)
    const skyColors = dayNightCycle.getSkyColor();
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, skyColors[0]);
    gradient.addColorStop(0.7, skyColors[1]);
    gradient.addColorStop(1, skyColors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sol o Luna
    dayNightCycle.drawCelestialBody(ctx, 700, 80);

    // Nubes
    if (!dayNightCycle.isNight()) {
        drawCloud(150, 60);
        drawCloud(450, 100);
        drawCloud(650, 50);
    }

    // Árboles de fondo
    for (let i = 0; i < treePositions.length; i++) {
        const tree = treePositions[i];
        drawTree(tree.x, tree.y, 0.8);
    }

    // Pasto
    ctx.fillStyle = '#3a7f2c';
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

    // Camino
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(canvas.width / 2 - 60, 0, 120, canvas.height);
    
    // Líneas del camino
    ctx.strokeStyle = '#a0826d';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Campamento base (tienda)
    drawTent(canvas.width - 150, canvas.height - 150);

    // Fogata (con partículas si es de noche)
    drawCampfire(120, canvas.height - 120);
    
    // Aplicar oscuridad según hora del día
    dayNightCycle.applyDarknessOverlay(ctx, canvas.width, canvas.height);
    
    // Efecto de linterna si está encendida de noche
    if (window.flashlightOn && dayNightCycle.isNight()) {
        drawFlashlight(scout.x + 20, scout.y + 25);
    }
}

// Dibujar árbol
function drawTree(x, y, scale = 1, treeColor = '#2d5016') {
    // Tronco
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(x - 10 * scale, y, 20 * scale, 60 * scale);

    // Copa
    ctx.fillStyle = treeColor;
    ctx.beginPath();
    ctx.arc(x, y, 40 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 20 * scale, y + 10 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 20 * scale, y + 10 * scale, 30 * scale, 0, Math.PI * 2);
    ctx.fill();
}

// Dibujar nube
function drawCloud(x, y) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    ctx.fill();
}

// Dibujar tienda de campaña
function drawTent(x, y) {
    ctx.fillStyle = '#ff6347';
    ctx.beginPath();
    ctx.moveTo(x, y + 80);
    ctx.lineTo(x + 80, y + 80);
    ctx.lineTo(x + 40, y);
    ctx.closePath();
    ctx.fill();

    // Puerta
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 30, y + 50, 20, 30);
}

// Dibujar fogata
function drawCampfire(x, y) {
    // Piedras
    ctx.fillStyle = '#696969';
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6;
        const px = x + Math.cos(angle) * 25;
        const py = y + Math.sin(angle) * 15;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
    }

    // Fuego (animado)
    const flameOffset = Math.sin(Date.now() / 200) * 5;
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 15, y + 20);
    ctx.lineTo(x, y - 20 + flameOffset);
    ctx.lineTo(x + 15, y + 20);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffa500';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 8, y + 15);
    ctx.lineTo(x, y - 15 + flameOffset);
    ctx.lineTo(x + 8, y + 15);
    ctx.closePath();
    ctx.fill();
    
    // Partículas de fuego
    if (Math.random() > 0.7) {
        createParticles(x, y - 20, 1, '#ff6347');
    }
}

// Dibujar efecto de linterna
function drawFlashlight(x, y) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// ============================================
// SISTEMA DE MENSAJES
// ============================================
function showMessage(text) {
    messageQueue.push({ text, alpha: 1, y: 50 });
    if (messageQueue.length > 3) {
        messageQueue.shift();
    }
}

function drawMessages() {
    messageQueue.forEach((msg, index) => {
        ctx.save();
        ctx.globalAlpha = msg.alpha;
        ctx.fillStyle = '#2d5016';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.strokeText(msg.text, canvas.width / 2, msg.y + index * 30);
        ctx.fillText(msg.text, canvas.width / 2, msg.y + index * 30);
        ctx.restore();

        msg.alpha -= 0.01;
        msg.y -= 0.3;
    });

    messageQueue = messageQueue.filter(msg => msg.alpha > 0);
}

// ============================================
// SISTEMA DE SONIDO (SIMULADO)
// ============================================
function playSound(type) {
    if (!soundEnabled) return;
    
    // Aquí se pueden agregar sonidos reales usando Web Audio API
    // Por ahora, solo log para indicar que se reproduce un sonido
    console.log(`🔊 Reproduciendo sonido: ${type}`);
}

// ============================================
// CONTROLES DEL TECLADO
// ============================================
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    // Si hay diálogo activo, manejar input de diálogo
    if (dialogSystem.active) {
        dialogSystem.handleInput(e.key);
        return;
    }

    // Si inventario está abierto
    if (inventory.visible) {
        if (e.key === 'Escape' || e.key === 'i' || e.key === 'I') {
            inventory.toggle();
            return;
        }
        // Usar items con teclas numéricas
        if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            if (inventory.useItem(index)) {
                playSound('click');
            }
        }
        return;
    }

    // Acciones específicas durante el juego
    if (gameState === 'playing') {
        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            scout.camp();
        }
        if (e.key === 'e' || e.key === 'E') {
            scout.explore();
        }
        if (e.key === 'r' || e.key === 'R') {
            scout.collect();
        }
        if (e.key === 'h' || e.key === 'H') {
            scout.help();
        }
        if (e.key === 'p' || e.key === 'P') {
            togglePause();
        }
        if (e.key === 'i' || e.key === 'I') {
            inventory.toggle();
        }
        if (e.key === 'm' || e.key === 'M') {
            missionsVisible = !missionsVisible;
            showMessage(missionsVisible ? 'Panel de misiones visible' : 'Panel de misiones oculto');
        }
        if (e.key === 't' || e.key === 'T') {
            // Interactuar con NPCs
            npcs.forEach(npc => {
                if (npc.isNear(scout.x, scout.y)) {
                    npc.interact(dialogSystem);
                }
            });
        }
    } else if (gameState === 'paused' && (e.key === 'p' || e.key === 'P')) {
        togglePause();
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// ============================================
// ACTUALIZAR MOVIMIENTO
// ============================================
function updateMovement() {
    let dx = 0;
    let dy = 0;

    if (keys['ArrowUp'] || keys['w'] || keys['W']) dy = -1;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) dy = 1;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx = -1;
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx = 1;

    if (dx !== 0 || dy !== 0) {
        // Normalizar diagonal
        const length = Math.sqrt(dx * dx + dy * dy);
        scout.move(dx / length, dy / length);
    } else {
        scout.isMoving = false;
    }
}

// ============================================
// LOOP PRINCIPAL DEL JUEGO
// ============================================
function gameLoop() {
    if (gameState === 'playing') {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Actualizar ciclo día/noche
        dayNightCycle.update();

        // Dibujar fondo
        drawBackground();

        // Dibujar items
        items.forEach(item => item.draw());

        // Dibujar NPCs
        npcs.forEach(npc => {
            npc.draw(ctx);
            npc.drawInteractionPrompt(ctx, scout.x, scout.y);
        });

        // Actualizar movimiento
        updateMovement();

        // Dibujar scout
        scout.draw();

        // Actualizar y dibujar partículas
        particles = particles.filter(p => !p.isDead());
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        // Actualizar UI
        scout.updateUI();

        // Dibujar mensajes
        drawMessages();

        // Dibujar reloj
        dayNightCycle.drawClock(ctx, 10, 10);

        // Dibujar nombre de zona actual
        if (currentZoneObject) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.strokeStyle = '#2d5016';
            ctx.lineWidth = 4;
            ctx.font = 'bold 22px Arial';
            const zoneText = `${currentZoneObject.icon} ${currentZoneObject.displayName}`;
            const textWidth = ctx.measureText(zoneText).width;
            const x = canvas.width / 2 - textWidth / 2;
            ctx.strokeText(zoneText, x, 35);
            ctx.fillText(zoneText, x, 35);
            ctx.restore();
        }

        // Dibujar barra de XP
        levelSystem.draw(ctx, 10, 60, 250);

        // Dibujar panel de misiones (solo si está visible)
        if (missionsVisible) {
            missionSystem.draw(ctx, canvas.width - 300, 10);
        }

        // Dibujar inventario (barra rápida)
        inventory.draw(ctx, canvas.width, canvas.height);

        // Indicador de brújula
        if (window.showCompassIndicator) {
            ctx.save();
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 24px Arial';
            ctx.fillText('⬆️ Norte', canvas.width / 2 - 40, 50);
            ctx.restore();
        }

        // Regenerar energía lentamente
        if (scout.energy < scout.maxEnergy && !scout.isMoving) {
            scout.energy = Math.min(scout.maxEnergy, scout.energy + 0.02);
        }
        
        // Verificar logros
        if (achievementSystem) {
            achievementSystem.check();
        }
    }

    // Dibujar sistema de diálogos (siempre encima)
    dialogSystem.draw(ctx, canvas.width, canvas.height);

    // Si el inventario está abierto, dibujarlo completo
    if (inventory.visible) {
        inventory.draw(ctx, canvas.width, canvas.height);
    }

    animationId = requestAnimationFrame(gameLoop);
}

// ============================================
// FUNCIÓN DE CAMBIO DE ZONA
// ============================================
function changeZone(direction) {
    // Mapeo de direcciones a zonas
    const zoneMap = {
        'north': 'mountains',
        'south': 'village',
        'east': 'lake',
        'west': 'meadow'
    };

    const newZoneName = zoneMap[direction] || 'forest';
    currentZone = newZoneName;
    currentZoneObject = getZone(newZoneName);

    // Mostrar mensaje de transición
    showMessage(`${currentZoneObject.icon} Entrando a: ${currentZoneObject.displayName}`);
    playSound('explore');

    // Reposicionar el scout en el lado opuesto
    if (direction === 'north') {
        scout.y = canvas.height - scout.height - 10;
    } else if (direction === 'south') {
        scout.y = 10;
    } else if (direction === 'east') {
        scout.x = 10;
    } else if (direction === 'west') {
        scout.x = canvas.width - scout.width - 10;
    }

    // Regenerar contenido del mundo con items específicos de la zona
    items = currentZoneObject.generateItems(15);
    
    // Regenerar NPCs específicos de la zona
    npcs = currentZoneObject.generateNPCs(3);

    // Añadir XP por explorar nueva zona
    levelSystem.addXP(50);
    scout.points += 25;
    
    // Actualizar misiones
    missionSystem.updateProgress('explore', 1);
    
    // Cambiar sonido ambiente si está disponible
    if (audioSystem && currentZoneObject.ambientSound) {
        audioSystem.playAmbientSound(currentZoneObject.ambientSound);
    }
}

// ============================================
// FUNCIONES DE CONTROL DEL JUEGO
// ============================================
function startGame() {
    gameState = 'playing';
    document.getElementById('start-screen').classList.remove('active');
    
    // Reiniciar scout
    scout = new Scout(canvas.width / 2 - 20, canvas.height - 100);
    window.scout = scout;
    
    // Inicializar zona
    currentZone = 'forest';
    currentZoneObject = getZone('forest');
    
    // Generar contenido del mundo usando el sistema de zonas
    if (currentZoneObject) {
        items = currentZoneObject.generateItems(15);
        npcs = currentZoneObject.generateNPCs(3);
    } else {
        generateItems();
        generateNPCs();
    }
    initializeInventory();
    
    // Generar misiones aleatorias
    missionSystem.generateRandomMissions(3, levelSystem.difficulty);
    
    // Iniciar música ambiental
    if (audioSystem) {
        audioSystem.playAmbientMusic('forest');
        audioSystem.playAmbientSound('birds');
    }
    
    showMessage('¡Bienvenido, Scout! Completa las misiones');
    if (!animationId) {
        gameLoop();
    }
}

function endGame() {
    gameState = 'victory';
    const victoryScreen = document.getElementById('victory-screen');
    const finalStats = document.getElementById('final-stats');
    
    finalStats.innerHTML = `
        <p>Puntos totales: ${scout.points}</p>
        <p>Insignias obtenidas: ${scout.badges.length}/5</p>
        <p>Energía final: ${Math.round(scout.energy)}</p>
        <p>Nivel alcanzado: ${levelSystem.level}</p>
        <p>Misiones completadas: ${missionSystem.completedMissions.length}</p>
    `;
    
    victoryScreen.classList.add('active');
    playSound('victory');
    
    // Detener música
    if (audioSystem) {
        audioSystem.stopMusic();
    }
}

function togglePause() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pause-screen').classList.add('active');
    } else if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pause-screen').classList.remove('active');
    }
}

function restartGame() {
    document.getElementById('victory-screen').classList.remove('active');
    
    // Resetear insignias en el DOM
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        badge.classList.remove('unlocked');
        badge.classList.add('locked');
    });
    
    // Resetear sistemas
    missionSystem = new MissionSystem();
    levelSystem = new LevelSystem();
    dayNightCycle = new DayNightCycle();
    inventory = new Inventory();
    particles = [];
    
    // Actualizar referencias globales
    window.missionSystem = missionSystem;
    window.levelSystem = levelSystem;
    window.dayNightCycle = dayNightCycle;
    window.inventory = inventory;
    
    startGame();
}

// ============================================
// EVENT LISTENERS DE BOTONES Y CONTROLES
// ============================================
function setupEventListeners() {
    document.getElementById('start-button').addEventListener('click', () => {
        // Verificar si hay partida guardada
        if (saveSystem.hasSave()) {
            const load = confirm('¿Deseas continuar tu partida guardada?');
            if (load) {
                startGame();
                const savedData = saveSystem.load();
                saveSystem.applyLoadedData(savedData);
                return;
            }
        }
        startGame();
    });

    document.getElementById('restart-button').addEventListener('click', restartGame);

    document.getElementById('mute-button').addEventListener('click', () => {
        if (audioSystem) {
            const enabled = audioSystem.toggle();
            const btn = document.getElementById('mute-button');
            btn.textContent = enabled ? '🔊' : '🔇';
        }
    });

    document.getElementById('save-button')?.addEventListener('click', () => {
        if (gameState === 'playing') {
            saveSystem.save();
        } else {
            showMessage('Solo puedes guardar durante el juego');
        }
    });

    document.getElementById('load-button')?.addEventListener('click', () => {
        if (gameState === 'playing') {
            const savedData = saveSystem.load();
            if (savedData) {
                saveSystem.applyLoadedData(savedData);
            } else {
                showMessage('No hay partida guardada');
            }
        }
    });

    // Click en canvas para inventario
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        if (inventory.visible) {
            inventory.handleClick(mouseX, mouseY, canvas.width, canvas.height);
        }
    });

    // Guardar antes de cerrar
    window.addEventListener('beforeunload', () => {
        if (gameState === 'playing') {
            saveSystem.save();
        }
    });
}


// ============================================
// INICIALIZACIÓN
// ============================================
function initializeGame() {
    // Inicializar sistemas
    missionSystem = new MissionSystem();
    levelSystem = new LevelSystem();
    dayNightCycle = new DayNightCycle();
    dialogSystem = new DialogSystem();
    inventory = new Inventory();
    
    // Referencias globales (para compatibilidad con otros scripts)
    window.missionSystem = missionSystem;
    window.levelSystem = levelSystem;
    window.dayNightCycle = dayNightCycle;
    window.dialogSystem = dialogSystem;
    window.inventory = inventory;
    
    // Inicializar el scout ahora que el canvas existe
    scout = new Scout(canvas.width / 2 - 20, canvas.height - 100);
    window.scout = scout; // Asignar a la referencia global

    // Configurar listeners
    setupEventListeners();

    // Mostrar la pantalla de inicio
    document.getElementById('start-screen').classList.add('active');
}

// Inicializar cuando la ventana completa esté cargada
window.onload = initializeGame;
