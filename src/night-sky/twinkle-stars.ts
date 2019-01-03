import { Coordinate } from './data';
import { kelvinToRGB, debounce, getScrollTop } from './util';

require('./twinkle-stars.css');


export function twinkleStars(element: HTMLElement,  coordinates: Coordinate[]) {
  // create the overall container
  const allStarsGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  allStarsGroup.classList.add('twinkling-stars');
  element.appendChild(allStarsGroup);

  // add the stars
  coordinates.forEach((coordinate, index) => {
    addStar({
      coordinate,
      element: allStarsGroup,
      index
    })
  });
  loopParallaxRatioUpdate((ratio) => {
    allStarsGroup.style.setProperty('--star-parallax-translate', `${ratio}`);
  });
}

function addStar({
    coordinate,
    element,
    index
  }) {

  const radius = 2;
  const delay = index * 100 + 500 * Math.random();
  const brightness = 1;
  const duration = 3000 + Math.random() * 4000;
  const colorRGB = kelvinToRGB(3500 + 5000 * Math.random());
  const color = `rgb(${colorRGB[0]},${colorRGB[1]},${colorRGB[2]})`;

  const parallaxDepth = 1 + index%5; //create 5 parallax layer
  const parallaxIntensity = 200; // maximum translation basically.


  const star = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  star.classList.add('star');

  const translateGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  translateGroup.setAttribute('transform', `translate(${coordinate.x} ${coordinate.y})`);
  translateGroup.classList.add('star__translate');

  const parallaxGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  parallaxGroup.classList.add('star__parallax');
  parallaxGroup.style.setProperty('--star-parallax-depth', `${parallaxDepth}`);
  parallaxGroup.style.setProperty('--star-parallax-intensity', `${parallaxIntensity}`);

  const shape = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
  shape.setAttribute('r', radius.toString());
  shape.classList.add('star__shape');

  shape.style.setProperty('--star-animation-delay', `${-delay}ms`);
  star.style.setProperty('--star-glowing-brightness', `${brightness}`);
  star.style.setProperty('--star-glowing-duration', `${duration}ms`);
  star.style.setProperty('--star-pulse-duration', `${duration}ms`);
  star.style.setProperty('--star-color', `${color}`);

  star.appendChild(parallaxGroup)
  parallaxGroup.appendChild(translateGroup);
  translateGroup.appendChild(shape);

  element.appendChild(star);
}

function generateHslaColors (saturation, lightness, alpha, amount) {
  let colors = []
  let huedelta = Math.trunc(360 / amount)

  for (let i = 0; i < amount; i++) {
    let hue = i * huedelta
    colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
  }

  return colors
}

function loopParallaxRatioUpdate(cb) {
  const loop = function(previousScrollTop = null) {
    const repeat = () => {
    }

    const scrollTop = getScrollTop();

    if (previousScrollTop !== scrollTop) {
      previousScrollTop = scrollTop;
      const ratio = scrollTop/document.documentElement.clientHeight;
      cb(ratio);
    }

    requestAnimationFrame(loop);
  }

  loop();
}