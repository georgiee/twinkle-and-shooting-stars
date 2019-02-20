require('./main.css');



function createStarConstellations(svg) {
  const points = [
    {x: 10, y: 40},
    {x: 40, y: 10},
    {x: 60, y: 30},
    {x: 50, y: 60},
    {x: 44, y: 64},
    {x: 40, y: 68}
  ];

  const path = createSVGElement('path');
  const startPoint = points[0];
  const pointsArray = points.slice(1).map(({x, y}) => `L ${x} ${y}`);
  const pathParts = [
    `M ${startPoint.x} ${startPoint.y}`,
    ...pointsArray,
    'z'
  ]
  const group = createSVGElement('g');
  group.setAttribute('stroke', 'red');
  group.setAttribute('stroke-width', '2');
  path.setAttribute('d', pathParts.join(' '));
  group.appendChild(path);

  svg.appendChild(group);
  // const pathValue = path.setAttribute('d', pathValue);
  // <circle cx="40" cy="10" r="2" fill="red"/>
  // <circle cx="10" cy="40" r="2" fill="red"/>
  // <circle cx="60" cy="30" r="2" fill="red"/>
  // <circle cx="50" cy="60" r="2" fill="red"/>
  // <circle cx="44" cy="64" r="2" fill="red"/>
  // <circle cx="40" cy="68" r="2" fill="red"/>
  // <circle cx="45" cy="90" r="2" fill="red"/>
  // <circle cx="90" cy="70" r="2" fill="red"/>
}

