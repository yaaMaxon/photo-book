const API_KEY = '39017406-8a2bd96a6988b9cda18c74697';

export default class ApiService {
    constructor() {
        this._searchQuery = '';
        this.page = 1;
        this._totalShowed = 0;
    }
    
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
    
   get totalShowed() {
    return this._totalShowed;
   }

    set totalShowed(value) {
        this._totalShowed += value;
    }

    get searchQuery() {
        return this._searchQuery;
    }


    set searchQuery(value) {
        this._searchQuery = value;
    }

   async fetchArticles() {
    return await fetch(`https://pixabay.com/api/?key=${API_KEY}&q=${this._searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=18`)
    .then(response => {
        console.log(response)
        if (!response.ok) {
            throw new Error(`Photo not found: ${response.status}`)
        }

        return response.json();
    })
    .catch(error => {
        console.error('Error fetching photos:', error)
    })
}
} 

