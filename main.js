function loadMarkdown(file) {
    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar el archivo.');
            return response.text();
        })
        .then(text => {
            document.getElementById('markdown-content').innerHTML = marked.parse(text);
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
    if (window.innerWidth <= 900) {
        sidebar.classList.remove('sidebar-open');
        sidebar.classList.add('sidebar-closed');
    } else {
        sidebar.classList.remove('sidebar-closed', 'sidebar-open');
    }
}

function toggleSidebar() {
    if (sidebar.classList.contains('sidebar-closed')) {
        openSidebar();
    } else {
        closeSidebar();
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