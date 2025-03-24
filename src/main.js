import { searchImages } from './js/pixabay-api';
import { renderGallery, clearGallery } from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = form.elements['search-text'].value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search term!' });
    return;
  }

  page = 1;
  clearGallery();
  loadMoreBtn.classList.add('hidden');
  loader.classList.remove('hidden');

  try {
    const data = await searchImages(query, page, perPage);
    if (data.hits.length === 0) {
      iziToast.error({ message: 'Sorry, no images found!' });
      return;
    }
    renderGallery(data.hits);
    loadMoreBtn.classList.remove('hidden');
  } catch (error) {
    iziToast.error({ message: error.message });
  } finally {
    loader.classList.add('hidden');
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loader.classList.remove('hidden');

  try {
    const data = await searchImages(query, page, perPage);
    renderGallery(data.hits);

    if (page * perPage >= data.totalHits) {
      loadMoreBtn.classList.add('hidden');
      iziToast.info({ message: "We're sorry, but you've reached the end of search results." });
    }
  } catch (error) {
    iziToast.error({ message: error.message });
  } finally {
    loader.classList.add('hidden');
  }
});

function smoothScroll() {
  const galleryItem = document.querySelector('.gallery li');
  if (galleryItem) {
    const { height } = galleryItem.getBoundingClientRect();
    window.scrollBy({
      top: height * 2,
      behavior: 'smooth',
    });
  }
}
