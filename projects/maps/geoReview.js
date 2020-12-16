import InteractiveMap from './interactiveMap';

export default class GeoReview {
  constructor() {
    this.myMap = new InteractiveMap('map', this.onClick.bind(this), this.addReview);
    this.myMap.init().then(this.onInit.bind(this));
  }

  async onInit() {
    const markers = [
      {
        coords: [55.751999, 37.576133],
        name: 'Александр Плотников',
        place: 'Кофе-хауз',
        text: 'Пирожки со скидкой!',
        date: '30.12.2018',
      },
      {
        coords: [55.760435, 37.622435],
        name: 'Таня Смирнова',
        place: 'Последний книжный',
        text: 'Было пусто((',
        date: '1.1.3030',
      },
      {
        coords: [55.748836, 37.599119],
        name: 'yarnaholic',
        place: 'Пряжный рай',
        text: 'Столько пряжи!!!',
        date: '7.8.2020',
      },
    ];
    if (localStorage.length === 0) {
      //just to populate storage from the start
      for (let i = 0; i < markers.length; i++) {
        const obj = {
          coords: markers[i].coords,
          name: markers[i].name,
          place: markers[i].place,
          text: markers[i].text,
          date: markers[i].date,
        };
        localStorage.setItem(Date.now(), JSON.stringify(obj));
        this.myMap.createPlacemark(obj);
      }
    } else {
      for (let i = 0; i < localStorage.length; i++) {
        const obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        this.myMap.createPlacemark(obj);
      }
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
    for (let i = 0; i < localStorage.length; i++) {
      const obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
      if (coords[0] === obj.coords[0] && coords[1] === obj.coords[1]) {
        const reviewInfo = document.createElement('div');
        reviewInfo.classList.add('review__info');
        reviewInfo.innerHTML = `<span id= class="review__name">${obj.name}</span><span class="review__place">${obj.place} ${obj.date}</span> <div class="review__text"><p>${obj.text}</p></div>`;
        reviewList.appendChild(reviewInfo);
      }
    }
    return reviewList;
  }

  addReview(coords) {
    const name = document.querySelector('[name="name"]').value;
    const place = document.querySelector('[name="place"]').value;
    const text = document.querySelector('[name="review"]').value;
    const date = new Date().toJSON().slice(0, 10).split('-').reverse().join('.');
    const obj = {
      coords: coords,
      name: name,
      place: place,
      text: text,
      date: date,
    };
    localStorage.setItem(Date.now(), JSON.stringify(obj));
    this.myMap.createPlacemark(obj);
    this.myMap.closeBalloon();
  }
}
