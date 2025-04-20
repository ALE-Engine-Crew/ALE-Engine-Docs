const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarClose = document.getElementById('sidebar-close');
const mainContent = document.getElementById('main-content');

// Estado inicial según pantalla
function setSidebarInitialState() {
    const container = document.querySelector('.container');
    // Solo ajustar el estado si el sidebar NO está abierto
    if (!sidebar.classList.contains('sidebar-open')) {
        if (window.innerWidth <= 900) {
            sidebar.classList.remove('sidebar-closed');
            container.classList.remove('sidebar-closed');
        } else {
            sidebar.classList.remove('sidebar-open');
            sidebar.classList.add('sidebar-closed');
            container.classList.add('sidebar-closed');
        }
    }
}

function toggleSidebar() {
    const container = document.querySelector('.container');
    
    if (sidebar.classList.contains('sidebar-closed')) {
        openSidebar();
        setTimeout(() => {
            container.classList.remove('sidebar-closed');
        }, 50);
    } else {
        closeSidebar();
        setTimeout(() => {
            container.classList.add('sidebar-closed');
            console.log('Sidebar closed');
        }, 50);
    }
}

function openSidebar() {
    sidebar.classList.remove('sidebar-closed');
    sidebar.classList.add('sidebar-open');
    document.querySelector('.container').classList.remove('sidebar-closed');
    document.body.classList.add('sidebar-open');
}

function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('sidebar-open');
    document.body.classList.remove('sidebar-open');
    if (window.innerWidth > 900) {
        sidebar.classList.add('sidebar-closed');
        document.querySelector('.container').classList.add('sidebar-closed');
    } else {
        sidebar.classList.remove('sidebar-closed'); // Remove sidebar-closed on mobile
        document.querySelector('.container').classList.remove('sidebar-closed'); // Also remove from container
    }
}

// Elimina todos los listeners anteriores y déjalos así:
setSidebarInitialState();
window.addEventListener('resize', setSidebarInitialState);

// Botón hamburguesa
sidebarToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar(); // Cambiamos openSidebar() por toggleSidebar()
});

// Botón de cerrar
sidebarClose.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeSidebar();
});

// Click fuera para cerrar
document.addEventListener('click', (e) => {
    const isOpen = sidebar.classList.contains('sidebar-open');
    const isMobile = window.innerWidth <= 900;
    const clickedOutside = !sidebar.contains(e.target);
    const notToggleButton = e.target !== sidebarToggle;
    const notCloseButton = e.target !== sidebarClose;

    if (isOpen && isMobile && clickedOutside && notToggleButton && notCloseButton) {
        closeSidebar(); // Add this line to actually close the sidebar
    }
});