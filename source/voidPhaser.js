// voidPhaser.js - Versión final corregida

// 1. Configuración de los juegos Phaser
const voidConfig = {
    type: Phaser.AUTO,
    parent: 'void-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preloadVoid,
        create: createVoid
    }
};

const speakerConfig = {
    type: Phaser.AUTO,
    parent: 'speaker-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        width: '100%',
        height: '100%',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preloadSpeaker,
        create: createSpeaker
    }
};

// 2. Variables globales
let void_sprite, speaker_sprite;
let currentAnimation = 'void_dormida';
let previousState = 'void_dormida';
const FADE_DURATION = 1000;
const MAX_VOLUME = 0.7;
let danceMusic;
let voidGame, speakerGame;

// 3. Inicialización después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    voidGame = new Phaser.Game(voidConfig);
    speakerGame = new Phaser.Game(speakerConfig);
});

// 4. Precarga de assets
function preloadVoid() {
    this.load.path = 'assets/images/Void/';
    this.load.atlasXML('void', 'Void.png', 'Void.xml');
    
    this.load.path = 'assets/music/';
    this.load.audio('danceMusic', 'chartEditorLoop.ogg');
}

function preloadSpeaker() {
    this.load.path = 'assets/images/Void/';
    this.load.atlasXML('speaker', 'bocina.png', 'bocina.xml');
}

// 5. Creación de la escena de Void
function createVoid() {
    // Verificar que los assets se cargaron correctamente
    if (!this.textures.exists('void')) {
        console.error('Error: No se encontró el atlas de Void');
        return;
    }

    // Configurar animaciones de Void
    this.anims.create({
        key: 'void_dormida',
        frames: this.anims.generateFrameNames('void', {
            prefix: 'VoidDormida',
            start: 0,
            end: 23,
            zeroPad: 4
        }),
        frameRate: 24,
        repeat: -1
    });

    this.anims.create({
        key: 'void_play',
        frames: this.anims.generateFrameNames('void', {
            prefix: 'play',
            start: 0,
            end: 33,
            zeroPad: 4
        }),
        frameRate: 24,
        repeat: 0
    });

    this.anims.create({
        key: 'void_idleDance',
        frames: this.anims.generateFrameNames('void', {
            prefix: 'idleDance',
            start: 0,
            end: 19,
            zeroPad: 4
        }),
        frameRate: 24,
        repeat: -1
    });

    // Crear sprite de Void con dimensiones iniciales seguras
    void_sprite = this.add.sprite(100, 100, 'void', 'VoidDormida0000');
    void_sprite.setOrigin(0.5, 1);
    void_sprite.setInteractive();

    // Configurar audio
    if (this.cache.audio.exists('danceMusic')) {
        danceMusic = this.sound.add('danceMusic', {
            volume: 0,
            loop: true
        });
    } else {
        console.error('Error: No se encontró el audio danceMusic');
    }

    // Posicionamiento inicial con retraso para asegurar carga
    this.time.delayedCall(100, () => {
        positionVoid.call(this);
    });

    // Configurar eventos
    void_sprite.on('pointerdown', () => {
        if (currentAnimation !== 'void_play') {
            previousState = currentAnimation;
            currentAnimation = 'void_play';
            void_sprite.play('void_play');
            
            if (previousState === 'void_idleDance') {
                fadeOutMusic.call(this);
                if (speakerGame && speakerGame.scene && speakerGame.scene.scenes[0]) {
                    speakerGame.scene.scenes[0].events.emit('stopAnimation');
                }
            }
        }
    });

    void_sprite.on('animationstart', (animation) => {
        if (animation.key === 'void_idleDance') {
            fadeInMusic.call(this);
            if (speakerGame && speakerGame.scene && speakerGame.scene.scenes[0]) {
                speakerGame.scene.scenes[0].events.emit('startAnimation');
            }
        }
    });

    void_sprite.on('animationcomplete', (animation) => {
        if (animation.key === 'void_play') {
            if (previousState === 'void_dormida') {
                currentAnimation = 'void_idleDance';
                void_sprite.play('void_idleDance');
            } else {
                currentAnimation = 'void_dormida';
                void_sprite.play('void_dormida');
            }
        }
    });

    // Iniciar animación
    void_sprite.play('void_dormida');
    this.scale.on('resize', () => {
        this.time.delayedCall(50, positionVoid.bind(this));
    });
}

