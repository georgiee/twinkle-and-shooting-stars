import { createSVGElement } from './shared';
require('./twinkling-sky.css');

const sizeSkyStar = 1;

export function run(svgElement) {
  console.log('run twinking sky');
  const sky = createSky({count: 200});
  svgElement.appendChild(sky);
}

function createSky({count}) {
  const group = createSVGElement('g');

  for(let i = 0; i < count; i++) {
    const coordinates = getRandomCoordinate() /*{x,y}*/;
    const color = getRandomColor();
    const star = createStar({ color, size: sizeSkyStar, ...coordinates, index: i  });
    group.appendChild(star);
  }

  return group;
}

export function createStar({size, color, x, y, index}) {
  const delay = Math.round(-1 * Math.random() * 4000);

  const starShape = createSVGElement('circle');
  starShape.setAttribute('r', size + '');
  starShape.setAttribute('fill', color);

  starShape.classList.add('twinkle-little-star');
  starShape.style.setProperty('--animation-twinkle-delay', delay + 'ms');

  const star = createSVGElement('g');
  star.setAttribute('transform', `translate(${x} ${y})`);


  const parallaxGroup = createSVGElement('g');
  parallaxGroup.appendChild(starShape)
  star.appendChild(parallaxGroup);
  parallaxGroup.classList.add('parallax-effect');
  parallaxGroup.style.setProperty('--star-parallax-depth', (index%5 + 1) + '');

  return star;
}

function getRandomCoordinate() {
  return getRandomPosition({
    width: 960,
    height: 700,
    padding: 10,
    offsetX: 0,
    offsetY: 0
  });
}

function getRandomPosition({width, height, offsetX = 0, offsetY = 0, padding = 0}){
  const startX = offsetX + padding;
  const startY = offsetY + padding;
  const maxWidth = width - padding *2;
  const maxHeight = height - padding *2;

  return {
     x: startX + maxWidth * Math.random(),
     y: startY + maxHeight * Math.random()
  }
}


function getRandomColor() {
  const availableColors = ['#B5CDFF', '#FFE4CE', '#FF6C00'];

  const index = Math.round(Math.random() * (availableColors.length -1));
  return availableColors[index];
}