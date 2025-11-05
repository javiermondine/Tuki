# AVENTURA SCOUT v2.0 - Resumen Rapido

## Que es esto

Un **videojuego educativo completo** sobre scouts hecho con HTML5, CSS3 y JavaScript puro. Sin frameworks, sin dependencias, 100% código abierto.

## Iniciar en 3 Pasos

```bash
# 1. Navega a la carpeta
cd Fiumba

# 2. Inicia un servidor local
python3 -m http.server 8000

# 3. Abre en tu navegador
# http://localhost:8000
```

O simplemente **abre `index.html`** en tu navegador.

## Como Jugar

1. **Muevete:** Flechas (arriba/abajo/izquierda/derecha)
2. **Explora:** Presiona `E`
3. **Recolecta:** Presiona `R` cerca de objetos
4. **Habla:** Presiona `T` cerca de NPCs
5. **Inventario:** Presiona `I`
6. **Objetivo:** Conseguir 5 insignias

## Caracteristicas Principales

### Lo Nuevo en v2.0
- **Misiones dinamicas** (aleatorias cada partida)
- **Sistema de niveles y XP**
- **Ciclo dia/noche** (4 fases)
- **3 NPCs interactivos** con dialogos
- **12 items funcionales** en inventario
- **Audio procedural** (Web Audio API)
- **Guardado automatico** (LocalStorage)
- **8 logros desbloqueables**
- **Efectos de particulas**

## 📁 Archivos del Proyecto

```
Fiumba/
├── 🎮 JUEGO
│   ├── index.html         (Estructura)
│   ├── style.css          (Estilos)
│   ├── game.js            (Lógica principal)
│   ├── systems.js         (Misiones, niveles, día/noche)
│   ├── npcs.js            (NPCs y diálogos)
│   ├── inventory.js       (Inventario)
│   ├── audio.js           (Sonidos)
│   └── save.js            (Guardado y logros)
│
└── 📚 DOCS
    ├── README.md          (Documentación principal)
    ├── INSTALL.md         (Guía de instalación)
    ├── INDEX.md           (Índice de documentación)
    ├── CHANGELOG.md       (Historial de cambios)
    ├── ACHIEVEMENTS_GUIDE.md (Guía de logros)
    ├── EXECUTIVE_SUMMARY.md (Resumen técnico)
    └── CREDITS.md         (Créditos y licencia)
```

## 📊 Estadísticas

- **Líneas de código:** 2000+
- **Archivos JS:** 8 archivos modulares
- **Tamaño total:** ~120KB (sin minificar)
- **Tiempo de carga:** <2 segundos
- **FPS:** 60 constantes
- **Dependencias:** 0 (Vanilla JS)

## 🎯 Características Completas

### Gameplay
- ✅ Personaje animado con 4 direcciones
- ✅ 5 insignias desbloqueables
- ✅ Sistema de energía (0-100)
- ✅ Sistema de puntos con multiplicadores
- ✅ 4 acciones principales (explorar, acampar, recolectar, ayudar)
- ✅ 15+ objetos recolectables
- ✅ Regeneración pasiva de energía
- ✅ Movimiento diagonal normalizado

### Sistemas Avanzados
- ✅ Misiones dinámicas (8 tipos)
- ✅ Niveles infinitos con XP
- ✅ 3 dificultades (Explorador, Guía, Líder)
- ✅ Ciclo día/noche (4 fases)
- ✅ 3 NPCs con personalidades únicas
- ✅ Sistema de diálogos con opciones
- ✅ Inventario (12 items funcionales)
- ✅ Guardado automático y manual
- ✅ 8 logros con progreso
- ✅ Sistema de partículas

### Audio
- ✅ Web Audio API con síntesis
- ✅ 10+ efectos de sonido
- ✅ Música ambiental por escenario
- ✅ Sonidos ambientales (pájaros, grillos, fuego)
- ✅ Control de volumen independiente

### Visual
- ✅ Sprites dibujados con Canvas
- ✅ Animaciones fluidas
- ✅ Efectos de luz (linterna de noche)
- ✅ Partículas de fuego
- ✅ Sol/Luna animados
- ✅ Cambios de color por hora del día
- ✅ UI responsive

### Progresión
- ✅ 5 insignias principales
- ✅ Sistema de niveles (1-∞)
- ✅ 8 logros secretos
- ✅ Misiones completadas persistentes
- ✅ Guardado de inventario
- ✅ Estadísticas finales

## 🎮 Controles Completos

| Tecla | Acción |
|-------|--------|
| ⬆️⬇️⬅️➡️ | Mover |
| WASD | Mover (alternativo) |
| E | Explorar |
| R | Recolectar |
| H | Ayudar |
| Espacio | Acampar |
| T | Hablar con NPCs |
| I | Abrir inventario |
| P | Pausa |
| 1-6 | Usar item rápido |
| ESC | Cerrar ventanas |

## 🏆 Logros (8 Total)

