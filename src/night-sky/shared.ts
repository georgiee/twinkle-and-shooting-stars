export function createSVGElement(tag){
  return document.createElementNS("http://www.w3.org/2000/svg", tag) as SVGElement;
}