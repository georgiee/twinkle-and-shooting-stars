import { generateStarCoordinates, Coordinate } from './data';
import { twinkleStars } from './twinkle-stars';

require('./night-sky.css');

const STARS = generateStarCoordinates();


export const create = (svgElement) => {
  console.log('Create Night Sky 🌌');
  twinkleStars(svgElement, STARS);
}