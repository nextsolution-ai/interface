export function injectCSS(css) {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
} 