document.addEventListener('DOMContentLoaded', function () {
    const promoCards = document.querySelectorAll('.promo-card');
    
    // --- LÓGICA PARA EL MENÚ DE HAMBURGUESA ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links-container');
    const icon = menuToggle.querySelector('i');

    menuToggle.addEventListener('click', function() {
        navLinksContainer.classList.toggle('show');

        // Cambia el ícono de hamburguesa a una 'X' y viceversa
        if (navLinksContainer.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // --- LÓGICA PARA EL MENÚ DESPLEGABLE DE CATEGORÍAS ---
    const dropdownContainer = document.querySelector('.dropdown-container');
    const categoryMenuLink = dropdownContainer.querySelector('a');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const categoryFilterLinks = document.querySelectorAll('.category-filter');

    categoryMenuLink.addEventListener('click', function (e) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', function (e) {
        if (!dropdownContainer.contains(e.target)) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });

    categoryFilterLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.getAttribute('data-category');

            promoCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || selectedCategory === cardCategory) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            dropdownMenu.classList.remove('show');
        });
    });

    // --- LÓGICA PARA LA BARRA DE BÚSQUEDA ---
    const searchBar = document.getElementById('search-bar');
    
    searchBar.addEventListener('input', function () {
        const searchTerm = this.value.toLowerCase().trim();

        promoCards.forEach(card => {
            const cardContent = card.textContent.toLowerCase();
            if (cardContent.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // --- LÓGICA PARA EL BOTÓN VOLVER ARRIBA AÑADIDA ---
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    // Muestra u oculta el botón según el scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) { // Muestra el botón después de 300px de scroll
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    // Acción de scroll suave al hacer clic
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


});