export function run(svg) {
  console.log('run', svg);
  const sizeShootingStar = 1;
  const sizeSkyStar = 1;

  // createSky({ count: 350 })
  // createMeteorShower();
  createStarConstellations(svg);

  // loopScrollRatioUpdate(ratio => {
  //   svg.style.setProperty('--star-parallax-ratio', `${ratio}`);
  // });

/**
  Meteor Shower
*/
function createMeteorShower() {
  const SHOOT_DELAY = 2000;
  const allShootingStars = [];

  let shootingStar

  shootingStar = createShootingStar({ x: 100, y: 100, radius: 100, angle: 45, debug: true});
  svg.appendChild(shootingStar);
  allShootingStars.push(shootingStar);

  shootingStar = createShootingStar({ x: 350, y: 100, radius: 50, angleStart: 270, angle: 90, debug: true});
  svg.appendChild(shootingStar);
  allShootingStars.push(shootingStar);

  shootingStar = createShootingStar({ x: 550, y: 750, radius: 600, angleStart: -90, angle: -150, debug: true});
  svg.appendChild(shootingStar);
  allShootingStars.push(shootingStar);

  loopRandomShooting(allShootingStars, (star, previousStar) => {
    star.classList.add('is-shooting');

    if(previousStar) {
      previousStar.classList.remove('is-shooting');
    }
  }, SHOOT_DELAY, SHOOT_DELAY);
}

function createShootingStar({x, y, radius, angle, angleStart = 0, debug = false}) {
  const shootingStarShape = createSVGElement('circle');
  shootingStarShape.classList.add('shooting-star__shape');

  const shootingStar = createSVGElement('g');
  shootingStar.classList.add('shooting-star');
  shootingStar.setAttribute('transform', `translate(${x} ${y})`);

  shootingStarShape.style.setProperty('--shooting-orbit-radius', radius + 'px');
  shootingStarShape.style.setProperty('--shooting-orbit-angle', angle + 'deg');
  shootingStarShape.style.setProperty('--shooting-orbit-angle-start', angleStart + 'deg');
  shootingStarShape.setAttribute('r', sizeShootingStar + '');
  shootingStarShape.setAttribute('fill', 'white');

  if(debug) {
    debugShootingStar(shootingStar, radius, angleStart, angle);
  }

  shootingStar.appendChild(shootingStarShape);
  return shootingStar;
}

function debugShootingStar(star, radius, angleStart, angle) {
  const debugOrbit = createSVGElement('circle');
  debugOrbit.setAttribute('r', radius.toString());
  debugOrbit.setAttribute('fill', `yellow`);
  debugOrbit.style.opacity = (0.3).toString();

  const markCenter = createSVGElement('circle');
  markCenter.setAttribute('r', 5 + '');
  markCenter.setAttribute('fill', 'yellow');
    // create arc to visualize the travelling path

  const arc = createSVGElement('path');
  arc.setAttribute('fill', 'none');
  arc.setAttribute('stroke', 'red');
  arc.setAttribute('stroke-width', 'yellow');
  arc.classList.add('debug__arc');

  arc.setAttribute("d", describeArc(0, 0, radius, angleStart, angle));

  const starDebug = createSVGElement('g');
  starDebug.classList.add('shooting-star__debug');

  starDebug.appendChild(markCenter);
  starDebug.appendChild(debugOrbit);
  starDebug.appendChild(arc);

  star.appendChild(starDebug);
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

// Works for +360 and a total delta of -180
// via https://stackoverflow.com/questions/52056486/draw-reversed-circle-arc-changes-circle-center-coordinates
function describeArc(x, y, radius, startAngle, endAngle){
    startAngle+=90;
    endAngle+=90;

    var start = polarToCartesian(x, y, radius, endAngle );
    var end = polarToCartesian(x, y, radius, startAngle);

    var sweepFlag = endAngle > startAngle ? 0 : 1;
    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    if(endAngle - startAngle < -180) {
      largeArcFlag = "1"
    }

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y
    ].join(" ");

    return d;
}

function loopRandomShooting(shootingStars, cb, timeout = 5000, maxTimeout = 5000) {
  let previousStar = null;

  const getNextStar = randomEntryGenerator(shootingStars);
  const shootDuration = 5000;
  let delayBetweenShoots = timeout;

  if(maxTimeout > timeout) {
    const dTime = maxTimeout - timeout;
    delayBetweenShoots = timeout + Math.random() * dTime;
  }

  function shootNext() {
    const star = getNextStar();
    cb(star, previousStar);
    previousStar = star;

    setTimeout(shootNext, delayBetweenShoots);
  }

  shootNext();
}

function randomEntryGenerator(list){
  let stars = [...list];
  let lastStar = null;

  return function nextStar(){
    const index = Math.round(Math.random() * (stars.length - 1));
    const star =  stars[index];

    if(star === lastStar) {
      // another try
      return nextStar();
    }

    lastStar = star;

    return star;
  }
}



/**
Night Sky
*/
function createSky({count}) {
  for(let i = 0; i < count; i++) {
    const coordinates = getRandomCoordinate() /*{x,y}*/;
    const color = getRandomColor();
    const star = createStar({ color, size: sizeSkyStar, ...coordinates, index: i  });
    svg.appendChild(star);
  }
}

function createStar({size, color, x, y, index}) {
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

/** PARALLAX*/

function loopScrollRatioUpdate(cb) {
  let previousScrollTop = -1;
  const RELATIVE_TO_VIEWPORT = false;

  const loop = function() {
    const scrollTop = getScrollTop();

    if (previousScrollTop !== scrollTop) {
      previousScrollTop = scrollTop;

      let ratio = 0;
      const viewportHeight = document.documentElement.clientHeight;

      // this ratio will exceed [0..1] as we measure relative to the viewport without looking for the actual content height
      // this will yield a dense star field at the top and a lower one the further you scroll down
      if(RELATIVE_TO_VIEWPORT) {
        ratio = scrollTop/viewportHeight;

        // alternative: use a calcualte max value to center the dense field
        // const max = (document.body.clientHeight - viewportHeight)/viewportHeight;
        // center round the center (most dense in the center)
        // ratio = scrollTop/viewportHeight - max/2;
      }else {
        // ratio will be in the range of [0..1] as we measure relative to the total height
        ratio = scrollTop/(document.body.clientHeight - viewportHeight);
      }

      cb(ratio);
    }

    requestAnimationFrame(loop);
  }

  loop();
}


function getScrollTop() {
  return (document.scrollingElement || document.documentElement).scrollTop
}

/**
DEBUG
*/
const shootingStar = document.querySelector('.shooting-star');

function toggle() {
  svg.classList.toggle('debug');
}

// svg.classList.toggle('debug');

}

function createSVGElement(tag){
  return document.createElementNS("http://www.w3.org/2000/svg", tag)
}
