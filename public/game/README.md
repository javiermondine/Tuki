# 🏕️ Aventura Scout - Juego Educativo (Versión 2.0)

Un videojuego educativo completo sobre los scouts, donde el jugador completa misiones de exploración, acampada y servicio para ganar insignias. **Ahora con ciclo día/noche, NPCs interactivos, inventario, misiones dinámicas y mucho más!**

![Scout Game](https://img.shields.io/badge/Estado-Completo-success)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Styled-blue)
![Version](https://img.shields.io/badge/Version-2.0-green)

## 🎮 Características (Actualizado)

### ⭐ Características Principales
- **Personaje Principal**: Scout completamente animado con uniforme, mochila y pañoleta
- **Sistema de Misiones Dinámicas**: Misiones aleatorias que cambian cada partida
- **Sistema de Niveles y XP**: Progresión con 3 dificultades (Explorador, Guía, Líder)
- **Ciclo Día/Noche**: El mundo cambia entre día, amanecer, atardecer y noche
- **NPCs Interactivos**: Otros scouts, jefe scout y animales con diálogos tipo RPG
- **Sistema de Inventario**: 12 items únicos (brújula, linterna, cuerda, mapa, etc.)
- **Sistema de Insignias**: 5 insignias desbloqueables
- **Sistema de Guardado**: Guarda tu progreso automáticamente
- **Sistema de Logros**: 8 logros secretos para desbloquear
- **Efectos de Sonido**: Web Audio API con síntesis de audio
- **Partículas y Efectos**: Fuego, efectos visuales mejorados
- **Música Ambiental**: Música dinámica según el escenario

### 🆕 Nuevas Características v2.0

#### 🌙 Ciclo Día/Noche
- 4 fases: Día, Amanecer, Atardecer, Noche
- Cambio de iluminación y colores del cielo
- Sol durante el día, Luna y estrellas durante la noche
- Misiones específicas según la hora

#### 📋 Sistema de Misiones Dinámicas
- 8 tipos diferentes de misiones
- Generación aleatoria cada partida
- Progreso en tiempo real
- Recompensas según dificultad

#### 💬 NPCs y Diálogos
- **Lucas** - Scout compañero que necesita ayuda
- **Jefe Pedro** - Líder que enseña valores scout
- **Mapache** - Animal curioso del bosque
- Sistema de opciones múltiples
- Misiones especiales de NPCs

#### 🎒 Sistema de Inventario Completo
- 12 items únicos con funciones reales:
  - 🧭 **Brújula**: Muestra el norte
  - 🔦 **Linterna**: Ilumina en la noche
  - 🪢 **Cuerda**: Permite escalar
  - 🗺️ **Mapa**: Muestra el mapa del mundo
  - 🩹 **Botiquín**: +50 energía
  - 💧 **Cantimplora**: +30 energía
  - 🍖 **Comida**: +40 energía
  - 📣 **Silbato**: Llama a otros scouts
  - 🔥 **Fósforos**: Enciende fogatas
  - 🔭 **Binoculares**: Ver más lejos
  - 📖 **Manual Scout**: Tips y guías
  - 🏆 **Trofeo**: Premio especial

#### 🎖️ Sistema de Niveles y Experiencia
- Gana XP por cada acción
- 3 niveles de dificultad progresivos
- Bonificaciones por subir de nivel
- Multiplicadores de recompensa

#### 💾 Sistema de Guardado
- Guardado automático cada 30 segundos
- Guardado manual (botón 💾)
- Carga de partida guardada
- Guardado antes de cerrar
- Exportar/Importar partidas

#### 🏆 Sistema de Logros
- 8 logros desbloqueables
- Notificaciones visuales
- Progreso persistente
- Recompensas especiales

## 🎯 Objetivo del Juego

Completa misiones scout para obtener las **5 insignias** y convertirte en un **Scout Líder**:

1. 🧭 **Explorador** - Alcanza 100 puntos explorando
2. ⛺ **Campista** - Acampa para recuperar energía completa
3. 🌿 **Recolector** - Alcanza 200 puntos recolectando objetos
4. 🤝 **Servicial** - Alcanza 300 puntos ayudando a otros
5. 👑 **Líder** - Alcanza 400 puntos y completa todas las misiones

## 🕹️ Controles (Actualizado)

### Movimiento
- **↑ ↓ ← →** (Flechas) - Mover al scout
- **W A S D** - Movimiento alternativo

### Acciones Principales
- **ESPACIO** - Acampar (recupera 30 de energía)
- **E** - Explorar área (gana puntos, cuesta energía)
- **R** - Recolectar objeto cercano
- **H** - Ayudar a otros (misión de servicio)

### Interacción y UI
- **T** - Hablar con NPCs / Interactuar
- **I** - Abrir/Cerrar inventario
- **P** - Pausar/Reanudar juego
- **1-6** - Usar item de barra rápida
- **ESC** - Cerrar inventario/diálogos

### Controles de Guardado
- **�** - Guardar partida (botón superior derecha)
- **📂** - Cargar partida (botón superior derecha)
- **🔊/🔇** - Activar/Desactivar sonido

## 📊 Sistema de Puntos

| Acción | Puntos | Energía |
|--------|--------|---------|
| Explorar | +15 | -10 |
| Recolectar Hoja 🍃 | +10 | 0 |
| Recolectar Piedra 🪨 | +15 | 0 |
| Recolectar Flor 🌸 | +20 | 0 |
| Recolectar Hongo 🍄 | +25 | 0 |
| Ayudar | +25 | -15 |
| Acampar | 0 | +30 |
| Caminar | 0 | -0.05/frame |

## 🏗️ Estructura del Proyecto (Actualizada)

```
Fiumba/
├── index.html          # Estructura HTML principal
├── style.css           # Estilos y animaciones
├── game.js             # Lógica principal del juego
├── systems.js          # Sistemas de misiones, niveles y día/noche
├── npcs.js             # NPCs y sistema de diálogos
├── inventory.js        # Sistema de inventario e items
├── audio.js            # Sistema de audio con Web Audio API
├── save.js             # Sistema de guardado y logros
└── README.md           # Documentación
```

## 🚀 Cómo Jugar

1. **Abrir el juego**: 
   - Abre `index.html` en tu navegador web
   - O usa Live Server en VS Code para mejor experiencia

2. **Iniciar**:
   - Haz clic en "🚀 Iniciar Aventura"
   - Lee las instrucciones en la pantalla de inicio

3. **Jugar**:
   - Mueve al scout con las flechas del teclado
   - Acércate a objetos brillantes (🍃🪨🌸🍄) y presiona **R** para recolectar
   - Presiona **E** para explorar y ganar puntos
   - Presiona **ESPACIO** cerca de la tienda para acampar y recuperar energía
   - Presiona **H** para realizar misiones de servicio
   - Observa tu progreso en el panel superior

4. **Ganar**:
   - Desbloquea las 5 insignias completando misiones
   - ¡Conviértete en Scout Líder!

## 🎨 Características Técnicas

### HTML5 Canvas
- Renderizado 2D con Canvas API
- Dimensiones: 800x600 px
- Animaciones fluidas a 60 FPS

### JavaScript ES6+
- **Programación Orientada a Objetos**: Clases Scout e Item
- **Game Loop**: Ciclo de actualización continuo
- **Sistema de Eventos**: Gestión de teclado y UI
- **Detección de Colisiones**: Radio de detección para objetos
- **Sistema de Estados**: Menu, Playing, Paused, Victory

### CSS3
- **Diseño Responsive**: Se adapta a diferentes tamaños de pantalla
- **Animaciones CSS**: Transiciones suaves y efectos visuales
- **Gradientes**: Colores naturales inspirados en scouts
- **Flexbox/Grid**: Layout moderno y flexible

## 🎓 Valores Scout Incluidos

El juego está diseñado para enseñar y reforzar valores scout:

- **🌲 Respeto por la Naturaleza**: Recolecta objetos del bosque con cuidado
- **⛺ Vida al Aire Libre**: Acampa y explora el entorno
- **🤝 Servicio a los Demás**: Ayuda a otros scouts
- **💪 Superación Personal**: Completa misiones para mejorar
- **👑 Liderazgo**: Conviértete en un Scout Líder

## 🛠️ Personalización

### Modificar Dificultad
En `game.js`, puedes ajustar:

```javascript
// Velocidad del scout
this.speed = 3; // Cambiar a 4 o 5 para mayor velocidad

// Energía máxima
this.maxEnergy = 100; // Aumentar a 150 para más resistencia

// Costos de energía
this.energy = Math.max(0, this.energy - 10); // En método explore()
```

### Añadir Más Objetos
```javascript
// En generateItems()
const itemCount = 15; // Aumentar a 20 o 30 para más objetos
```

### Cambiar Requisitos de Insignias
```javascript
// En checkBadgeProgress()
if (this.points >= 100 && !this.badges.includes('explorer')) {
    // Cambiar 100 a otro valor
}
```

## 🐛 Solución de Problemas

### El juego no se carga
- Asegúrate de que todos los archivos (HTML, CSS, JS) estén en la misma carpeta
- Abre la consola del navegador (F12) para ver errores
- Verifica que tu navegador soporte HTML5 Canvas

### El scout no se mueve
- Haz clic en el canvas para darle foco
- Verifica que el juego esté en estado "playing" (no en menú o pausa)

### Los controles no responden
- Asegúrate de que el juego tenga foco (haz clic en el canvas)
- Verifica que JavaScript esté habilitado en tu navegador

## 🔮 Futuras Mejoras

Ideas para expandir el juego:

- [x] ~~Añadir música de fondo y efectos de sonido reales (Web Audio API)~~
- [x] ~~Sistema de guardado local (LocalStorage)~~
- [x] ~~Más tipos de misiones~~
- [x] ~~Sistema de logros adicionales~~
- [x] ~~Sprites animados más detallados~~
- [x] ~~Sistema de día/noche~~
- [ ] Múltiples niveles con diferentes escenarios (bosque, lago, montaña)
- [ ] Sistema de minimapa con fog of war
- [ ] Multiplayer local (dos scouts en pantalla)
- [ ] Modo historia con diálogos extendidos
- [ ] Minijuegos (hacer fuego, orientación con brújula, primeros auxilios)
- [ ] Sistema de crafting (combinar items)
- [ ] Más NPCs y animales
- [ ] Eventos climáticos (lluvia, nieve)
- [ ] Base de campamento mejorable
- [ ] Clasificación global con backend

## 👨‍💻 Desarrollo

### Tecnologías Utilizadas
- HTML5
- CSS3
- JavaScript (Vanilla ES6+)
- Canvas API

### Compatibilidad
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📝 Notas de Desarrollo

Este juego fue creado como proyecto educativo para enseñar:
- Programación de videojuegos con JavaScript
- Uso de HTML5 Canvas
- Programación Orientada a Objetos
- Gestión de estados en aplicaciones
- Desarrollo de interfaces interactivas

## 🎉 Créditos

Desarrollado con ❤️ para la comunidad Scout

### Inspiración
- Movimiento Scout Mundial
- Valores y principios del escultismo
- Juegos educativos clásicos

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo.

---

**¡Siempre Listo!** 🏕️

¿Preguntas o sugerencias? ¡Abre un issue o contribuye al proyecto!
