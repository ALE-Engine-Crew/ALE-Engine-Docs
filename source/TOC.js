function updateTOC() {
    const tocNav = document.querySelector('.toc-nav');
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const markdownContent = document.querySelector('.markdown-body');
    
    tocNav.innerHTML = '';
    
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        
        const level = parseInt(heading.tagName.charAt(1));
        link.className = `toc-h${level}`;
        link.dataset.level = level;
        
        // Inicialmente ocultar subtítulos
        if (level > 1) {
            link.style.display = 'none';
        }
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remover clase active de todos los enlaces
            tocNav.querySelectorAll('a').forEach(el => {
                el.classList.remove('active');
            });
            
            // Agregar clase active al elemento clickeado
            link.classList.add('active');
            
            // Toggle solo los subtítulos directos
            if (level === 1) {
                // Checar si ya está expandido
                const isAlreadyExpanded = (() => {
                    let expanded = false;
                    let found = false;
                    tocNav.querySelectorAll('a').forEach(el => {
                        if (el === link) found = true;
                        if (found && el.dataset.level === '2') {
                            if (el.style.display !== 'none') expanded = true;
                        }
                        if (found && el.dataset.level === '1' && el !== link) {
                            return;
                        }
                    });
                    return expanded;
                })();
            
                // Primero, cerrar todo
                tocNav.querySelectorAll('a[data-level="2"], a[data-level="3"]').forEach(el => {
                    el.style.display = 'none';
                });
            
                // Si no estaba expandido, expandir
                if (!isAlreadyExpanded) {
                    let show = false;
                    tocNav.querySelectorAll('a').forEach(el => {
                        if (el === link) {
                            show = true;
                            return;
                        }
            
                        if (show && el.dataset.level === '1') {
                            show = false;
                        }
            
                        if (show && el.dataset.level === '2') {
                            el.style.display = 'block';
                        }
                    });
                }
            } else if (level === 2) {
                const isAlreadyExpanded = (() => {
                    let expanded = false;
                    let found = false;
                    tocNav.querySelectorAll('a').forEach(el => {
                        if (el === link) found = true;
                        if (found && el.dataset.level === '3') {
                            if (el.style.display !== 'none') expanded = true;
                        }
                        if (found && (el.dataset.level === '1' || el.dataset.level === '2') && el !== link) {
                            return;
                        }
                    });
                    return expanded;
                })();
            
                tocNav.querySelectorAll('a[data-level="3"]').forEach(el => {
                    el.style.display = 'none';
                });
            
                if (!isAlreadyExpanded) {
                    let show = false;
                    tocNav.querySelectorAll('a').forEach(el => {
                        if (el === link) {
                            show = true;
                            return;
                        }
            
                        if (show && (el.dataset.level === '1' || el.dataset.level === '2')) {
                            show = false;
                        }
            
                        if (show && el.dataset.level === '3') {
                            el.style.display = 'block';
                        }
                    });
                }
            }
            
            
            // Scroll suave solo en el contenido
            const contentContainer = document.querySelector('.content');
            const headingOffsetTop = heading.offsetTop;
            contentContainer.scrollTo({
                top: headingOffsetTop,
                behavior: 'smooth'
            });

            
            // Efecto de highlight
            heading.classList.add('highlight-heading');
            setTimeout(() => {
                heading.classList.remove('highlight-heading');
            }, 2000);
        });
        
        tocNav.appendChild(link);
    });
}

function updateActiveHeading() {
    const contentContainer = document.querySelector('.content');
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const scrollPosition = contentContainer.scrollTop;

    // Remover todas las clases active primero
    headings.forEach(heading => heading.classList.remove('active'));
    document.querySelectorAll('.toc-nav a').forEach(link => link.classList.remove('active'));

    // Encontrar el encabezado activo
    for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        const headingTop = heading.offsetTop - contentContainer.offsetTop;

        if (scrollPosition >= headingTop - 100) {
            // Activar el encabezado en el contenido
            heading.classList.add('active');
            
            // Activar el enlace correspondiente en el TOC
            const correspondingLink = document.querySelector(`.toc-nav a[href="#${heading.id}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
            break;
        }
    }
}


// Actualizar el event listener para usar el contenedor correcto
document.querySelector('.content').addEventListener('scroll', updateActiveHeading);
// Remover el listener del window
// window.removeEventListener('scroll', updateActiveHeading);

let forcedScroll = false;
let lastActiveHeading = null;

document.querySelector('.content').addEventListener('scroll', () => {
    if (forcedScroll) return;
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const tocActive = document.querySelector('.toc-nav a.active');
    if (!tocActive) return;

    // Encuentra el heading activo
    const headingId = tocActive.getAttribute('href').replace('#', '');
    const activeHeading = document.getElementById(headingId);

    if (!activeHeading) return;

    // Si el usuario se aleja más de 200px del heading activo, lo regresa
    const contentContainer = document.querySelector('.content');
    const scrollPosition = contentContainer.scrollTop;
    const headingTop = activeHeading.offsetTop;

    if (Math.abs(scrollPosition - headingTop) > 200) {
        forcedScroll = true;
        contentContainer.scrollTo({
            top: headingTop,
            behavior: 'smooth'
        });
        setTimeout(() => { forcedScroll = false; }, 500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
        img.setAttribute('draggable', 'false');
        img.addEventListener('dragstart', e => e.preventDefault());
    });
});