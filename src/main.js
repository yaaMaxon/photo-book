import Notiflix from 'notiflix';
import ApiService  from "./services/api";

let lightbox = new SimpleLightbox('.gallery a');

const apiService = new ApiService;
const searchForm = document.querySelector('.search-form');
const loadMoreBtn = document.querySelector('.load-more');
const galleryBox = document.querySelector('.gallery');

function onSubmit(e) {
    e.preventDefault()

    const query = e.target.searchQuery.value
    apiService.searchQuery = query

    galleryBox.innerHTML = ''
    apiService.resetPage()
    
    apiService.fetchArticles().then(data => {
        console.log(data.hits)

        if (data.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            return;
        }
        apiService.totalShowed = data.hits.length;
        
        if (apiService.totalShowed === data.totalHits) {
            changeClassHiddenBtn()
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        }
         
        Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`)

        generateMarkupWithArticles(data.hits)
        changeClassHiddenBtn()
    })
    
    searchForm.reset()
}

function generateMarkupWithArticles(articles) {
      const markup = articles.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => 
            `<div class="photo-card"> 
                <a href="${largeImageURL}">
                 <img src="${webformatURL}" alt="${tags}" loading="lazy" class='img-card'/> 
                </a>
                <div class="info"> 
                  <p class="info-item"> 
                    <b>Likes: ${likes}</b> 
                  </p> 
                  <p class="info-item"> 
                    <b>Views: ${views}</b> 
                  </p> 
                  <p class="info-item"> 
                    <b>Comments: ${comments}</b> 
                  </p> 
                  <p class="info-item"> 
                    <b>Downloads: ${downloads}</b> 
                  </p> 
                </div> 
              </div> `).join('')

        galleryBox.insertAdjacentHTML('beforeend', markup)
        lightbox.refresh()
}

function onLoadMoreClick() {
    apiService.incrementPage()

    apiService.fetchArticles().then(data => {
        apiService.totalShowed = data.hits.length;

        if (apiService.totalShowed === data.totalHits) {
            changeClassHiddenBtn()
            Notiflix.Notify.info("We're sorry, but you've reached the end of search results.")
        }

        generateMarkupWithArticles(data.hits)
        scroll()
    })
}

function scroll() {
const galleryHeight = galleryBox.offsetHeight

 window.scrollBy({ 
   top: galleryHeight * 2, 
   behavior: 'smooth', 
 }); 
}

function changeClassHiddenBtn() {
    loadMoreBtn.classList.toggle('hidden')
}

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreClick)