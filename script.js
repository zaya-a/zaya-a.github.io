// 1. Változók beállítása
const startYearSlider = document.getElementById('startYear');
const endYearSlider = document.getElementById('endYear');
const startYearDisplay = document.getElementById('startYearDisplay');
const endYearDisplay = document.getElementById('endYearDisplay');
const overlayContainer = document.getElementById('overlay-container');

// A szükséges évszámok tartománya
const MIN_YEAR = 2007;
const MAX_YEAR = 2024;

// 2. Képek előkészítése és egyszeri beillesztése a DOM-ba
// Ez a függvény csak egyszer fut le az oldal betöltésekor.
function setupImages() {
    for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
        // A képeket el kell nevezned pl. "map_2000.png", "map_2001.png" stb.
        const img = document.createElement('img');
        img.src = `maps/map_${year}.png`; // Feltételezve, hogy van egy 'maps' mappa
        img.alt = `Tájfutó térkép ${year}`;
        img.id = `map_${year}`;
        img.className = 'overlay-map'; // A CSS-ben állítható stílushoz
        img.style.display = 'none'; // Alapból rejtve
        overlayContainer.appendChild(img);
    }
}

// 3. Frissítési logika
function updateMap() {
    // Értékek beolvasása és megjelenítése
    let startYear = parseInt(startYearSlider.value);
    let endYear = parseInt(endYearSlider.value);

    // Biztosítjuk, hogy a kezdő év ne legyen nagyobb, mint a befejező év
    if (startYear > endYear) {
        startYear = endYear;
        startYearSlider.value = endYear;
    }

    startYearDisplay.textContent = startYear;
    endYearDisplay.textContent = endYear;
    
    // Iteráció az összes lehetséges éven
    for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
        const mapElement = document.getElementById(`map_${year}`);
        
        if (mapElement) {
            // Megjelenítés, ha az év a kiválasztott tartományban van
            if (year >= startYear && year <= endYear) {
                mapElement.style.display = 'block';
            } else {
                // Elrejtés, ha nincs a tartományban
                mapElement.style.display = 'none';
            }
        }
    }
}

// 4. Eseményfigyelők
startYearSlider.addEventListener('input', updateMap);
endYearSlider.addEventListener('input', updateMap);

// Indítás az oldal betöltésekor
document.addEventListener('DOMContentLoaded', () => {
    setupImages();
    updateMap(); // Kezdeti állapot megjelenítése (2000-2024)
});