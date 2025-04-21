// Configuración básica de Phaser
const voidConfig = {
    autofocus: false,
    type: Phaser.AUTO,
    parent: 'void-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '200%',
        height: '200%',
    },
    scene: {
        preload: preloadVoid,
        create: createVoid,
    }
};

const speakerConfig = {
    type: Phaser.AUTO,
    parent: 'speaker-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '200%',
        height: '200%',
    },
    scene: {
        preload: preloadSpeaker,
        create: createSpeaker,
    }
}

// Variables globales
let void_sprite, speaker_sprite;
let spriteContainer, speakerContainer;
let currentAnimation = 'void_dormida';
let previousState = 'void_dormida';
let danceMusic;
let voidGame;
const FADE_DURATION = 1000;
const MAX_VOLUME = 0.7;

// Ajustes visuales personalizados como quieras :v
const VOID_SCALE = 0.6;
const VOID_OFFSET_X = 70;
const VOID_OFFSET_Y = -150;
const SPEAKER_SCALE = 0.4;
const SPEAKER_OFFSET_X = 0;
const SPEAKER_OFFSET_Y = 0;

document.addEventListener('DOMContentLoaded', () => {
    voidGame = new Phaser.Game(voidConfig);
    speakerGame = new Phaser.Game(speakerConfig);
});

function preloadVoid() {
    // PRECARGAMOS LOS RECURSOS DE MIERDAAAAAA GAAAAAAAAAAAA
    this.load.path = 'assets/images/Void/';
    this.load.atlasXML('void', 'Void.png', 'Void.xml');
}

function createVoid() {
    const scene = this;

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


    this.anims.create({
        key: 'void_DUERMETE',
        frames: this.anims.generateFrameNames('void', {
            prefix: 'DUERMETE',
            start: 0,
            end: 19,
            zeroPad: 4
        }),
        frameRate: 24,
        repeat: 0
    });

    void_sprite = this.add.sprite(0, 0, 'void', 'VoidDormida0000');
    void_sprite.setOrigin(0.5, 1);
    void_sprite.setScale(VOID_SCALE);
    void_sprite.setInteractive();
    void_sprite.setDepth(2);

    positionVoidSprite.call(this);

    void_sprite.on('pointerdown', () => {
        if (currentAnimation === 'void_play' || currentAnimation === 'void_DUERMETE') return;
    
        previousState = currentAnimation;
    
        // Si está en idleDance y se hace clic, ejecutar DUERMETE
        if (currentAnimation === 'void_idleDance') {
            currentAnimation = 'void_DUERMETE';
            void_sprite.play('void_DUERMETE');
            fadeOutMusic();
            stopSpeaker();
            return;
        }
    
        // Si no está en idleDance, hacer la animación de play como siempre
        currentAnimation = 'void_play';
        void_sprite.play('void_play');
    
        if (previousState === 'void_idleDance') {
            fadeOutMusic();
            stopSpeaker();
        }
    });
    

    void_sprite.on('animationstart', (animation) => {
        if (animation.key === 'void_idleDance') {
            fadeInMusic();
            if (speaker_sprite) speaker_sprite.play('speaker_idle');
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
                fadeOutMusic();
                stopSpeaker();
            }
        }
    
        // NUEVO: si termina DUERMETE, volver a dormida
        if (animation.key === 'void_DUERMETE') {
            currentAnimation = 'void_dormida';
            void_sprite.play('void_dormida');
        }
    });
    

    void_sprite.play('void_dormida');

    this.scale.on('resize', () => positionVoidSprite.call(scene));
}
function preloadSpeaker() {
    this.load.path = 'assets/images/Void/';
    this.load.atlasXML('speaker', 'bocina.png', 'bocina.xml');
    this.load.path = 'assets/music/';
    this.load.audio('danceMusic', 'chartEditorLoop.ogg');
}

function createSpeaker() {
    speaker_sprite = this.add.sprite(0, 0, 'speaker', 'musicPlayer0009');
    speaker_sprite.setOrigin(0.5, 1);
    speaker_sprite.setScale(SPEAKER_SCALE);
    speaker_sprite.setDepth(1);

    this.anims.create({
        key: 'speaker_idle',
        frames: this.anims.generateFrameNames('speaker', {
            prefix: 'musicPlayer',
            start: 0,
            end: 9,
            zeroPad: 4
        }),
        frameRate: 24,
        repeat: -1
    });

    danceMusic = this.sound.add('danceMusic', {
        volume: 0,
        loop: true
    });

    positionSpeakersSprite.call(this);
    this.scale.on('resize', () => positionSpeakersSprite.call(this));
}

function positionVoidSprite() {
    const container = document.getElementById('void-container');
    if (!container) return;

    const baseX = container.clientWidth / 2 + VOID_OFFSET_X;
    const baseY = container.clientHeight - VOID_OFFSET_Y;

    gsap.to(void_sprite, {
        x: baseX,
        y: baseY,
        duration: 0.5,
        ease: 'power2.out'
    });
}

function positionSpeakersSprite() {
    const container = document.getElementById('speaker-container');
    if (!container) return;

    const baseX = container.clientWidth / 2 + SPEAKER_OFFSET_X;
    const baseY = container.clientHeight - SPEAKER_OFFSET_Y;

    gsap.to(speaker_sprite, {
        x: baseX,
        y: baseY,
        duration: 0.5,
        ease: 'power2.out'
    });
}

function fadeInMusic() {
    if (!danceMusic || danceMusic.destroyed || danceMusic.isPlaying) return;

    // Aumentamos el volumen de la música
    speakerGame.scene.scenes[0].tweens.add({
        targets: danceMusic,
        volume: MAX_VOLUME,
        duration: FADE_DURATION,
        ease: 'Linear',
        onStart: () => {
            if (!danceMusic.isPlaying) danceMusic.play();
        }
    });
}

function fadeOutMusic() {
    if (!danceMusic || danceMusic.destroyed || !danceMusic.isPlaying) return;

    speakerGame.scene.scenes[0].tweens.add({
        targets: danceMusic,
        volume: 0,
        duration: FADE_DURATION,
        ease: 'Linear',
        onComplete: () => {
            danceMusic.stop();
        }
    });
}

function stopSpeaker() {
    if (!speaker_sprite) return;
    speaker_sprite.anims.stop();
    speaker_sprite.setFrame('musicPlayer0009');
}

function positionSprites() {
    positionVoidSprite.call(this);
    positionSpeakersSprite.call(this);
}
