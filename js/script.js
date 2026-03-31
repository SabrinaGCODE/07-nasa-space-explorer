const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// keeps the starter date logic working
setupDateInputs(startInput, endInput);

const apiKey = 'DEMO_KEY';

button.addEventListener('click', async function () {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    gallery.innerHTML = `<p class="placeholder">Please select both dates first.</p>`;
    return;
  }

  gallery.innerHTML = `<p class="placeholder">🔄 Loading space photos...</p>`;

  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    gallery.innerHTML = '';

    const items = Array.isArray(data) ? data.reverse() : [data];

    items.forEach(function (item) {
      if (item.media_type === 'image') {
        const card = document.createElement('div');
        card.classList.add('gallery-item');

        card.innerHTML = `
          <img src="${item.url}" alt="${item.title}">
          <h3>${item.title}</h3>
          <p>${item.date}</p>
        `;

        card.addEventListener('click', function () {
          modal.classList.remove('hidden');
          modalImage.src = item.url;
          modalImage.alt = item.title;
          modalTitle.textContent = item.title;
          modalDate.textContent = item.date;
          modalExplanation.textContent = item.explanation;
        });

        gallery.appendChild(card);
      }
    });

    if (gallery.innerHTML === '') {
      gallery.innerHTML = `<p class="placeholder">No image entries were found for this date range.</p>`;
    }
  } catch (error) {
    console.error('Error fetching NASA data:', error);
    gallery.innerHTML = `<p class="placeholder">Something went wrong. Try again.</p>`;
  }
});

closeModal.addEventListener('click', function () {
  modal.classList.add('hidden');
});

modal.addEventListener('click', function (event) {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});