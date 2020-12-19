import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    this.myMap = new InteractiveMap('map', this.onClick.bind(this), this.addReview);
    this.myMap.init().then(this.onInit.bind(this));
    this.store = JSON.parse(localStorage.getItem('reviews')) || {};
  }

  async onInit() {
    if (this.store !== {}) {
      Object.keys(this.store).forEach((key) => {
        this.store[key].forEach(() => {
          const [lat, lng] = key.split(',');
          this.myMap.createPlacemark([Number(lat), Number(lng)]);
        });
      });
    } else {
      localStorage.setItem('reviews', '');
    }
  }

  onClick(coords, name) {
    this.myMap.openBalloon(coords).then(() => {
      document
        .querySelector('.close-icon')
        .addEventListener('click', () => this.myMap.closeBalloon());
      const reviewForm = document.getElementById('review-form');
      reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.addReview(coords);
      });
    });
    if (name && name !== 'map') {
      const reviewList = this.getReviews(coords);
      this.myMap.openBalloon(coords).then(() => {
        document.querySelector('.balloon__reviews').prepend(reviewList);
      });
    }
  }

  getReviews(coords) {
    const reviewList = document.createElement('div');
    reviewList.classList.add('review-list');
    this.store[coords].forEach((obj) => {
      const reviewInfo = document.createElement('div');
      reviewInfo.classList.add('review__info');
      reviewInfo.innerHTML = `<span id= class="review__name">${obj.name}</span><span class="review__place">${obj.place} ${obj.date}</span> <div class="review__text"><p>${obj.text}</p></div>`;
      reviewList.appendChild(reviewInfo);
    });
    return reviewList;
  }

  addReview(coords) {
    const name = document.querySelector('[name="name"]').value;
    const place = document.querySelector('[name="place"]').value;
    const text = document.querySelector('[name="review"]').value;
    const date = new Date().toJSON().slice(0, 10).split('-').reverse().join('.');
    const obj = {
      name: name,
      place: place,
      text: text,
      date: date,
    };

    Array.isArray(this.store[coords])
      ? this.store[coords].push(obj)
      : (this.store[coords] = [obj]);
    localStorage.setItem('reviews', JSON.stringify(this.store));
    this.myMap.createPlacemark(coords);
    this.myMap.closeBalloon();
  }
}
