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