1. 👣 Primeros Pasos - Completa tu primera misión
2. 🧭 Explorador Incansable - Explora 50 veces
3. 🌿 Coleccionista - Recolecta 100 objetos
4. 💬 Scout Social - Habla con todos los NPCs
5. 🦉 Búho Nocturno - Explora durante la noche
6. 🎖️ Maestro Scout - Alcanza el nivel 20
7. 🎒 Acumulador - Llena tu inventario
8. ⚡ Velocista - 5 insignias en <10 minutos

## 🎒 Items del Inventario (12 Total)

1. 🧭 Brújula - Muestra el norte
2. 🔦 Linterna - Ilumina de noche
3. 🪢 Cuerda - Permite escalar
4. 🗺️ Mapa - Vista del mundo
5. 🩹 Botiquín - +50 energía
6. 💧 Cantimplora - +30 energía
7. 🍖 Comida - +40 energía
8. 📣 Silbato - Llama NPCs
9. 🔥 Fósforos - Hace fogatas
10. 🔭 Binoculares - Zoom
11. 📖 Manual Scout - Tips
12. 🏆 Trofeo - Especial

## 💬 NPCs del Juego (3 Total)

1. **Lucas** 🧑 - Scout compañero (quiere ayuda)
2. **Jefe Pedro** 👴 - Líder sabio (enseña valores)
3. **Mapache** 🦝 - Animal curioso (guía secretos)

## 📋 Tipos de Misiones (8 Total)

1. 🧭 Explorador del Bosque - Explora 5 veces
2. 🌿 Recolector Experto - Recolecta 10 objetos
3. 🤝 Scout Servicial - Ayuda 5 veces
4. ⛺ Maestro del Campamento - Acampa 3 veces
5. 🌙 Explorador Nocturno - Explora de noche
6. 🌸 Guardián del Bosque - Recolecta 5 flores
7. ⚡ Experto en Supervivencia - Mantén 50% energía
8. 💎 Cazador de Tesoros - Encuentra el tesoro

## 🌙 Ciclo Día/Noche

- **00:00-04:00** 🌙 Noche (oscuro, luna, estrellas)
- **04:00-06:00** 🌅 Amanecer (colores rosados)
- **06:00-16:00** ☀️ Día (brillante, sol, nubes)
- **16:00-18:00** 🌇 Atardecer (colores naranjas)
- **18:00-24:00** 🌙 Noche

## 🎓 Valores Scout Enseñados

- 🤝 **Servicio** - Ayudar a otros
- 🌲 **Naturaleza** - Respeto al ambiente
- ⛺ **Supervivencia** - Gestión de recursos
- 💪 **Superación** - Progresión personal
- 👥 **Comunidad** - Interacción social
- 🧭 **Orientación** - Uso de herramientas
- 📚 **Aprendizaje** - Conocimiento scout

## 📝 Licencia

**MIT License** - Código abierto y libre para:
- ✅ Uso educativo
- ✅ Modificación
- ✅ Distribución
- ✅ Uso comercial

## 🔗 Enlaces Útiles

- 📖 [README completo](README.md)
- 🚀 [Guía de instalación](INSTALL.md)
- 🏆 [Guía de logros](ACHIEVEMENTS_GUIDE.md)
- 📊 [Resumen ejecutivo](EXECUTIVE_SUMMARY.md)
- 📝 [Historial de cambios](CHANGELOG.md)
- 🎨 [Créditos](CREDITS.md)
- 📚 [Índice completo](INDEX.md)

## 🐛 Problemas Comunes

### No carga el juego
- Usa un servidor HTTP local (no file://)
- Verifica que todos los archivos estén en la misma carpeta
- Revisa la consola (F12) para errores

### No hay sonido
- Haz clic en el juego primero
- Verifica el botón 🔊 (esquina superior)
- Web Audio API requiere interacción del usuario

### No guarda el progreso
- No uses modo incógnito
- Verifica que localStorage esté habilitado
- Usa un servidor HTTP local

## ⚡ Quick Start para Desarrolladores

```javascript
// Estructura modular clara:
game.js      // Loop, rendering, controles
systems.js   // Misiones, niveles, día/noche
npcs.js      // NPCs, diálogos, interacciones
inventory.js // Items, inventario, UI
audio.js     // Web Audio API, síntesis
save.js      // LocalStorage, logros

// Sin dependencias, 100% Vanilla JS
// Arquitectura orientada a objetos
// Código comentado y documentado
```

## 🌟 Lo Mejor del Proyecto

1. **Sin dependencias** - Vanilla JS puro
2. **Código limpio** - Bien documentado
3. **Modular** - Fácil de mantener
4. **Educativo** - Valores scout integrados
5. **Completo** - 40+ características
6. **Open Source** - MIT License
7. **Portable** - Funciona en cualquier navegador
8. **Ligero** - Solo 120KB

## 🎉 Disfruta el Juego

**¡Siempre Listo!** 🏕️

---

**Versión:** 2.0.0  
**Fecha:** Octubre 2025  
**Código:** HTML5 + CSS3 + JavaScript ES6+  
**Tamaño:** ~120KB  
**Tiempo de juego:** 30-45 minutos
