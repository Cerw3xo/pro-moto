document.addEventListener('DOMContentLoaded', () => {
    const motorcycleGrid = document.querySelector('.motorcycle-grid');
    const paginationContainer = document.querySelector('.pagination');

    const filterInput = document.getElementById('filter-input');
    const filterButton = document.getElementById('filter-button');
    const resetButton = document.getElementById('reset-button');
    const modelFilter = document.getElementById('model-filter');



    const itemsPerPage = window.innerWidth <= 1210 ? 8 : 9;
    let currentPage = 1;
    let motorcycles = [];
    let filteredMotorcycles = [];

    const modelCategories = [
        "Classic", "Bear", "Guerrilla", "HNTR", "Shotgun",
        "Bullet", "Super Meteor", "Scram", "Meteor",
        "Interceptor", "Continental GT", "Himalayan"
    ];

    fetch('js/motorcycle.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP chyba! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            motorcycles = data;
            filteredMotorcycles = motorcycles;
            renderPage(currentPage);
            renderPagination();

            populateModelFilter();
        })
        .catch(error => console.error('Chyba pri načítaní JSON:', error));

    function renderPage(page) {
        motorcycleGrid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsToShow = filteredMotorcycles.slice(start, end);

        itemsToShow.forEach(model => {
            if (!model.images || model.images.length === 0) {
                console.warn(`Model ${model.model} nemá obrázky.`);
                return;
            }

            const productItem = document.createElement('div');
            productItem.classList.add('product-item');

            productItem.setAttribute('data-id', model.id);

            productItem.innerHTML = `
                <img src="${model.images[0]}" alt="${model.model}">
                <h3>${model.model}</h3>
                <p class="price">${model.price || 'Cena nie je dostupná.'}</p>
                <a href="detail.html?id=${model.id}" class="details-link">Zobrazit detaily</a>
            `;

            productItem.addEventListener('click', () => {
                location.href = `detail.html?id=${model.id}`;
            });

            motorcycleGrid.appendChild(productItem);
        });
    }

    function renderPagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(filteredMotorcycles.length / itemsPerPage);

        if (pageCount <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page-button');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
                updatePagination();
            });
            paginationContainer.appendChild(pageButton);
        }
    }

    function updatePagination() {
        const pageButtons = document.querySelectorAll('.page-button');
        pageButtons.forEach(button => {
            button.classList.remove('active');
            if (parseInt(button.textContent) === currentPage) {
                button.classList.add('active');
            }
        });
    }

    function populateModelFilter() {
        modelCategories.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelFilter.appendChild(option);
        });
    }

    filterButton.addEventListener('click', () => {
        const filterText = filterInput.value.toLowerCase();
        const selectedModel = modelFilter.value;

        filteredMotorcycles = motorcycles.filter(model => {
            const matchedCategory = modelCategories.find(category => model.model.startsWith(category));

            return (selectedModel === '' || matchedCategory === selectedModel) &&
                (filterText === '' || model.model.toLowerCase().includes(filterText));
        })
        currentPage = 1;
        renderPage(currentPage);
        renderPagination();
    });

    resetButton.addEventListener('click', () => {
        filterInput.value = '';
        modelFilter.value = '';

        filteredMotorcycles = motorcycles;
        currentPage = 1;
        renderPage(currentPage);
        renderPagination();
    });
});

