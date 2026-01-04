let tajfutoAdatok = {};

// Az adatok betöltése javítva
fetch('adatok.json')
    .then(response => response.json())
    .then(data => {
        tajfutoAdatok = data.tajfuto_adatok; 
        console.log("Adatok használatra készen:", tajfutoAdatok);
        updateMap();
    })
    .catch(error => console.error('Hiba:', error));

const overlayContainer = document.getElementById('overlay-container');
const startSlider = document.getElementById('startYear');
const endSlider = document.getElementById('endYear');

function updateMap() {
    // Ellenőrizzük, hogy vannak-e már adatok
    if (Object.keys(tajfutoAdatok).length === 0) return;

    let start = parseInt(startSlider.value);
    let end = parseInt(endSlider.value);

    // Kijelző frissítése
    document.getElementById('startYearDisplay').textContent = start;
    document.getElementById('endYearDisplay').textContent = end;

    // Térkép tisztítása
    overlayContainer.innerHTML = '';

    for (let ev = start; ev <= end; ev++) {
        // Ellenőrizzük, hogy az adott év létezik-e az adatokban
        if (tajfutoAdatok && tajfutoAdatok[ev]) {
            tajfutoAdatok[ev].forEach(pont => {
                const dot = document.createElement('div');
                dot.className = 'map-dot';
                dot.style.left = pont.x + '%';
                dot.style.top = pont.y + '%';
                overlayContainer.appendChild(dot);
            });
        }
    }
}

let scale = 1;
const zoomSpeed = 0.1;
const maxScale = 5;
const minScale = 1;

const viewport = document.getElementById('map-viewport');
const container = document.getElementById('map-container');

viewport.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    
    if (e.deltaY < 0) {
        scale = Math.min(scale + zoomSpeed, 5);
    } else {
        scale = Math.max(scale - zoomSpeed, 1);
    }

    updateTransform(); // Ezt használd a sima transform helyett!
    
    // Opcionális: a pöttyök méretének korrigálása, hogy ne legyenek túl óriásiak nagyításkor
    const dots = document.querySelectorAll('.map-dot');
    dots.forEach(dot => {
        dot.style.width = (10 / scale) + 'px';
        dot.style.height = (10 / scale) + 'px';
    });
});

let isDragging = false;
let startX, startY;
let translateX = 0;
let translateY = 0;

// A viewport és container már definiálva van a zoom kódnál
viewport.addEventListener('mousedown', (e) => {
    isDragging = true;
    viewport.style.cursor = 'grabbing';
    // Elmentjük a kezdőpozíciót az egérhez és a jelenlegi eltoláshoz képest
    startX = e.clientX - translateX;
    startY = e.clientY - translateY;
});

window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    // Kiszámoljuk az új pozíciót
    translateX = e.clientX - startX;
    translateY = e.clientY - startY;

    // Alkalmazzuk a mozgást és a nagyítást egyszerre
    updateTransform();
});

window.addEventListener('mouseup', () => {
    isDragging = false;
    viewport.style.cursor = 'grab';
});

// Ez a függvény felelős a végső megjelenítésért
function updateTransform() {
    container.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}

// A zoom függvényedben is cseréld le a container.style.transform sort erre:
// updateTransform();

// Eseményfigyelők
startSlider.addEventListener('input', updateMap);
endSlider.addEventListener('input', updateMap);