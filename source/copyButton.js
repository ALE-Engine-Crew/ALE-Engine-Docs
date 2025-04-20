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
