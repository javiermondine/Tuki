// ============================================
// SISTEMA DE AUDIO CON WEB AUDIO API
// ============================================

class AudioSystem {
    constructor() {
        this.enabled = true;
        this.volume = 0.5;
        this.musicVolume = 0.3;
        this.sfxVolume = 0.7;
        this.currentMusic = null;
        
        // Contexto de audio
        this.audioContext = null;
        this.musicGain = null;
        this.sfxGain = null;
        
        // Cache de sonidos
        this.sounds = {};
        this.musicTracks = {};
        
        this.initAudioContext();
    }

    // Inicializar contexto de audio
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Nodos de ganancia para música y efectos
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.audioContext.destination);
            
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.audioContext.destination);
            
        } catch (e) {
            console.warn('Web Audio API no soportada', e);
        }
    }

    // Generar tono simple (síntesis de audio)
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.sfxGain);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    // Sonidos generados por síntesis
    playSynth(soundType) {
        if (!this.enabled) return;

        const now = this.audioContext?.currentTime || 0;

        switch(soundType) {
            case 'explore':
                // Sonido de exploración (tono ascendente)
                this.playTone(400, 0.1);
                setTimeout(() => this.playTone(600, 0.1), 100);
                break;

            case 'collect':
                // Sonido de recolección (ping)
                this.playTone(800, 0.15, 'square');
                break;

            case 'camp':
                // Sonido de acampar (tono suave)
                this.playTone(300, 0.3, 'triangle');
                break;

            case 'help':
                // Sonido de ayuda (armonía)
                this.playTone(523, 0.2);
                this.playTone(659, 0.2);
                break;

            case 'badge':
                // Sonido de insignia (fanfarria)
                this.playTone(523, 0.15);
                setTimeout(() => this.playTone(659, 0.15), 150);
                setTimeout(() => this.playTone(784, 0.3), 300);
                break;

            case 'mission_complete':
                // Misión completada (victoria)
                this.playTone(659, 0.1);
                setTimeout(() => this.playTone(784, 0.1), 100);
                setTimeout(() => this.playTone(880, 0.1), 200);
                setTimeout(() => this.playTone(1047, 0.3), 300);
                break;

            case 'level_up':
                // Subida de nivel (épico)
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => this.playTone(400 + i * 100, 0.1), i * 80);
                }
                break;

            case 'dialog':
                // Diálogo (blip)
                this.playTone(600, 0.05, 'square');
                break;

            case 'click':
                // Click UI
                this.playTone(1000, 0.05, 'square');
                break;

            case 'heal':
                // Curación
                this.playTone(440, 0.1);
                setTimeout(() => this.playTone(554, 0.2), 100);
                break;

            case 'drink':
                // Beber agua
                this.playTone(300, 0.1, 'sawtooth');
                setTimeout(() => this.playTone(250, 0.1, 'sawtooth'), 100);
                break;

            case 'eat':
                // Comer
                this.playTone(400, 0.08);
                setTimeout(() => this.playTone(350, 0.08), 100);
                setTimeout(() => this.playTone(400, 0.08), 200);
                break;

            case 'whistle':
                // Silbato
                this.playTone(2000, 0.5, 'sine');
                break;

            case 'victory':
                // Victoria final
                const victoryMelody = [523, 587, 659, 784, 880, 1047];
                victoryMelody.forEach((freq, i) => {
                    setTimeout(() => this.playTone(freq, 0.2), i * 150);
                });
                break;
        }
    }

    // Música ambiental con osciladores
    playAmbientMusic(scene = 'forest') {
        if (!this.enabled || !this.audioContext) return;

        this.stopMusic();

        const ambientSounds = {
            forest: {
                frequencies: [220, 330, 440],
                duration: 2,
                interval: 3000
            },
            night: {
                frequencies: [110, 165, 220],
                duration: 3,
                interval: 4000
            },
            camp: {
                frequencies: [262, 330, 392],
                duration: 2.5,
                interval: 3500
            }
        };

        const config = ambientSounds[scene];
        if (!config) return;

        // Crear loop de música ambiental
        const playAmbient = () => {
            config.frequencies.forEach((freq, i) => {
                setTimeout(() => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(this.musicGain);
                    
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    
                    gain.gain.setValueAtTime(0, this.audioContext.currentTime);
                    gain.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.5);
                    gain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + config.duration);
                    
                    osc.start(this.audioContext.currentTime);
                    osc.stop(this.audioContext.currentTime + config.duration);
                }, i * 300);
            });
        };

        // Iniciar y repetir
        playAmbient();
        this.currentMusic = setInterval(playAmbient, config.interval);
    }

    // Detener música
    stopMusic() {
        if (this.currentMusic) {
            clearInterval(this.currentMusic);
            this.currentMusic = null;
        }
    }

    // Sonidos ambientales (bucles)
    playAmbientSound(type) {
        switch(type) {
            case 'fire':
                // Sonido de fogata (ruido filtrado)
                setInterval(() => {
                    if (this.enabled) {
                        this.playTone(100 + Math.random() * 50, 0.3, 'sawtooth');
                    }
                }, 500);
                break;

            case 'wind':
                // Viento
                setInterval(() => {
                    if (this.enabled) {
                        this.playTone(150 + Math.random() * 100, 1, 'sine');
                    }
                }, 2000);
                break;

            case 'birds':
                // Pájaros
                setInterval(() => {
                    if (this.enabled && Math.random() > 0.5) {
                        this.playTone(1500 + Math.random() * 500, 0.2, 'sine');
                    }
                }, 3000);
                break;

            case 'crickets':
                // Grillos (noche)
                setInterval(() => {
                    if (this.enabled) {
                        this.playTone(4000 + Math.random() * 1000, 0.1, 'square');
                    }
                }, 400);
                break;
        }
    }

    // Toggle audio
    toggle() {
        this.enabled = !this.enabled;
        if (!this.enabled) {
            this.stopMusic();
        }
        return this.enabled;
    }

    // Cambiar volumen
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.volume * this.musicVolume;
        }
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.volume * this.sfxVolume;
        }
    }

    // Setear volumen de música
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.volume * this.musicVolume;
        }
    }

    // Setear volumen de efectos
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.volume * this.sfxVolume;
        }
    }
}

// Instancia global
const audioSystem = new AudioSystem();

// Función helper para mantener compatibilidad con código existente
function playSound(type) {
    audioSystem.playSynth(type);
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AudioSystem, audioSystem, playSound };
}
