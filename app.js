const input = document.getElementById('input');
const search = document.getElementById('search');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');
const toggle = document.getElementById('toggle');
const body = document.querySelector('html');
const resultTotal = 6;

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

const searchMusic = () => {
  const query = input.value.trim();
  if (query === '') {
    error.textContent = 'Please enter a search query.';
    error.style.display = 'block';
    return;
  }
  loading.style.display = 'block';
  error.style.display = 'none';
  results.innerHTML = '';
  fetch(`https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=${resultTotal}`)
    .then(response => {
      loading.style.opacity = 0;
      if (!response.ok) {
        results.innerHTML = `We are having some trouble fetching your music!! 🤔 `;
        console.log(response);
      }
      return response.json();
    })
    .then(result => {
      console.log(result);
      if (result.results.length === 0) {
        error.textContent = 'No results found.';
        error.style.opacity = 1;
        return;
      }
      const html = result.results.map(item => `
        <div class='result'>
          <h3>${item.trackName}</h3>
          <img src='${item.artworkUrl100}'/>
          <audio controls>
            <source src='${item.previewUrl}' type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>
        </div>
      `).join('');
      results.innerHTML = html;
    })
    .catch(error => {
      results.innerHTML = "An error occurred!";
      console.log('error', error);
      loading.style.opacity = 0;
      error.style.opacity = 1;
    });
};

const debouncedSearchMusic = debounce(searchMusic, 500);

input.addEventListener('keydown', () => {
  if (event.key === 'Enter') {
    debouncedSearchMusic();
  }
});

document.addEventListener('click', event => {
  if (event.target === search) {
    debouncedSearchMusic();
  }
});

window.addEventListener('DOMContentLoaded', searchMusic);

toggle.addEventListener('change', () => {
  body.classList.toggle('dark-mode', toggle.checked);
});
