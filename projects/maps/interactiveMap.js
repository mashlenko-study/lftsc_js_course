/* global ymaps */

export default class InteractiveMap {
  constructor(mapId, onClick, addReview) {
    this.mapId = mapId;
    this.onClick = onClick;
    this.addReview = addReview;
    this.layout = document.getElementById('layout').innerHTML;
  }

  async init() {
    await this.injectYMapsScript();
    await this.loadYMaps();
    this.initMap();
  }

  injectYMapsScript() {
    return new Promise((resolve) => {
      const ymapsScript = document.createElement('script');
      ymapsScript.src =
        'https://api-maps.yandex.ru/2.1/?apikey=e1f81e93-0b68-415d-a2a0-acaa12dc43d1&lang=ru_RU';
      document.body.appendChild(ymapsScript);
      ymapsScript.addEventListener('load', resolve);
    });
  }

  loadYMaps() {
    return new Promise((resolve) => ymaps.ready(resolve));
  }

  initMap() {
    this.clusterer = new ymaps.Clusterer({
      clusterDisableClickZoom: true,
      clusterBalloonCloseButton: false,
      groupByCoordinates: true,
      clusterBalloonContentLayout: this.layout,
    });

    this.clusterer.events.add('click', (e) => {
      const name = e.get('target').options._name;
      const c = e.get('target').geometry.getCoordinates();
      const coords = [
        Math.round(c[0] * 1000000) / 1000000,
        Math.round(c[1] * 1000000) / 1000000,
      ];
      this.onClick(coords, name);
    });

    this.myMap = new ymaps.Map('map', {
      center: [55.748836, 37.599119],
      zoom: 13,
      controls: ['zoomControl'],
    });

    this.myMap.behaviors.disable(['scrollZoom']);
    this.myMap.events.add('click', (e) => {
      e.preventDefault();
      const name = e.get('target').options._name;
      const c = e.get('coords');
      const coords = [
        Math.round(c[0] * 1000000) / 1000000,
        Math.round(c[1] * 1000000) / 1000000,
      ];
      this.onClick(coords, name);
    });
    this.myMap.geoObjects.add(this.clusterer);
  }

  async loadAddress(coords) {
    const res = await ymaps
      .geocode(coords)
      .then((res) => res.geoObjects.get(0))
      .then((data) => data.getAddressLine());
    document.getElementById('address').textContent = res;
  }

  closeBalloon() {
    this.myMap.balloon.close();
  }

  createPlacemark(obj) {
    const content = obj;

    const placemark = new ymaps.Placemark(
      obj.coords,
      {
        hintContent: 'Это хинт',
        balloonContent: content,
      },
      {
        balloonMinHeight: 500,
        balloonCloseButton: false,
        balloonContentLayout: this.layout,
        iconLayout: 'default#image',
        iconImageHref: './img/marker.png',
        iconImageSize: [44, 66],
        iconImageOffset: [-35, -52],
      }
    );
    placemark.events.add('click', (e) => {
      const c = e.get('target').geometry.getCoordinates();
      const coords = [
        Math.round(c[0] * 1000000) / 1000000,
        Math.round(c[1] * 1000000) / 1000000,
      ];
      this.onClick(coords);
    });
    this.clusterer.add(placemark);
  }

  async openBalloon(coords) {
    await this.myMap.balloon
      .open(coords, this.layout, {
        closeButton: false,
        mapAutoPan: true,
        maxWidth: 600,
        minHeight: 480,
      })
      .then(this.loadAddress(coords));
  }
}
