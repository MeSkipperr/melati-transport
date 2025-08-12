let translations = {};
const defaultLang = 'en';
let currentLang = localStorage.getItem('lang') || defaultLang;

// Load translation file
async function loadTranslations() {
  try {
    const res = await fetch('./translations.json');
    translations = await res.json();
    applyTranslations(currentLang);
    setupLanguageSelector();
  } catch (err) {
    console.error("Failed to load translations:", err);
  }
}

// Apply translations to elements with [data-key]
function applyTranslations(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  const langData = translations[lang];
  if (!langData) return;

  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key');
    if (langData[key]) {
      el.textContent = langData[key];
    }
  });

  // Update language selector UI
  document.querySelectorAll('.language-selector span').forEach(el => {
    el.classList.remove('selected-language');
    if (el.getAttribute('data-key').startsWith(lang)) {
      el.classList.add('selected-language');
    }
  });

  // Re-render car list after changing language
  renderCars();
}

// Setup click events for language toggle
function setupLanguageSelector() {
  document.querySelectorAll('.language-selector span').forEach(el => {
    el.addEventListener('click', () => {
      const lang = el.getAttribute('data-key').split('-')[0]; // "en" or "id"
      applyTranslations(lang);
    });
  });
}

// Load and render car list
async function renderCars() {
  try {
    const res = await fetch('./data.json');
    const data = await res.json();
    const carList = document.getElementById('car-list');
    carList.innerHTML = '';

    const langData = translations[currentLang];

    data.cars.forEach(car => {
      const li = document.createElement('li');
      li.className = 'car-list-card';

      li.innerHTML = `
        <div class="car-list-card-cover">
          <img src="${car.image}" alt="${car.name}" />
        </div>
        <div class="car-list-card-title">
          <h2>${car.name}</h2>
        </div>
        <div class="car-list-card-description">
          <span>${langData['car-list-capacity']?.replace('{n}', car.capacity) || `Kapasitas ${car.capacity} orang`}</span>
          <div class="car-list-card-price">
            <span>${langData['car-list-release-key'] || 'Lepas Kunci'}</span>
            <span>${formatPrice(car.price_per_day)}</span>
          </div>
          <a href="https://wa.me/62881038169779?text=${formatContent(car.name)}"  target="_blank" rel="noopener noreferrer">
            <button>${langData['book-now'] || 'Pesan Sekarang'}</button>
          </a>
        </div>
      `;

      carList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load cars:", err);
  }
}

// Format price with currency
function formatPrice(amount) {
  return currentLang === 'id'
    ? `Rp${amount.toLocaleString('id-ID')}K/Hari`
    : `Rp${amount.toLocaleString('id-ID')}K/Day`;
}
function formatContent(car) {
  return currentLang === 'id'
    ? `Halo, saya ingin menyewa mobil ${car}`
    : `Hello, I would like to rent the car ${car}`;
}

document.addEventListener('DOMContentLoaded', () => {
  loadTranslations();
});

const navIcon = document.getElementById("nav-icon");
const navIconImg = document.getElementById("nav-icon-img");
const navSidebar = document.getElementById("nav-sidebar");

// Fungsi kunci & buka scroll (aman di desktop & mobile)
let scrollPosition = 0;

// Toggle sidebar saat menu icon diklik
navIcon.addEventListener("click", () => {
    navSidebar.classList.toggle("show-sidebar");

    if (navSidebar.classList.contains("show-sidebar")) {
        navIconImg.src = "/public/icons/close.svg";
    } else {
        navIconImg.src = "/public/icons/menu.svg";
    }
});

// Tutup sidebar saat link di dalamnya diklik
document.querySelectorAll("#nav-sidebar a").forEach(link => {
    link.addEventListener("click", () => {
        navSidebar.classList.remove("show-sidebar");
        navIconImg.src = "/public/icons/menu.svg";
        unlockBodyScroll();
    });
});