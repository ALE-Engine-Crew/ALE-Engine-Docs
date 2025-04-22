// Configuración del sistema de animación
const AnimationSystem = {
    // Configuración de assets
    assetsPath: 'assets/images/Void/',
    musicPath: 'assets/music/',
    
    // Elementos del DOM
    voidContainer: null,
    speakerContainer: null,
    voidCanvas: null,
    speakerCanvas: null,
    voidCtx: null,
    speakerCtx: null,
    musicElement: null,
    
    // Estados
    currentAnimation: 'void_dormida',
    previousState: 'void_dormida',
    frameIndex: 0,
    lastUpdate: 0,
    animationRequestId: null,
    musicVolume: 0,
    musicFadeInterval: null,
    
    // Configuración de animaciones con posiciones específicas
    animations: {
        void_dormida: { 
            prefix: 'VoidDormida', 
            start: 0, 
            end: 23, 
            loop: true,
            position: { x: -111, y: 320, scale: 0.45 }
        },
        void_play: { 
            prefix: 'play', 
            start: 0, 
            end: 33, 
            loop: false,
            position: { x: -105, y: 320, scale: 0.45 }
        },
        void_idleDance: { 
            prefix: 'idleDance', 
            start: 0, 
            end: 19, 
            loop: true,
            position: { x: -117, y: 320, scale: 0.45 }
        },
        void_DUERMETE: { 
            prefix: 'DUERMETE', 
            start: 0, 
            end: 19, 
            loop: false,
            position: { x: -103, y: 321, scale: 0.45 }
        }
    },
      
    // Configuración independiente para el speaker
    speakerConfig: {
        idle: {
            prefix: 'musicPlayer',
            start: 0,
            end: 9,
            loop: true,
            position: { x: -45, y: 209, scale: 0.35 } // Ajusta estos valores según necesites
        },
        stoppedFrame: 'musicPlayer0009'
    },
    
    // Datos de los sprites
    spriteData: {
        void: { image: null, frames: {}, animations: {} },
        speaker: { image: null, frames: {}, animations: {} }
    },
    
    // Inicialización
    init: function() {
        this.voidContainer = document.getElementById('void-container');
        this.speakerContainer = document.getElementById('speaker-container');
        
        // Crear canvas para Void
        this.voidCanvas = document.createElement('canvas');
        this.voidCanvas.id = 'void-canvas';
        this.voidCanvas.style.position = 'absolute';
        this.voidCanvas.style.transformOrigin = 'center bottom';
        this.voidCanvas.style.pointerEvents = 'auto';
        this.voidCanvas.style.cursor = 'pointer';
        this.voidContainer.appendChild(this.voidCanvas);
        this.voidCtx = this.voidCanvas.getContext('2d');
        
        // Crear canvas para Speaker (totalmente independiente)
        this.speakerCanvas = document.createElement('canvas');
        this.speakerCanvas.id = 'speaker-canvas';
        this.speakerCanvas.style.position = 'absolute';
        this.speakerCanvas.style.transformOrigin = 'center bottom';
        this.speakerContainer.appendChild(this.speakerCanvas);
        this.speakerCtx = this.speakerCanvas.getContext('2d');
        
        // Configurar audio
        this.musicElement = new Audio(`${this.musicPath}chartEditorLoop.ogg`);
        this.musicElement.loop = true;
        this.musicElement.volume = 0;
        
        // Event listeners
        this.voidCanvas.addEventListener('click', () => this.handleVoidClick());
        window.addEventListener('resize', () => this.positionSprites());
        
        // Cargar assets
        this.loadAssets();
    },
    
    // Carga de assets
    loadAssets: async function() {
        try {
            await Promise.all([
                this.loadSpriteSheet('void', 'Void.png', 'Void.xml'),
                this.loadSpriteSheet('speaker', 'bocina.png', 'bocina.xml')
            ]);
            
            // Configurar animaciones del speaker
            this.setupSpeakerAnimations();
            
            this.positionSprites();
            this.startAnimation();
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    },
    
    // Configurar animaciones del speaker
    setupSpeakerAnimations: function() {
        const speakerAnim = this.speakerConfig.idle;
        this.spriteData.speaker.animations['speaker_idle'] = [];
        
        for (let i = speakerAnim.start; i <= speakerAnim.end; i++) {
            const frameName = `${speakerAnim.prefix}${i.toString().padStart(4, '0')}`;
            if (this.spriteData.speaker.frames[frameName]) {
                this.spriteData.speaker.animations['speaker_idle'].push(
                    this.spriteData.speaker.frames[frameName]
                );
            }
        }
    },
    
    // Carga de spritesheets
    loadSpriteSheet: async function(type, spriteSheet, atlasFile) {
        // Cargar imagen
        const sheetImg = new Image();
        sheetImg.src = `${this.assetsPath}${spriteSheet}`;
        await new Promise((resolve, reject) => {
            sheetImg.onload = resolve;
            sheetImg.onerror = reject;
        });
        
        this.spriteData[type].image = sheetImg;
        
        // Cargar y parsear XML
        const response = await fetch(`${this.assetsPath}${atlasFile}`);
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        
        // Parsear frames
        const frames = xmlDoc.getElementsByTagName('SubTexture');
        for (let frame of frames) {
            const name = frame.getAttribute('name');
            const x = parseInt(frame.getAttribute('x'));
            const y = parseInt(frame.getAttribute('y'));
            const width = parseInt(frame.getAttribute('width'));
            const height = parseInt(frame.getAttribute('height'));
            
            this.spriteData[type].frames[name] = { x, y, width, height };
        }
        
        // Configurar animaciones de Void
        if (type === 'void') {
            for (const [key, anim] of Object.entries(this.animations)) {
                this.spriteData.void.animations[key] = [];
                for (let i = anim.start; i <= anim.end; i++) {
                    const frameName = `${anim.prefix}${i.toString().padStart(4, '0')}`;
                    if (this.spriteData.void.frames[frameName]) {
                        this.spriteData.void.animations[key].push(
                            this.spriteData.void.frames[frameName]
                        );
                    }
                }
            }
        }
    },
    
    // Iniciar animación
    startAnimation: function() {
        this.lastUpdate = performance.now();
        this.animationRequestId = requestAnimationFrame((t) => this.animate(t));
        this.updateSpriteFrame();
    },
    
    // Loop de animación
    animate: function(timestamp) {
        const deltaTime = timestamp - this.lastUpdate;
        const frameInterval = 1000 / 24; // 24 FPS
        
        if (deltaTime >= frameInterval) {
            this.updateAnimation();
            this.lastUpdate = timestamp - (deltaTime % frameInterval);
        }
        
        this.animationRequestId = requestAnimationFrame((t) => this.animate(t));
    },
    
    // Actualizar animación
    updateAnimation: function() {
        const currentAnim = this.animations[this.currentAnimation];
        if (!currentAnim) return;
        
        this.frameIndex++;
        
        // Manejar fin de animación no loop
        if (!currentAnim.loop && this.frameIndex > currentAnim.end - currentAnim.start) {
            this.handleAnimationComplete();
            return;
        }
        
        this.updateSpriteFrame();
    },
    
    // Actualizar frame del sprite
    updateSpriteFrame: function() {
        // Actualizar Void
        this.updateVoidFrame();
        
        // Actualizar Speaker (independiente de Void)
        this.updateSpeakerFrame();
    },
    
    // Actualizar frame de Void
    updateVoidFrame: function() {
        const animConfig = this.animations[this.currentAnimation];
        const voidAnim = this.spriteData.void.animations[this.currentAnimation];
        
        if (voidAnim && voidAnim[this.frameIndex % voidAnim.length]) {
            const frame = voidAnim[this.frameIndex % voidAnim.length];
            this.voidCanvas.width = frame.width;
            this.voidCanvas.height = frame.height;
            this.voidCtx.clearRect(0, 0, this.voidCanvas.width, this.voidCanvas.height);
            this.voidCtx.drawImage(
                this.spriteData.void.image,
                frame.x, frame.y, frame.width, frame.height,
                0, 0, frame.width, frame.height
            );
            
            // Aplicar posición y escala específica para esta animación
            this.voidCanvas.style.transform = `scale(${animConfig.position.scale})`;
            this.positionVoid(animConfig.position.x, animConfig.position.y);
        }
    },
    
    // Actualizar frame de Speaker
    updateSpeakerFrame: function() {
        const speakerAnim = this.spriteData.speaker.animations['speaker_idle'];
        const speakerConfig = this.speakerConfig.idle;
        const stoppedFrame = this.spriteData.speaker.frames[this.speakerConfig.stoppedFrame];
        
        // Mostrar frame de animación o frame detenido
        const frame = (this.currentAnimation === 'void_idleDance' && speakerAnim && speakerAnim[this.frameIndex % speakerAnim.length]) 
            ? speakerAnim[this.frameIndex % speakerAnim.length]
            : stoppedFrame;

        if (frame) {
            this.speakerCanvas.width = frame.width;
            this.speakerCanvas.height = frame.height;
            this.speakerCtx.clearRect(0, 0, this.speakerCanvas.width, this.speakerCanvas.height);
            this.speakerCtx.drawImage(
                this.spriteData.speaker.image,
                frame.x, frame.y, frame.width, frame.height,
                0, 0, frame.width, frame.height
            );
            
            // Aplicar transformaciones independientes al speaker
            this.speakerCanvas.style.transform = `scale(${speakerConfig.position.scale})`;
            this.positionSpeaker(
                speakerConfig.position.x, 
                speakerConfig.position.y, 
                speakerConfig.position.scale
            );
        }
    },
    
    // Posicionar Void
    positionVoid: function(offsetX, offsetY) {
        if (!this.voidContainer || !this.voidCanvas) return;
        
        const baseX = this.voidContainer.clientWidth / 2 + offsetX;
        const baseY = this.voidContainer.clientHeight - offsetY;
        
        this.voidCanvas.style.left = `${baseX - (this.voidCanvas.width * this.animations[this.currentAnimation].position.scale / 2)}px`;
        this.voidCanvas.style.bottom = `${baseY}px`;
    },
    
    // Posicionar Speaker (ahora completamente independiente)
    positionSpeaker: function(offsetX, offsetY, scale) {
        if (!this.speakerContainer || !this.speakerCanvas) return;
        
        const baseX = this.speakerContainer.clientWidth / 2 + offsetX;
        const baseY = this.speakerContainer.clientHeight - offsetY;
        
        this.speakerCanvas.style.left = `${baseX - (this.speakerCanvas.width * scale / 2)}px`;
        this.speakerCanvas.style.bottom = `${baseY}px`;
    },
    
    // Posicionar ambos sprites (ahora independientes)
    positionSprites: function() {
        // Posicionar Void según su animación actual
        const voidAnim = this.animations[this.currentAnimation];
        this.positionVoid(voidAnim.position.x, voidAnim.position.y);
        
        // Posicionar Speaker según su configuración independiente
        const speakerAnim = this.speakerConfig.idle;
        this.positionSpeaker(
            speakerAnim.position.x, 
            speakerAnim.position.y, 
            speakerAnim.position.scale
        );
    },
    
    // Resto de los métodos permanecen iguales...
    handleVoidClick: function() {
        if (this.currentAnimation === 'void_play' || this.currentAnimation === 'void_DUERMETE') return;
        
        this.previousState = this.currentAnimation;
        
        if (this.currentAnimation === 'void_idleDance') {
            this.currentAnimation = 'void_DUERMETE';
            this.frameIndex = 0;
            this.fadeOutMusic();
            this.stopSpeaker();
            return;
        }
        
        this.currentAnimation = 'void_play';
        this.frameIndex = 0;
        
        if (this.previousState === 'void_idleDance') {
            this.fadeOutMusic();
            this.stopSpeaker();
        }
    },
    
    handleAnimationComplete: function() {
        if (this.currentAnimation === 'void_play') {
            if (this.previousState === 'void_dormida') {
                this.currentAnimation = 'void_idleDance';
                this.fadeInMusic();
            } else {
                this.currentAnimation = 'void_dormida';
                this.fadeOutMusic();
                this.stopSpeaker();
            }
        } else if (this.currentAnimation === 'void_DUERMETE') {
            this.currentAnimation = 'void_dormida';
        }
        
        this.frameIndex = 0;
        this.updateSpriteFrame();
    },
    
    fadeInMusic: function() {
        clearInterval(this.musicFadeInterval);
        this.musicElement.volume = 0;
        this.musicElement.play().catch(e => console.error("Audio play failed:", e));
        
        const fadeStep = 0.7 / (1000 / 50);
        this.musicFadeInterval = setInterval(() => {
            if (this.musicElement.volume < 0.7) {
                this.musicElement.volume = Math.min(this.musicElement.volume + fadeStep, 0.7);
            } else {
                clearInterval(this.musicFadeInterval);
            }
        }, 50);
    },
    
    fadeOutMusic: function() {
        clearInterval(this.musicFadeInterval);
        
        const fadeStep = this.musicElement.volume / (1000 / 50);
        this.musicFadeInterval = setInterval(() => {
            if (this.musicElement.volume > 0) {
                this.musicElement.volume = Math.max(this.musicElement.volume - fadeStep, 0);
            } else {
                clearInterval(this.musicFadeInterval);
                this.musicElement.pause();
            }
        }, 50);
    },
    
    stopSpeaker: function() {
        const frame = this.spriteData.speaker.frames[this.speakerConfig.stoppedFrame];
        if (frame) {
            this.speakerCanvas.width = frame.width;
            this.speakerCanvas.height = frame.height;
            this.speakerCtx.clearRect(0, 0, this.speakerCanvas.width, this.speakerCanvas.height);
            this.speakerCtx.drawImage(
                this.spriteData.speaker.image,
                frame.x, frame.y, frame.width, frame.height,
                0, 0, frame.width, frame.height
            );
            
            // Aplicar posición y escala independiente incluso cuando está detenido
            const speakerConfig = this.speakerConfig.idle;
            this.speakerCanvas.style.transform = `scale(${speakerConfig.position.scale})`;
            this.positionSpeaker(
                speakerConfig.position.x, 
                speakerConfig.position.y, 
                speakerConfig.position.scale
            );
        }
    },
    
    cleanup: function() {
        cancelAnimationFrame(this.animationRequestId);
        clearInterval(this.musicFadeInterval);
        this.musicElement.pause();
        this.musicElement = null;
        this.voidCanvas.removeEventListener('click', this.handleVoidClick);
        window.removeEventListener('resize', this.positionSprites);
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    AnimationSystem.init();
    
    // Efectos de animación para la página...
    const animateElements = () => {
        const elements = document.querySelectorAll("nav, .content-header, #markdown-content, #toc");
        elements.forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, i * 200);
        });
    };
    
    document.querySelectorAll("nav, .content-header, #markdown-content, #toc").forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    setTimeout(animateElements, 100);
    
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('mouseover', () => {
            link.style.color = 'var(--ale-accent)';
            link.style.transition = 'color 0.3s ease';
        });
        
        link.addEventListener('mouseout', () => {
            link.style.color = '';
        });
    });
});

// Keyframes para el spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);