// 6. Creación de la escena del Speaker
function createSpeaker() {
    // Verificar que los assets se cargaron correctamente
    if (!this.textures.exists('speaker')) {
        console.error('Error: No se encontró el atlas del speaker');
        return;
    }

    // Configurar animación del speaker usando el XML proporcionado
    this.anims.create({
        key: 'speaker_idle',
        frames: this.anims.generateFrameNames('speaker', {
            prefix: 'musicPlayer',
            start: 0,
            end: 9,
            zeroPad: 4
        }),
        frameRate: 24,
        repeat: -1,
        yoyo: true // Para animación más suave
    });

    // Crear sprite del speaker con frame inicial
    speaker_sprite = this.add.sprite(0, 0, 'speaker', 'musicPlayer0000');
    speaker_sprite.setOrigin(0.5, 1);
    speaker_sprite.visible = false;

    // Configurar eventos
    this.events.on('startAnimation', () => {
        speaker_sprite.visible = true;
        speaker_sprite.play('speaker_idle');
        positionSpeaker.call(this);
    });

    this.events.on('stopAnimation', () => {
        speaker_sprite.visible = false;
        speaker_sprite.anims.stop();
        speaker_sprite.setFrame('musicPlayer0000');
    });

    this.events.on('positionSpeaker', positionSpeaker.bind(this));

    // Posicionamiento inicial con retraso
    this.time.delayedCall(100, positionSpeaker.bind(this));
    this.scale.on('resize', () => {
        this.time.delayedCall(50, positionSpeaker.bind(this));
    });
}

// 7. Funciones de posicionamiento
function positionVoid() {
    const container = document.getElementById('void-animation-container');
    if (!container || !void_sprite || !void_sprite.texture) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Usar dimensiones de textura si el sprite no tiene dimensiones aún
    const spriteWidth = void_sprite.width || void_sprite.texture.getSourceImage().width;
    const spriteHeight = void_sprite.height || void_sprite.texture.getSourceImage().height;
    
    if (spriteWidth > 0 && spriteHeight > 0) {
        const scale = Math.min(
            (containerWidth * 0.8) / spriteWidth,
            (containerHeight * 0.8) / spriteHeight
        );
        
        void_sprite.setScale(scale);
        void_sprite.setPosition(containerWidth * 0.5, containerHeight);
        
        if (speakerGame && speakerGame.scene && speakerGame.scene.scenes[0]) {
            speakerGame.scene.scenes[0].events.emit('positionSpeaker');
        }
    }
}

function positionSpeaker() {
    const voidContainer = document.getElementById('void-container');
    const speakerContainer = document.getElementById('speaker-container');
    
    if (!void_sprite || !voidContainer || !speakerContainer || !speaker_sprite) return;
    
    const voidCanvas = voidContainer.querySelector('canvas');
    if (!voidCanvas) return;
    
    const voidRect = voidCanvas.getBoundingClientRect();
    const containerRect = speakerContainer.getBoundingClientRect();
    
    // Calcular escala basada en Void
    const voidScale = void_sprite.scale || 1;
    const scale = voidScale * 0.6;
    
    // Posición a la izquierda de Void
    const x = voidRect.left - containerRect.left - (void_sprite.displayWidth * 0.25);
    const y = speakerContainer.clientHeight;
    
    speaker_sprite.setScale(scale);
    speaker_sprite.setPosition(x, y);
}

// 8. Funciones de audio
function fadeInMusic() {
    if (!danceMusic) return;
    
    this.tweens.add({
        targets: danceMusic,
        volume: MAX_VOLUME,
        duration: FADE_DURATION,
        onStart: () => {
            if (!danceMusic.isPlaying) {
                danceMusic.play();
            }
        }
    });
}

function fadeOutMusic() {
    if (!danceMusic) return;
    
    this.tweens.add({
        targets: danceMusic,
        volume: 0,
        duration: FADE_DURATION / 2,
        onComplete: () => {
            danceMusic.stop();
        }
    });
}

// 9. Inicialización segura
window.addEventListener('load', () => {
    setTimeout(() => {
        if (voidGame && voidGame.scene && voidGame.scene.scenes[0]) {
            voidGame.scene.scenes[0].scale.emit('resize');
        }
        if (speakerGame && speakerGame.scene && speakerGame.scene.scenes[0]) {
            speakerGame.scene.scenes[0].scale.emit('resize');
        }
    }, 500);
});