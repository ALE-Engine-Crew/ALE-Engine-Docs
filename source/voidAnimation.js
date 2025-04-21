let currentFrame = 0;
let frameCount = 24; // Número total de frames de la animación
let animationInterval;
let voidContainer;
let voidImg;

function initVoidAnimation() {
    // Crear el contenedor
    voidContainer = document.getElementById('void-animation-container');
    
    // Crear la imagen
    voidImg = new Image();
    voidImg.src = 'assets/images/Void/VoidDormida.png'; // Asegúrate de tener los frames en una sola imagen
    voidImg.style.position = 'absolute';
    voidImg.style.bottom = '0';
    voidImg.style.left = '0';
    voidImg.style.width = 'auto';
    voidImg.style.height = '90%';
    
    // Agregar la imagen al contenedor
    voidContainer.appendChild(voidImg);
    
    // Iniciar la animación cuando la imagen esté cargada
    voidImg.onload = () => {
        startAnimation();
        // Ajustar el tamaño inicial
        resizeVoid();
    };
    
    // Escuchar cambios de tamaño
    window.addEventListener('resize', resizeVoid);
}

function startAnimation() {
    // Detener animación previa si existe
    if (animationInterval) clearInterval(animationInterval);
    
    // Calcular el ancho de cada frame (asumiendo que están en una fila)
    const frameWidth = voidImg.naturalWidth / frameCount;
    
    // Animar los frames
    animationInterval = setInterval(() => {
        voidImg.style.objectPosition = `-${currentFrame * frameWidth}px 0px`;
        currentFrame = (currentFrame + 1) % frameCount;
    }, 1000 / 24); // 24 FPS
}

function resizeVoid() {
    if (!voidContainer || !voidImg) return;
    
    const containerHeight = voidContainer.clientHeight;
    const containerWidth = voidContainer.clientWidth;
    
    // Mantener la proporción y ajustar al contenedor
    const scale = containerHeight / voidImg.naturalHeight;
    voidImg.style.height = `${containerHeight * 0.9}px`; // 90% del contenedor
}