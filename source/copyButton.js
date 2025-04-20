function addCopyButtons() {
    // Seleccionar todos los bloques pre que estén dentro de markdown-body
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        // Asegurarse de que el bloque tenga la clase markdown-body
        if (!block.classList.contains('markdown-body')) {
            block.classList.add('markdown-body');
        }
        
        // Solo agregar botón si no existe ya
        if (!block.querySelector('.copy-button')) {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
            
            button.addEventListener('click', async () => {
                let textToCopy;
                const codeElement = block.querySelector('code');
                
                // Obtener el texto ya sea del elemento code o directamente del pre
                if (codeElement) {
                    textToCopy = codeElement.textContent;
                } else {
                    textToCopy = block.textContent;
                    // Remover el contenido del botón del texto copiado
                    textToCopy = textToCopy.replace(button.textContent, '');
                }
                
                try {
                    await navigator.clipboard.writeText(textToCopy.trim());
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
