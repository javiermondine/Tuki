// ============================================
// PWA INSTALL HANDLER
// Manejador de instalación de Progressive Web App
// ============================================

class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Verificar si ya está instalada
        if (window.matchMedia('(display-mode: standalone)').matches) {
            this.isInstalled = true;
            console.log('✅ La app ya está instalada');
            return;
        }

        // Crear botón de instalación SIEMPRE (incluso sin beforeinstallprompt)
        this.createInstallButton();
        
        // Mostrar el botón inmediatamente
        setTimeout(() => {
            this.showInstallButton();
        }, 2000);

        // Escuchar evento de instalación disponible
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 Instalación disponible');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Detectar cuando se instala
        window.addEventListener('appinstalled', () => {
            console.log('✅ App instalada exitosamente');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showSuccessMessage();
        });

        // Para iOS - mostrar instrucciones
        if (this.isIOS() && !this.isInstalled) {
            this.showIOSInstructions();
        }
    }

    createInstallButton() {
        // Verificar si ya existe
        if (document.getElementById('pwa-install-button')) return;

        // Crear contenedor del botón
        const container = document.createElement('div');
        container.id = 'pwa-install-container';
        container.className = 'pwa-install-container';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: none;
        `;

        // Crear botón
        const button = document.createElement('button');
        button.id = 'pwa-install-button';
        button.className = 'pwa-install-button';
        button.innerHTML = `
            <span class="pwa-icon">📱</span>
            <span class="pwa-text">Instalar App</span>
        `;
        button.style.cssText = `
            background: linear-gradient(135deg, #5f3dc4, #7c5cff);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            box-shadow: 0 8px 24px rgba(95, 61, 196, 0.4);
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            font-family: 'Nunito', sans-serif;
        `;

        // Botón de cerrar
        const closeButton = document.createElement('button');
        closeButton.className = 'pwa-close-button';
        closeButton.innerHTML = '×';
        closeButton.style.cssText = `
            background: rgba(0, 0, 0, 0.2);
            color: white;
            border: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 1;
            margin-left: 8px;
            transition: all 0.2s ease;
        `;

        closeButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideInstallButton();
            localStorage.setItem('pwa-install-dismissed', Date.now());
        });

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = 'rgba(0, 0, 0, 0.4)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = 'rgba(0, 0, 0, 0.2)';
        });

        button.addEventListener('click', () => this.installApp());
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
            button.style.boxShadow = '0 12px 32px rgba(95, 61, 196, 0.5)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 8px 24px rgba(95, 61, 196, 0.4)';
        });

        container.appendChild(button);
        container.appendChild(closeButton);
        document.body.appendChild(container);

        this.installButton = container;
    }

    showInstallButton() {
        if (!this.installButton) return;

        this.installButton.style.display = 'flex';
        this.installButton.style.animation = 'slideInUp 0.5s ease';

        // Agregar animación CSS
        if (!document.getElementById('pwa-animations')) {
            const style = document.createElement('style');
            style.id = 'pwa-animations';
            style.textContent = `
                @keyframes slideInUp {
                    from {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutDown {
                    from {
                        transform: translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateY(100px);
                        opacity: 0;
                    }
                }
                @media (max-width: 600px) {
                    .pwa-install-container {
                        bottom: 10px !important;
                        right: 10px !important;
                    }
                    .pwa-install-button {
                        padding: 10px 20px !important;
                        font-size: 14px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideInstallButton() {
        if (!this.installButton) return;
        this.installButton.style.animation = 'slideOutDown 0.5s ease';
        setTimeout(() => {
            this.installButton.style.display = 'none';
        }, 500);
    }

    async installApp() {
        if (!this.deferredPrompt) {
            console.log('ℹ️ Mostrando página de instalación manual');
            // Redirigir a página de instalación con instrucciones
            window.location.href = 'install.html';
            return;
        }

        // Mostrar el prompt nativo
        this.deferredPrompt.prompt();

        // Esperar la respuesta del usuario
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ Usuario aceptó la instalación');
        } else {
            console.log('❌ Usuario rechazó la instalación');
            localStorage.setItem('pwa-install-dismissed', Date.now());
        }

        // Limpiar el prompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #4caf50, #66bb6a);
            color: white;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4);
            z-index: 10000;
            font-family: 'Nunito', sans-serif;
            animation: slideInDown 0.5s ease;
        `;
        message.innerHTML = '✅ ¡App instalada exitosamente!';

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes slideInDown {
                from {
                    transform: translate(-50%, -100px);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, 0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(message);

        setTimeout(() => {
            message.style.animation = 'slideOutUp 0.5s ease';
            setTimeout(() => message.remove(), 500);
        }, 3000);
    }

    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    showIOSInstructions() {
        // Crear banner de instrucciones para iOS
        const banner = document.createElement('div');
        banner.id = 'ios-install-banner';
        banner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #5f3dc4, #7c5cff);
            color: white;
            padding: 16px;
            text-align: center;
            z-index: 9999;
            display: none;
            font-family: 'Nunito', sans-serif;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
        `;

        banner.innerHTML = `
            <div style="max-width: 600px; margin: 0 auto;">
                <p style="margin: 0 0 8px 0; font-weight: 600;">
                    📱 Instala Myotragus en tu iPhone
                </p>
                <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                    Toca <strong>Compartir</strong> <span style="font-size: 18px;">⎙</span> y luego 
                    <strong>Añadir a pantalla de inicio</strong> <span style="font-size: 18px;">➕</span>
                </p>
                <button onclick="this.parentElement.parentElement.style.display='none'" 
                        style="margin-top: 12px; background: rgba(255,255,255,0.2); color: white; 
                               border: none; padding: 8px 20px; border-radius: 20px; cursor: pointer;">
                    Entendido
                </button>
            </div>
        `;

        document.body.appendChild(banner);

        // Mostrar banner solo si no se ha mostrado antes
        const iosInstructionShown = localStorage.getItem('ios-instruction-shown');
        if (!iosInstructionShown) {
            setTimeout(() => {
                banner.style.display = 'block';
                localStorage.setItem('ios-instruction-shown', 'true');
            }, 2000);
        }
    }
}

// Inicializar el instalador cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PWAInstaller();
    });
} else {
    new PWAInstaller();
}

// Exportar para uso en otros scripts
window.PWAInstaller = PWAInstaller;
