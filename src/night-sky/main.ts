import { run as shootingStars } from './shooting-stars';
import { run as twinklingSky } from './twinkling-sky';
import { run as starConstellations } from './star-constellations';

require('./main.css');

export function create(svg) {
  twinklingSky(svg);
  shootingStars(svg);
  starConstellations(svg);
}