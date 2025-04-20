class DocumentSearch {
    constructor() {
      this.searchInput = document.getElementById("sidebar-search")
      this.suggestionsContainer = document.getElementById("search-suggestions")
      this.searchIcon = document.querySelector(".search-icon")
      this.searchCache = new Map()
      this.searchIndex = []
      this.activeIndex = -1
      this.results = []
  
      this.init()
    }
  
    async init() {
      try {
        // Cargar el índice de búsqueda
        this.searchIndex = [
          { path: "md/LuaApi.md", title: "Lua API" },
          // Agregar más documentos aquí
        ]
        this.initialized = true
        this.setupEventListeners()
      } catch (error) {
        console.error("Error initializing search:", error)
      }
    }
  
    setupEventListeners() {
      // Event listener para el ícono de búsqueda
      this.searchIcon.addEventListener("click", () => {
        if (this.results.length > 0) {
          this.selectResult(0) // Seleccionar primera opción
        }
      })
  
      this.searchInput.addEventListener("focus", () => {
        this.activateSearch()
        if (this.searchInput.value.trim()) {
          this.handleSearch()
        }
      })
  
      this.searchInput.addEventListener(
        "input",
        debounce(() => {
          this.activeIndex = -1
          this.handleSearch()
        }, 300),
      )
  
      this.searchInput.addEventListener("keydown", (e) => {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault()
            this.navigateSuggestions("down")
            break
          case "ArrowUp":
            e.preventDefault()
            this.navigateSuggestions("up")
            break
          case "Enter":
            e.preventDefault()
            if (this.activeIndex >= 0) {
              this.selectResult(this.activeIndex)
            }
            break
          case "Escape":
            e.preventDefault()
            this.deactivateSearch()
            break
        }
      })
  
      // Cerrar solo al hacer clic fuera del buscador y sus sugerencias
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".sidebar-search")) {
          this.deactivateSearch()
        }
      })
    }
  
    activateSearch() {
      // Limpiar estados previos
      document.querySelectorAll(".search-active").forEach((el) => {
        el.classList.remove("search-active")
      })
  
      // Aplicar nuevos estados
      document.querySelector(".content-wrapper").classList.add("search-active")
      document.querySelector(".sidebar ul").classList.add("search-active")
      this.searchInput.focus()
    }
  
    deactivateSearch() {
      document.querySelector(".content-wrapper").classList.remove("search-active")
      document.querySelector(".sidebar ul").classList.remove("search-active")
      this.suggestionsContainer.style.display = "none"
      this.activeIndex = -1
      this.results = []
    }
  
    selectResult(index) {
      const result = this.results[index]
      if (result) {
        console.log("Selecting result:", result) // Debug log
  
        const titleId = result.line
          .trim()
          .toLowerCase()
          .replace(/[^\w]+/g, "-")
  
        if (result.path) {
          this.deactivateSearch()
          this.searchInput.value = ""
  
          loadMarkdown(result.path).then(() => {
            console.log("Markdown loaded, waiting for content...") // Debug log
  
            setTimeout(() => {
              // Buscar el elemento que contiene el texto exacto
              const contentElements = document.querySelectorAll(".markdown-body *")
              let targetElement = null
  
              contentElements.forEach((element) => {
                // Remove HTML tags for comparison
                const elementText = element.textContent.replace(/\s+/g, " ").trim()
                const resultText = result.line
                  .replace(/<[^>]*>/g, "")
                  .replace(/\s+/g, " ")
                  .trim()
  
                if (elementText.includes(resultText)) {
                  targetElement = element
                }
              })
  
              if (targetElement) {
                console.log("Found target element:", targetElement) // Debug log
  
                // Ensure the content container is correctly identified
                const contentContainer = document.querySelector(".content")
  
                // Calculate the exact position accounting for any offsets
                const offsetTop =
                  targetElement.getBoundingClientRect().top +
                  contentContainer.scrollTop -
                  contentContainer.getBoundingClientRect().top
  
                // Perform the scroll with a slight offset to improve visibility
                contentContainer.scrollTo({
                  top: offsetTop - 20, // 20px offset for better visibility
                  behavior: "smooth",
                })
  
                // Add visual feedback
                targetElement.classList.add("search-highlight")
                setTimeout(() => {
                  targetElement.classList.remove("search-highlight")
                }, 3000)
              }
            }, 300)
          })
        }
      }
    }
  
    navigateSuggestions(direction) {
      if (!this.results.length) return
  
      if (direction === "down") {
        this.activeIndex = (this.activeIndex + 1) % this.results.length
      } else {
        this.activeIndex = this.activeIndex <= 0 ? this.results.length - 1 : this.activeIndex - 1
      }
  
      const suggestions = this.suggestionsContainer.querySelectorAll(".suggestion-item")
      suggestions.forEach((s, i) => {
        s.classList.toggle("active", i === this.activeIndex)
      })
  
      // Asegurar que el elemento activo sea visible
      suggestions[this.activeIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      })
    }
  
    async handleSearch() {
      const query = this.searchInput.value.trim().toLowerCase()
      if (!query) {
        this.results = []
        this.suggestionsContainer.style.display = "none"
        return
      }
  
      try {
        this.results = await this.searchInDocuments(query)
        this.displaySuggestions(this.results)
      } catch (error) {
        console.error("Error searching:", error)
      }
    }
  
    async searchInDocuments(query) {
      if (!this.initialized) return []
  
      const results = []
      for (const doc of this.searchIndex) {
        if (!this.searchCache.has(doc.path)) {
          try {
            const content = await fetch(doc.path).then((r) => r.text())
            this.searchCache.set(doc.path, content)
          } catch (error) {
            console.error(`Error loading ${doc.path}:`, error)
            continue
          }
        }
  
        const content = this.searchCache.get(doc.path)
        const matches = this.findMatches(content, query)
        if (matches.length > 0) {
          results.push(
            ...matches.map((match) => ({
              ...match,
              file: doc.title,
              path: doc.path,
            })),
          )
        }
      }
  
      return results.slice(0, 10) // Limitar a 10 resultados
    }
  
    findMatches(content, query) {
      const matches = []
      const lines = content.split("\n")
    
      lines.forEach((line, index) => {
        // Solo considerar líneas que son títulos (empiezan con #)
        const headingMatch = line.match(/^(#+)\s*(.*)/)
        if (headingMatch) {
          const headingText = headingMatch[2].trim()
          if (headingText.toLowerCase().includes(query)) {
            matches.push({
              // Solo resalta el texto del título, sin los #
              line: this.highlightMatch(headingText, query),
              lineNumber: index + 1,
            })
          }
        }
      })
    
      return matches
    }
  
    highlightMatch(text, query) {
      const regex = new RegExp(`(${query})`, "gi")
      return text.replace(regex, '<span class="match-text">$1</span>')
    }
  
    displaySuggestions(results) {
      this.suggestionsContainer.style.display = "block"
    
      if (!results.length) {
        this.suggestionsContainer.classList.add("error")
        this.suggestionsContainer.innerHTML = `
          <div class="error-result">
            <img src="assets/images/logos/Broke.png" alt="No results">
            <span class="error-message">Error: 404</span>
          </div>
        `
        return
      }
    
      this.suggestionsContainer.classList.remove("error")
    
      // Agrupar resultados por archivo
      const grouped = {}
      results.forEach(result => {
        if (!grouped[result.file]) grouped[result.file] = []
        grouped[result.file].push(result)
      })
    
      this.suggestionsContainer.innerHTML = Object.entries(grouped)
        .map(([file, matches]) => `
          <div class="suggestion-file-group">
            <div class="suggestion-file-title">
              <img src="assets/images/logos/FolLogo.png" alt="logo" style="width: 20px; vertical-align: middle; margin-right: 8px;">
              <span>${file}</span>
            </div>
            <div class="suggestion-file-children">
              ${matches.map(result => {
                const titleId = result.line
                  .trim()
                  .toLowerCase()
                  .replace(/[^\w]+/g, "-")
                return `
                  <div class="suggestion-item"
                    data-path="${result.path}"
                    data-title-id="${titleId}">
                    <span class="suggestion-branch">└─</span>
                    <small>${result.line}</small>
                  </div>
                `
              }).join("")}
            </div>
          </div>
        `).join("")
    
      this.activeIndex = -1
    
      // Event listeners para los títulos encontrados
      this.suggestionsContainer.querySelectorAll(".suggestion-item").forEach((item, index) => {
        item.addEventListener("click", () => {
          loadMarkdown(item.dataset.path).then(() => {
            setTimeout(() => {
              const rawText = item.querySelector("small").innerText.replace(/\s+/g, " ").trim()
              let headingElement = null
              document.querySelectorAll(".markdown-body h1, .markdown-body h2, .markdown-body h3").forEach((h) => {
                if (h.textContent.replace(/\s+/g, " ").trim() === rawText) {
                  headingElement = h
                }
              })
              let targetElement = headingElement
              if (!targetElement) {
                document.querySelectorAll(".markdown-body *").forEach((element) => {
                  if (element.textContent && element.textContent.replace(/\s+/g, " ").includes(rawText)) {
                    targetElement = element
                  }
                })
              }
              if (targetElement) {
                const contentContainer = document.querySelector(".content")
                const offsetTop =
                  targetElement.getBoundingClientRect().top +
                  contentContainer.scrollTop -
                  contentContainer.getBoundingClientRect().top
                contentContainer.scrollTo({
                  top: offsetTop - 20,
                  behavior: "smooth",
                })
                targetElement.classList.add("highlight-heading")
                setTimeout(() => {
                  targetElement.classList.remove("highlight-heading")
                }, 2000)
              }
            }, 300)
          })
          this.deactivateSearch()
          this.searchInput.value = ""
        })
    
        item.addEventListener("mouseover", () => {
          this.activeIndex = index
          this.suggestionsContainer.querySelectorAll(".suggestion-item").forEach((s) => s.classList.remove("active"))
          item.classList.add("active")
        })
      })
    }
  }
  
  // Función auxiliar para encontrar el heading padre
  function findParentHeading(element) {
    const currentLevel = Number.parseInt(element.tagName[1])
    let current = element.previousElementSibling
  
    while (current) {
      if (current.tagName && current.tagName.startsWith("H")) {
        const level = Number.parseInt(current.tagName[1])
        if (level < currentLevel) {
          return current
        }
      }
      current = current.previousElementSibling
    }
    return null
  }
  
  // Utilidad para debounce
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  // Agregar esta función para manejar los clicks del TOC
  function setupTOCNavigation() {
    const tocLinks = document.querySelectorAll(".toc-nav a")
  
    tocLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
  
        // Obtener el ID del título al que queremos navegar
        const targetId = link.getAttribute("href").slice(1)
        const targetHeading = document.getElementById(targetId)
  
        if (targetHeading) {
          // Remover highlighting previo
          document.querySelectorAll(".highlight-heading").forEach((el) => {
            el.classList.remove("highlight-heading")
          })
  
          // Verificar si el elemento existe y es visible antes de hacer scroll
          if (targetHeading && targetHeading.offsetParent !== null) {
            // Hacer scroll al título
            targetHeading.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          } else {
            console.warn("El elemento objetivo no es visible o no existe:", targetHeading)
          }
  
          // Destacar el título
          targetHeading.classList.add("highlight-heading")
  
          // Remover el highlighting después de 2 segundos
          setTimeout(() => {
            targetHeading.classList.remove("highlight-heading")
          }, 2000)
  
          // Actualizar los enlaces activos en el TOC
          tocLinks.forEach((l) => l.classList.remove("active"))
          link.classList.add("active")
  
          // Si es un subtítulo, activar también su padre
          const level = Number.parseInt(link.getAttribute("data-level"))
          if (level > 1) {
            let currentElement = link
            while (currentElement) {
              currentElement = currentElement.parentElement.previousElementSibling
              if (
                currentElement &&
                currentElement.tagName === "A" &&
                Number.parseInt(currentElement.getAttribute("data-level")) < level
              ) {
                currentElement.classList.add("active")
                break
              }
            }
          }
        }
      })
    })
  }
  
  // Inicializar la búsqueda cuando el DOM esté listo
  document.addEventListener("DOMContentLoaded", () => {
    new DocumentSearch()
    setupTOCNavigation()
  })
