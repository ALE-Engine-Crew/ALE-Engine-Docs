// Configurar marked antes de usarlo
marked.setOptions({
    highlight: function(code, lang) {
        return `<pre class="markdown-body"><code class="language-${lang || 'plaintext'}">${code}</code></pre>`;
    },
    langPrefix: 'language-'
});

function loadMarkdown(file) {
    // Guardar la posición actual del scroll
    const currentScroll = window.scrollY;

    // DEVOLVER UNA PROMISE
    return fetch(file)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.text();
        })
        .then(text => {
            const element = document.querySelector(`a[onclick*="${file}"]`);
            if (element) {
                element.classList.remove('blink-animation');
                element.classList.add('blink-animation');
                setTimeout(() => {
                    element.classList.remove('blink-animation');
                }, 4000);
            }
            
            document.getElementById('markdown-content').innerHTML = marked.parse(text);
            updateTOC();
            addCopyButtons();
            window.scrollTo(0, currentScroll);
        })
        .catch(() => {
            document.getElementById('markdown-content').innerHTML = '<p>No se pudo cargar la documentación.</p>';
        });
}