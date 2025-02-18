document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content");
    const header = document.querySelector("#header");
    const detailHero = document.querySelector('.detail-hero img');
    const detailTitle = document.querySelector('.detail h2');
    const detailInfo = document.querySelector('.detail-info ul');
    const detailDescription = document.querySelector('.product-description p');
    const specificationsContainer = document.querySelector('.product-specifications');
    const mainImage = document.querySelector('#main-img');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImage = document.querySelector('#lightbox-img');
    const closeLightbox = document.querySelector('#close-lightbox');
    const lightboxPrev = document.querySelector('#lightbox-prev');
    const lightboxNext = document.querySelector('#lightbox-next');
    let currentIndex = 0;
    let images = [];

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });


    window.addEventListener('scroll', () => {
        header.classList.toggle('activeHeader', window.scrollY > 10);
    });

    if (window.location.pathname.endsWith("detail.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        const modelId = urlParams.get("id");

        fetch("js/motorcycle.json")
            .then(response => response.json())
            .then(data => {
                const model = data.find(m => m.id == modelId);
                if (!model) {
                    console.error("Model not found!");
                    return;
                }

                images = model.images;

                document.title = `MOTO crew - Royal Enfield ${model.model}`;
                document.querySelector("meta[name='description']").setAttribute("content", `${model.model}. Profesionální servis, testovací jízdy a široký výběr doplňků.`);
                document.querySelector("meta[property='og:title']").setAttribute("content", `MOTO crew - ${model.model}`);
                document.querySelector("meta[property='og:description']").setAttribute("content", `${model.model} . Profesionální servis a prodej motocyklů Royal Enfield.`);
                document.querySelector("meta[property='og:url']").setAttribute("content", `https://www.mt-crew.cz/detail/${model.model.toLowerCase().replace(/\s/g, "-").replace(/-+/g, '-').replace(/[^a-z0-9-]/g, '')}`);
                document.querySelector("link[rel='canonical']").setAttribute("href", `https://www.mt-crew.cz/detail/${model.model.toLowerCase().replace(/\s/g, "-").replace(/-+/g, '-').replace(/[^a-z0-9-]/g, '')}`);

                detailHero.src = model.images[0];
                detailHero.alt = model.model;
                detailTitle.textContent = model.model;
                detailInfo.innerHTML = `
                    <li>Objem motoru: ${model.specifications.engine.capacity}</li>
                    <li>Výkon: ${model.specifications.engine.max_power}</li>
                    <li>Hmotnost: ${model.specifications.dimensions.weight}</li>
                    <li>Barva: ${model.variant}</li>
                `;
                detailDescription.textContent = model.description;
                renderSpecifications(model.specifications, specificationsContainer);

                const thumbnailGallery = document.querySelector('.thumbnail-gallery');
                let currentThumbnail = null;

                model.images.forEach((image, index) => {
                    const thumbnail = document.createElement('img');
                    thumbnail.src = image;
                    thumbnail.alt = `Náhľad ${index + 1}`;
                    thumbnail.classList.add('thumbnail');
                    thumbnailGallery.appendChild(thumbnail);

                    thumbnail.addEventListener('click', () => {
                        detailHero.src = image;
                        detailHero.alt = `Obrázok ${index + 1}`;
                        if (currentThumbnail) {
                            currentThumbnail.classList.remove('active-thumbnail');
                        }
                        thumbnail.classList.add('active-thumbnail');
                        currentThumbnail = thumbnail;
                    });

                    if (index === 0) {
                        thumbnail.classList.add('active-thumbnail');
                        currentThumbnail = thumbnail;
                    }
                });

                const prevButton = document.createElement('button');
                const nextButton = document.createElement('button');
                prevButton.classList.add('prev-button');
                prevButton.textContent = '<';
                nextButton.classList.add('next-button');
                nextButton.textContent = '>';

                document.querySelector('.detail-hero').appendChild(prevButton);
                document.querySelector('.detail-hero').appendChild(nextButton);


                function updateMainImage(index) {
                    currentIndex = index;
                    detailHero.src = model.images[index];
                    detailHero.alt = `Obrázok ${index + 1}`;

                    if (currentThumbnail) {
                        currentThumbnail.classList.remove('active-thumbnail');
                    }

                    const newThumbnail = thumbnailGallery.children[index];
                    newThumbnail.classList.add('active-thumbnail');
                    currentThumbnail = newThumbnail;

                    newThumbnail.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }

                prevButton.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : model.images.length - 1;
                    updateMainImage(currentIndex);
                });

                nextButton.addEventListener('click', () => {
                    currentIndex = (currentIndex < model.images.length - 1) ? currentIndex + 1 : 0;
                    updateMainImage(currentIndex);
                });

                if (model.images.length > 0) {
                    updateMainImage(currentIndex);
                }
            })
            .catch(error => console.error("Chyba pri načítaní JSON:", error));
    }

    mainImage.addEventListener('click', () => {
        lightboxImage.src = mainImage.src;
        lightbox.style.display = 'flex';
    });

    function updateLightboxImage(index) {
        lightboxImage.src = images[index];
        lightboxImage.alt = `Obrázek ${index + 1}`;
    }

    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        updateLightboxImage(currentIndex);
    })

    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage(currentIndex);
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            updateLightboxImage(currentIndex);
        } else if (event.key === 'ArrowRight') {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            updateLightboxImage(currentIndex);
        }
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            lightbox.style.display = 'none';
        }
    });

    function renderSpecifications(specifications, container) {
        const engineTable = container.querySelector('#engine table');
        engineTable.innerHTML = `
            <tr><th>Typ motoru</th><td>${specifications.engine.cooling_system}</td></tr>
            <tr><th>Obsah</th><td>${specifications.engine.capacity}</td></tr>
            <tr><th>Válce</th><td>${specifications.engine.cylinders}</td></tr>
            <tr><th>Vrtání x zdvih</th><td>${specifications.engine.bore_stroke}</td></tr>
            <tr><th>Výkon</th><td>${specifications.engine.max_power}</td></tr>
            <tr><th>Kroutící moment</th><td>${specifications.engine.max_torque}</td></tr>
            <tr><th>Spojka</th><td>${specifications.engine.clutch}</td></tr>
            <tr><th>Převodovka</th><td>${specifications.engine.gearbox}</td></tr>
        `;

        const dimensionsTable = container.querySelector('#dimensions table');
        dimensionsTable.innerHTML = `
            <tr><th>Rozvor</th><td>${specifications.dimensions.wheelbase}</td></tr>
            <tr><th>Délka x Šířka x Výška</th><td>${specifications.dimensions.length_width_height}</td></tr>
            <tr><th>Výška sedla</th><td>${specifications.dimensions.seat_height}</td></tr>
            <tr><th>Hmotnost</th><td>${specifications.dimensions.weight}</td></tr>
            <tr><th>Světlá výška</th><td>${specifications.dimensions.ground_clearance}</td></tr>
            <tr><th>Kapacita nádrže</th><td>${specifications.capacity.fuel_tank}</td></tr>
        `;

        const frameTable = container.querySelector('#frame table');
        frameTable.innerHTML = `
            <tr><th>Rám</th><td>${specifications.frame_chassis_brakes.frame_type}</td></tr>
            <tr><th>Prední vidlice</th><td>${specifications.frame_chassis_brakes.front_suspension}</td></tr>
            <tr><th>Zadní tlumiče</th><td>${specifications.frame_chassis_brakes.rear_suspension}</td></tr>
        `;

        const brakeTable = container.querySelector('#brakes-tires table');
        brakeTable.innerHTML = `
            <tr><th>Přední pneu</th><td>${specifications.frame_chassis_brakes.front_wheel}</td></tr>
            <tr><th>Zadní pneu</th><td>${specifications.frame_chassis_brakes.rear_wheel}</td></tr>
            <tr><th>Přední brzda</th><td>${specifications.frame_chassis_brakes.front_brake}</td></tr>
            <tr><th>Zadní brzda</th><td>${specifications.frame_chassis_brakes.rear_brake}</td></tr>
            <tr><th>ABS</th><td>${specifications.frame_chassis_brakes.abs}</td></tr>
        `;

        const electroTable = container.querySelector('#electronics table');
        electroTable.innerHTML = `
            <tr><th>Displej</th><td>${specifications.equipment.dashboard}</td></tr>
            <tr><th>Nouzový vipínač</th><td>${specifications.equipment.emergency_switch}</td></tr>
            <tr><th>Centrální a boční stojan</th><td>${specifications.equipment.center_and_side_stand}</td></tr>
            <tr><th>Sada nářadí</th><td>${specifications.equipment.tool_kit}</td></tr>
            <tr><th>Spínač bočního stojanu</th><td>${specifications.equipment.side_stand_switch}</td></tr>
        `;
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu');
    const navMenu = document.querySelector('#nav-menu')
    const linkMenu = document.querySelectorAll('#nav-menu a');

    menu.addEventListener('click', () => {
        menu.classList.toggle('open');
        navMenu.classList.toggle('active')
    })

    window.addEventListener('scroll', () => {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active')
            menu.classList.remove('open')
        }
    })

    linkMenu.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            navMenu.classList.remove('active')

            // window.scrollTo({
            //     top: 0, behavior: "smooth"
            // })
        })
    })
})