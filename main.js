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