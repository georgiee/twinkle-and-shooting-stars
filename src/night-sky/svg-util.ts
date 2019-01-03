export function createGroup({className = null, attributes = null}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  if(className) {
    element.classList.add('star');
  }

  if(attributes) {
    element.classList.add('star');
  }
  return element;
}