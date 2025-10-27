// ============================================
// CONTROLES MÓVILES TÁCTILES
// ============================================

class MobileControls {
    constructor() {
        this.isMobile = this.detectMobile();
        this.joystickActive = false;
        this.joystickStartPos = { x: 0, y: 0 };
        this.joystickCurrentPos = { x: 0, y: 0 };
        this.maxDistance = 45; // Radio máximo del joystick
        
        // Estado de las teclas simuladas
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };

        if (this.isMobile) {
            this.init();
        }
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 850;
    }

    init() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.classList.add('active');
        }

        this.setupJoystick();
        this.setupActionButtons();
        this.setupCanvasResize();
        
        console.log('Controles móviles activados');
    }

    setupJoystick() {
        const joystickContainer = document.querySelector('.joystick-container');
        const joystickStick = document.getElementById('joystick');
        
        if (!joystickContainer || !joystickStick) return;

        // Touch events para el joystick
        joystickContainer.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.joystickActive = true;
            const rect = joystickContainer.getBoundingClientRect();
            this.joystickStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            this.updateJoystick(e.touches[0]);
        }, { passive: false });

        joystickContainer.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.joystickActive) {
                this.updateJoystick(e.touches[0]);
            }
        }, { passive: false });

        joystickContainer.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.resetJoystick();
        }, { passive: false });

        // Mouse events para pruebas en escritorio
        joystickContainer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.joystickActive = true;
            const rect = joystickContainer.getBoundingClientRect();
            this.joystickStartPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            this.updateJoystick(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.joystickActive) {
                this.updateJoystick(e);
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.joystickActive) {
                this.resetJoystick();
            }
        });
    }

    updateJoystick(touch) {
        const joystickStick = document.getElementById('joystick');
        if (!joystickStick) return;

        const clientX = touch.clientX || touch.pageX;
        const clientY = touch.clientY || touch.pageY;

        // Calcular la distancia y ángulo desde el centro
        let deltaX = clientX - this.joystickStartPos.x;
        let deltaY = clientY - this.joystickStartPos.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Limitar la distancia al radio máximo
        if (distance > this.maxDistance) {
            const angle = Math.atan2(deltaY, deltaX);
            deltaX = Math.cos(angle) * this.maxDistance;
            deltaY = Math.sin(angle) * this.maxDistance;
        }

        // Mover el stick visual
        joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;

        // Actualizar estado de las teclas según la dirección
        this.updateKeysFromJoystick(deltaX, deltaY);
    }

    updateKeysFromJoystick(deltaX, deltaY) {
        const threshold = 15; // Umbral mínimo para activar dirección

        // Resetear todas las direcciones
        this.keys.ArrowUp = false;
        this.keys.ArrowDown = false;
        this.keys.ArrowLeft = false;
        this.keys.ArrowRight = false;

        // Activar según la dirección
        if (Math.abs(deltaY) > threshold) {
            if (deltaY < 0) {
                this.keys.ArrowUp = true;
                this.simulateKeyEvent('keydown', 'ArrowUp');
            } else {
                this.keys.ArrowDown = true;
                this.simulateKeyEvent('keydown', 'ArrowDown');
            }
        }

        if (Math.abs(deltaX) > threshold) {
            if (deltaX < 0) {
                this.keys.ArrowLeft = true;
                this.simulateKeyEvent('keydown', 'ArrowLeft');
            } else {
                this.keys.ArrowRight = true;
                this.simulateKeyEvent('keydown', 'ArrowRight');
            }
        }
    }

    resetJoystick() {
        this.joystickActive = false;
        const joystickStick = document.getElementById('joystick');
        if (joystickStick) {
            joystickStick.style.transform = 'translate(-50%, -50%)';
        }

        // Liberar todas las teclas de dirección
        Object.keys(this.keys).forEach(key => {
            if (this.keys[key]) {
                this.keys[key] = false;
                this.simulateKeyEvent('keyup', key);
            }
        });
    }

    setupActionButtons() {
        const actionButtons = document.querySelectorAll('.action-button');
        
        actionButtons.forEach(button => {
            const action = button.getAttribute('data-action');
            
            // Touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.classList.add('pressed');
                this.simulateKeyEvent('keydown', action);
            }, { passive: false });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.classList.remove('pressed');
                this.simulateKeyEvent('keyup', action);
            }, { passive: false });

            // Mouse events para pruebas
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                button.classList.add('pressed');
                this.simulateKeyEvent('keydown', action);
            });

            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                button.classList.remove('pressed');
                this.simulateKeyEvent('keyup', action);
            });

            button.addEventListener('mouseleave', () => {
                button.classList.remove('pressed');
                this.simulateKeyEvent('keyup', action);
            });
        });
    }

    simulateKeyEvent(type, key) {
        // Convertir acción a key code
        const keyMap = {
            'space': ' ',
            'e': 'e',
            'r': 'r',
            't': 't',
            'h': 'h',
            'i': 'i'
        };

        const mappedKey = keyMap[key] || key;

        // Crear y despachar evento
        const event = new KeyboardEvent(type, {
            key: mappedKey,
            code: key === 'space' ? 'Space' : `Key${mappedKey.toUpperCase()}`,
            keyCode: mappedKey.charCodeAt(0),
            which: mappedKey.charCodeAt(0),
            bubbles: true,
            cancelable: true
        });

        document.dispatchEvent(event);
    }

    setupCanvasResize() {
        // Hacer el canvas responsive
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;

        const resizeCanvas = () => {
            const container = document.getElementById('game-container');
            if (!container) return;

            const containerWidth = container.clientWidth - 60; // Padding
            const maxCanvasWidth = 800;
            const maxCanvasHeight = 600;
            
            let newWidth = Math.min(containerWidth, maxCanvasWidth);
            let newHeight = (newWidth * maxCanvasHeight) / maxCanvasWidth;

            // Ajustar para pantallas muy pequeñas
            if (window.innerWidth <= 500) {
                const maxHeight = window.innerHeight * 0.5;
                if (newHeight > maxHeight) {
                    newHeight = maxHeight;
                    newWidth = (newHeight * maxCanvasWidth) / maxCanvasHeight;
                }
            }

            // No cambiar el tamaño lógico del canvas, solo el CSS
            canvas.style.width = newWidth + 'px';
            canvas.style.height = newHeight + 'px';
        };

        // Resize inicial
        resizeCanvas();

        // Resize en cambios de orientación y tamaño
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('orientationchange', () => {
            setTimeout(resizeCanvas, 100);
        });
    }

    // Método público para verificar si una tecla está presionada (útil para game.js)
    isKeyPressed(key) {
        return this.keys[key] || false;
    }
}

// Inicializar controles móviles cuando el DOM esté listo
let mobileControls;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mobileControls = new MobileControls();
    });
} else {
    mobileControls = new MobileControls();
}

// Exportar para uso en otros scripts
window.mobileControls = mobileControls;
