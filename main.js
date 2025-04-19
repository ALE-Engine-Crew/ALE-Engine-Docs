function loadMarkdown(file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(text => {
            const element = document.querySelector(`a[onclick*="${file}"]`);
            if (element) {
                // Remover clase si ya existe
                element.classList.remove('blink-animation');
                // Forzar reflow
                void element.offsetWidth;
                // Agregar clase para iniciar animación
                element.classList.add('blink-animation');
                // Remover clase después de la animación
                setTimeout(() => {
                    element.classList.remove('blink-animation');
                }, 4000);
            }
            
            document.getElementById('markdown-content').innerHTML = marked.parse(text);
            updateTOC(); // Actualizar el índice después de cargar el contenido
            addCopyButtons(); // Agregar botones después de cargar el contenido
        })
        .catch(() => {
            document.getElementById('markdown-content').innerHTML = '<p>No se pudo cargar la documentación.</p>';
        });
}
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const mainContent = document.getElementById('main-content');

// Estado inicial según pantalla
function setSidebarInitialState() {
    const container = document.querySelector('.container');
    
    if (window.innerWidth <= 900) {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-closed');
        container.classList.add('sidebar-closed');
    } else {
        sidebar.classList.remove('sidebar-closed', 'sidebar-open');
        container.classList.remove('sidebar-closed');
    }
}

function toggleSidebar() {
    const container = document.querySelector('.container');
    
    if (sidebar.classList.contains('sidebar-closed')) {
        openSidebar();
        // Añadir pequeño delay para la animación
        setTimeout(() => {
            container.classList.remove('sidebar-closed');
        }, 50);
    } else {
        closeSidebar();
        container.classList.add('sidebar-closed');
    }
}

function openSidebar() {
    sidebar.classList.add('sidebar-open');
    sidebar.classList.remove('sidebar-closed');
}

function closeSidebar() {
    sidebar.classList.remove('sidebar-open');
    sidebar.classList.add('sidebar-closed');
}

setSidebarInitialState();
window.addEventListener('resize', setSidebarInitialState);
sidebarToggle.addEventListener('click', toggleSidebar);
sidebarClose.addEventListener('click', closeSidebar);

// Cerrar sidebar al hacer click fuera en móvil
window.addEventListener('click', function(e) {
    if (window.innerWidth <= 900 && 
        sidebar.classList.contains('sidebar-open') && 
        !sidebar.contains(e.target) && 
        e.target !== sidebarToggle) {
        closeSidebar();
    }
});

function showToast(message, type = 'success') {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const aleIcon = '<img src="assets/images/iconOG.png" alt="ALE" class="toast-icon">';
    const statusIcon = type === 'success' 
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

    toast.innerHTML = `${aleIcon}${statusIcon}<span>${message}</span>`;
    document.body.appendChild(toast);

    // Forzar reflow para activar la transición
    toast.offsetHeight;
    toast.classList.add('show');

    // Remover después de 3 segundos
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.markdown-body pre');
    
    codeBlocks.forEach(block => {
        // Solo agregar botón si no existe ya
        if (!block.querySelector('.copy-button')) {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            
            button.addEventListener('click', async () => {
                const code = block.querySelector('code') ? 
                    block.querySelector('code').textContent : 
                    block.textContent;
                
                try {
                    await navigator.clipboard.writeText(code);
                    button.classList.add('copied');
                    showToast('¡Código copiado!', 'success');
                    
                    setTimeout(() => {
                        button.classList.remove('copied');
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar:', err);
                    showToast('Error al copiar el código', 'error');
                }
            });
            
            block.appendChild(button);
        }
    });
}

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

// Observador para actualizar el índice al hacer scroll
function updateActiveHeading() {
    const headings = document.querySelectorAll('.markdown-body h1, .markdown-body h2, .markdown-body h3');
    const tocLinks = document.querySelectorAll('.toc-nav a');
    
    let currentHeading = null;
    
    headings.forEach(heading => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 100) {
            currentHeading = heading;
        }
    });
    
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (currentHeading && link.getAttribute('href') === `#${currentHeading.id}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveHeading);