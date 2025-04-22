document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const container = document.querySelector('.container');
    const sidebarOverlay = document.createElement('div');
    sidebarOverlay.className = 'sidebar-overlay';
    document.body.appendChild(sidebarOverlay);

    // Estado inicial
    function setInitialState() {
        if (window.innerWidth <= 900) {
            // Mobile: sidebar cerrado por defecto
            sidebar.classList.remove('sidebar-open');
            sidebarOverlay.style.display = 'none';
            container.classList.remove('sidebar-closed');
        } else {
            // Desktop: sidebar abierto por defecto
            sidebar.classList.add('sidebar-open');
            sidebarOverlay.style.display = 'none';
            container.classList.remove('sidebar-closed');
        }
    }

    // Alternar sidebar
    function toggleSidebar(e) {
        e.stopPropagation();
        if (sidebar.classList.contains('sidebar-open')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    function openSidebar() {
        sidebar.classList.add('sidebar-open');
        if (window.innerWidth <= 900) {
            sidebarOverlay.style.display = 'block';
        }
        container.classList.remove('sidebar-closed');
    }

    function closeSidebar() {
        sidebar.classList.remove('sidebar-open');
        sidebarOverlay.style.display = 'none';
        
        // En desktop, añadir clase closed al container para mover el contenido
        if (window.innerWidth > 900) {
            container.classList.add('sidebar-closed');
        } else {
            container.classList.remove('sidebar-closed');
        }
    }

    // Event listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarClose.addEventListener('click', closeSidebar);
    
    // Cerrar al hacer clic en el overlay (solo móviles)
    sidebarOverlay.addEventListener('click', function() {
        if (window.innerWidth <= 900) {
            closeSidebar();
        }
    });

    // Evitar que se cierre al hacer clic dentro del sidebar
    sidebar.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Inicializar
    setInitialState();
    window.addEventListener('resize', setInitialState);
});