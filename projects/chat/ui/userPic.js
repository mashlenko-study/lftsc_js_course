export default class UserPic {
  constructor(el, onUpload) {
    this.el = el;
    this.onUpload = onUpload;

    this.el.addEventListener('dragenter', (e) => {
      e.preventDefault();
      console.log(e);
    });

    this.el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.effectAllowed = 'move';
      if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
        e.preventDefault();
      }
    });

    this.el.addEventListener('drop', (e) => {
      console.log(e);
      const file = e.dataTransfer.items[0].getAsFile();
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener('load', () => this.onUpload(reader.result));
      e.preventDefault();
    });
  }

  set(photo) {
    this.el.style.backgroundImage = `url(${photo})`;
  }
}
