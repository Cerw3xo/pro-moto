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

    const toSlug = (text) => {
        return String(text)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/[^a-z0-9-]/g, '');
    };

    const modelCategories = {
        "CLASSIC": ["Classic 350", "Bullet"],
        "ADVENTURE": ["Himalayan 450", "Himalayan 411", "Scram"],
        "CHOPPER/CRUISER": ["Meteor", "Super Meteor", "Shotgun", "Classic 650"],
        "STREET": ["Bear", "Guerrilla", "Interceptor", "Continental GT", "HNTR"]
    };

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
            <img src="${model.images[0]}" alt="${model.model}" loading="lazy" decoding="async">
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

        const createPageButton = (page) => {
            const pageButton = document.createElement('button');
            pageButton.textContent = page;
            pageButton.classList.add('page-button');
            if (page === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = page;
                renderPage(currentPage);
                renderPagination();
            });
            return pageButton;
        };

        if (currentPage > 1) {
            const prevButton = createPageButton(currentPage - 1);
            prevButton.textContent = '<';
            paginationContainer.appendChild(prevButton);
        }


        paginationContainer.appendChild(createPageButton(1));

        if (currentPage > 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(pageCount - 1, currentPage + 1); i++) {
            paginationContainer.appendChild(createPageButton(i));
        }

        if (currentPage < pageCount - 2) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            paginationContainer.appendChild(dots);
        }


        if (pageCount > 1) {
            paginationContainer.appendChild(createPageButton(pageCount));
        }


        if (currentPage < pageCount) {
            const nextButton = createPageButton(currentPage + 1);
            nextButton.textContent = '>';
            paginationContainer.appendChild(nextButton);
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
        const modelFilter = document.getElementById("model-filter");


        modelFilter.innerHTML = '<option value="">Všechny modely</option>';


        Object.entries(modelCategories).forEach(([category, models]) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = category;

            models.forEach(model => {
                const option = document.createElement("option");
                option.value = model;
                option.textContent = model;
                optgroup.appendChild(option);
            });

            modelFilter.appendChild(optgroup);
        });


        const engineOptgroup = document.createElement("optgroup");
        engineOptgroup.label = "Objem motoru";

        const engineSizes = ["350", "450", "650"];
        engineSizes.forEach(size => {
            const option = document.createElement("option");
            option.value = `engine-${size}`;
            option.textContent = `${size} ccm`;
            engineOptgroup.appendChild(option);
        });

        modelFilter.appendChild(engineOptgroup);
    }

    filterButton.addEventListener('click', () => {
        const filterText = filterInput.value.toLowerCase();
        const selectedValue = modelFilter.value.trim();
        const isEngineFilter = selectedValue.startsWith("engine-");

        filteredMotorcycles = motorcycles.filter(model => {
            let engineCapacity = model.specifications?.engine?.capacity;
            if (engineCapacity) {
                engineCapacity = parseInt(engineCapacity.replace(" cc", ""));
            }


            let engineMatch = true;
            if (isEngineFilter && engineCapacity) {
                const targetCapacity = parseInt(selectedValue.replace("engine-", ""));
                engineMatch = engineCapacity >= targetCapacity - 10 && engineCapacity <= targetCapacity + 10;
            }


            const matchedCategory = Object.keys(modelCategories).find(category =>
                modelCategories[category].some(modelName => model.model.toLowerCase().includes(modelName.toLowerCase()))
            );

            return (
                (selectedValue === '' || (isEngineFilter ? engineMatch : model.model.includes(selectedValue))) &&
                (filterText === '' || model.model.toLowerCase().includes(filterText))
            );
        });


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

