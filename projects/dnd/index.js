/* Задание со звездочкой */

/*
 Создайте страницу с кнопкой.
 При нажатии на кнопку должен создаваться div со случайными размерами, цветом и позицией на экране
 Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
//import { doc } from 'prettier';
import './dnd.html';

const homeworkContainer = document.querySelector('#app');

document.addEventListener('mousemove', (e) => {});

export function createDiv() {
  if (document.getElementById('dragdiv')) {
    document.getElementById('dragdiv').remove();
  }
  const contHeight = homeworkContainer.clientHeight;
  const contWidth = homeworkContainer.clientWidth;
  const elHeight = Math.floor(contHeight * Math.random());
  const elWidth = Math.floor(contWidth * Math.random());
  const elColor = Math.floor(Math.random() * 16777215).toString(16);
  const elPosX = Math.floor((contWidth - elWidth) * Math.random());
  const elPosY = Math.floor((contHeight - elHeight) * Math.random());
  const newDiv = document.createElement('div');
  newDiv.style.height = elHeight + 'px';
  newDiv.style.width = elWidth + 'px';
  newDiv.style.backgroundColor = '#' + elColor;
  newDiv.style.left = elPosX + 'px';
  newDiv.style.top = elPosY + 'px';
  newDiv.classList.add('draggable-div');
  newDiv.setAttribute('draggable', true);
  newDiv.setAttribute('id', 'dragdiv');
  newDiv.addEventListener('dragstart', (e) => {
    e.dataTransfer.effectAllowed = 'move';
    const x = e.clientX - e.currentTarget.offsetLeft;
    const y = e.clientY - e.currentTarget.offsetTop;
    e.dataTransfer.setData('text/plain', [e.currentTarget.id, x, y]);
  });
  return newDiv;
}

const addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function () {
  const newDiv = createDiv();
  homeworkContainer.appendChild(newDiv);
});

homeworkContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
});
homeworkContainer.addEventListener('dragenter', (e) => {
  e.preventDefault();
});
homeworkContainer.addEventListener('drop', (e) => {
  const data = e.dataTransfer.getData('text/plain').split(',');
  const dragTarget = document.getElementById(data[0]);
  const offsetX = e.clientX - data[1];
  const offsetY = e.clientY - data[2];
  dragTarget.style.left = offsetX + 'px';
  dragTarget.style.top = offsetY + 'px';
});
