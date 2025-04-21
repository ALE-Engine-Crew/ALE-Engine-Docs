// Configuración básica de Phaser
const voidConfig = {
    type: Phaser.AUTO,
    parent: 'void-container',
    transparent: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        preload: preloadVoid,
        create: createVoid
    }
};

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
const VOID_SCALE = 3.5;
const VOID_OFFSET_X = 150;
const VOID_OFFSET_Y = 50;
const SPEAKER_SCALE = 2.5;
const SPEAKER_OFFSET_X = -200;
const SPEAKER_OFFSET_Y = -50;

document.addEventListener('DOMContentLoaded', () => {
    voidGame = new Phaser.Game(voidConfig);
});

function preloadVoid() {
    // PRECARGAMOS LOS RECURSOS DE MIERDAAAAAA GAAAAAAAAAAAA
    this.load.path = 'assets/images/Void/';
    this.load.atlasXML('void', 'Void.png', 'Void.xml');
    this.load.atlasXML('speaker', 'bocina.png', 'bocina.xml');

    this.load.path = 'assets/music/';
    this.load.audio('danceMusic', 'girlfriendsRingtone.ogg');
}

function createVoid() {
    const scene = this;

    // Creamos las putas animaciones de mierda de la puta void
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

    // Aca creas la unica puta animacion del puto parlante a la que le importa a nadie
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

    spriteContainer = this.add.container(0, 0);
    speakerContainer = this.add.container(0, 0);

    // Creamos el contenedor de la void y el parlante (MATENME)
    void_sprite = this.add.sprite(0, 0, 'void', 'VoidDormida0000');
    void_sprite.setOrigin(0.5, 1);
    void_sprite.setScale(VOID_SCALE);
    void_sprite.setInteractive();
    spriteContainer.add(void_sprite);

    speaker_sprite = this.add.sprite(0, 0, 'speaker', 'musicPlayer0009');
    speaker_sprite.setOrigin(0.5, 1);
    speaker_sprite.setScale(SPEAKER_SCALE);
    speakerContainer.add(speaker_sprite);

    positionSprites.call(this);

    // Agregamos el evento de puntero para la void
    void_sprite.on('pointerdown', () => {
        if (currentAnimation === 'void_play') return;

        previousState = currentAnimation;
        currentAnimation = 'void_play';
        void_sprite.play('void_play');

        if (previousState === 'void_idleDance') {
            fadeOutMusic.call(scene);
            stopSpeaker();
        }
    });

    void_sprite.on('animationstart', (animation) => {
        if (animation.key === 'void_idleDance') {
            fadeInMusic.call(scene);
            speaker_sprite.play('speaker_idle');
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
                fadeOutMusic.call(scene);
                stopSpeaker();
            }
        }
    });

    void_sprite.play('void_dormida');

    this.scale.on('resize', () => positionSprites.call(scene));
}

function positionSprites() {

    const container = document.getElementById('void-container');
    if (!container) return;

    // Obtenemos el tamaño del contenedor
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const baseX = containerWidth / 2;
    const baseY = containerHeight - VOID_OFFSET_Y;

    gsap.to(spriteContainer, {
        x: baseX + VOID_OFFSET_X,
        y: baseY,
        duration: 0.5,
        ease: 'power2.out'
    });

    // Posicionamos el parlante
    gsap.to(speakerContainer, {
        x: baseX + VOID_OFFSET_X + SPEAKER_OFFSET_X,
        y: baseY + SPEAKER_OFFSET_Y,
        duration: 0.5,
        ease: 'power2.out'
    });
}

function fadeInMusic() {
    if (!danceMusic || danceMusic.destroyed || danceMusic.isPlaying) return;

    // Aumentamos el volumen de la música
    this.tweens.add({
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

    // Disminuimos el volumen de la música
    this.tweens.add({
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
    // Detenemos la animación del parlante
    speaker_sprite.anims.stop();
    speaker_sprite.setFrame('musicPlayer0009');
}

window.addEventListener('load', () => {
    setTimeout(() => {
        if (voidGame?.scene?.scenes[0]) {
            positionSprites.call(voidGame.scene.scenes[0]);
        }
    }, 500);
});


// salimy si ves esto, matame antes de que sea demasiado tarde
// no me dejes vivir con esta verguenza, por favor