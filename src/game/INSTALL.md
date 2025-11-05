# Guia de Instalacion y Ejecucion

## Requisitos

- Navegador web moderno (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Servidor web local (opcional pero recomendado)

## 🎮 Métodos de Ejecución

### Método 1: Abrir directamente (Más simple)

1. Navega a la carpeta del proyecto
2. Haz doble clic en `index.html`
3. El juego se abrirá en tu navegador predeterminado

**Nota:** Algunos navegadores pueden bloquear localStorage en archivos locales.

### Método 2: Servidor HTTP con Python (Recomendado)

```bash
# Si tienes Python 3 instalado:
python -m http.server 8000

# Si tienes Python 2:
python -m SimpleHTTPServer 8000

# Luego abre en tu navegador:
# http://localhost:8000
```

### Método 3: Live Server en VS Code (Mejor para desarrollo)

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `index.html`
3. Selecciona "Open with Live Server"
4. El juego se abrirá automáticamente con hot-reload

### Método 4: Node.js con http-server

```bash
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar en la carpeta del proyecto
http-server -p 8000

# Abrir: http://localhost:8000
```

## Primera Vez Jugando

### Tutorial Rápido

1. **Lee las instrucciones** en la pantalla de inicio
2. **Haz clic en "Iniciar Aventura"**
3. **Muévete** con las flechas del teclado
4. **Acércate a objetos brillantes** y presiona `R` para recolectar
5. **Habla con NPCs** presionando `T` cuando estés cerca
6. **Abre tu inventario** con `I` para ver tus items
7. **Completa misiones** visibles en el panel derecho
8. **Gana 5 insignias** para completar el juego

### Consejos Iniciales

- **Gestiona tu energia**: Acampa (Espacio) cuando bajes de 30
- 🌙 **Usa la linterna de noche**: Presiona `1` si está en tu inventario
- **Usa la brujula**: Presiona `1` para orientarte
- 💬 **Habla con todos**: Los NPCs dan misiones especiales
- 💾 **Guarda a menudo**: Usa el botón 💾 o el guardado automático

## Solucion de Problemas

### El juego no carga

**Problema:** Pantalla en blanco o errores en consola

**Solución:**
1. Abre la consola del navegador (F12)
2. Verifica errores de JavaScript
3. Asegúrate de que todos los archivos estén en la misma carpeta
4. Usa un servidor HTTP local

### Los controles no responden

**Problema:** Las teclas no hacen nada

**Solución:**
1. Haz clic en el canvas del juego para darle foco
2. Asegúrate de que el juego esté en estado "playing"
3. Verifica que no haya diálogos abiertos (presiona ESC)

### No hay sonido

**Problema:** El juego está silencioso

**Solución:**
1. Verifica el botón de sonido (🔊/🔇) en la esquina superior derecha
2. Verifica el volumen de tu navegador
3. Algunos navegadores bloquean audio automático - interactúa primero
4. Web Audio API requiere HTTPS o localhost

### El guardado no funciona

**Problema:** No se guarda el progreso

**Solución:**
1. Verifica que localStorage esté habilitado en tu navegador
2. No uses modo incógnito/privado
3. Usa un servidor HTTP local en lugar de file://
4. Limpia la caché del navegador si hay errores

### Rendimiento lento

**Problema:** FPS bajos o lag

**Solución:**
1. Cierra otras pestañas del navegador
2. Actualiza tu navegador a la última versión
3. Desactiva extensiones del navegador
4. Reduce la resolución de tu pantalla

## 📊 Verificar Instalación

Después de abrir el juego, verifica en la consola (F12):

```
🏕️ Aventura Scout - Versión Mejorada cargada correctamente
Controles: Flechas = Mover | Espacio = Acampar | E = Explorar | R = Recolectar | H = Ayudar
P = Pausa | I = Inventario | T = Hablar con NPCs

Nuevas características:
✅ Sistema de misiones dinámicas
✅ Niveles y experiencia (XP)
✅ Ciclo día/noche
✅ NPCs con diálogos
✅ Sistema de inventario
✅ Efectos de sonido y música
✅ Partículas y efectos visuales
```

Si ves este mensaje, todo esta funcionando correctamente.

## Subir a Internet

### GitHub Pages (Gratis)

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings → Pages
4. Selecciona la rama `main` y carpeta `/root`
5. Guarda y espera unos minutos
6. Tu juego estará en: `https://tu-usuario.github.io/nombre-repo`

### Netlify (Gratis, más rápido)

1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta del proyecto
3. Tu juego estará online en minutos
4. URL personalizada gratuita

### Vercel (Gratis)

1. Instala Vercel CLI: `npm i -g vercel`
2. En la carpeta del proyecto: `vercel`
3. Sigue las instrucciones
4. Deployment automático

### Itch.io (Para juegos, gratis)

1. Crea una cuenta en [itch.io](https://itch.io)
2. Crea un nuevo proyecto HTML5
3. Sube todos los archivos en un ZIP
4. Marca `index.html` como archivo principal
5. Publica tu juego

## Desarrollo y Modificacion

### Estructura de Archivos

- `index.html` - Estructura HTML, no tocar mucho
- `style.css` - Personalizar colores, fuentes, layout
- `game.js` - Lógica principal, modificar con cuidado
- `systems.js` - Misiones, niveles, día/noche
- `npcs.js` - NPCs y diálogos (fácil de editar)
- `inventory.js` - Items y inventario
- `audio.js` - Sonidos (cambiar frecuencias)
- `save.js` - Guardado y logros

### Modificaciones Comunes

#### Cambiar dificultad

En `game.js`, busca la clase `Scout`:

```javascript
this.speed = 3; // Aumentar para ir más rápido
this.maxEnergy = 100; // Aumentar para más resistencia
```

#### Agregar nuevos items

En `inventory.js`, añade a `ITEM_TYPES`:

```javascript
mi_item: {
    id: 'mi_item',
    name: 'Mi Item',
    description: 'Descripción',
    icon: '🎁',
    stackable: true,
    consumable: false,
    onUse: function() {
        // Tu código aquí
    }
}
```

#### Crear nuevos NPCs

En `game.js`, en la función `generateNPCs()`:

```javascript
npcs.push(new NPC(x, y, 'scout', 'Nombre'));
```

Luego edita sus diálogos en `npcs.js`.

#### Cambiar sonidos

En `audio.js`, modifica las frecuencias:

```javascript
case 'explore':
    this.playTone(400, 0.1); // Cambiar 400 por otra frecuencia
    break;
```

## 📱 Hacer Responsive

Para adaptar a móviles, edita `style.css`:

```css
@media (max-width: 600px) {
    #gameCanvas {
        width: 100vw;
        height: 60vh;
    }
}
```

## 🆘 Soporte

- **GitHub Issues**: Reporta bugs en el repositorio
- **Documentación**: Lee el README.md completo
- **Consola**: Revisa errores con F12
- **Community**: Comparte en [itch.io](https://itch.io) o Reddit

## 📜 Licencia

Código abierto para uso educativo. Puedes:
- ✅ Usar en proyectos escolares
- ✅ Modificar y distribuir
- ✅ Aprender del código
- ✅ Subir tu versión modificada

Menciona el proyecto original si lo compartes. 🙏

---

**¡Disfruta del juego y Siempre Listo!** 🏕️
