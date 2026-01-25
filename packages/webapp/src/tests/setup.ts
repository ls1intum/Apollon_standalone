import '@testing-library/jest-dom/vitest';

const originalGetPropertyValue = window.CSSStyleDeclaration.prototype.getPropertyValue;

window.CSSStyleDeclaration.prototype.getPropertyValue = function getPropertyValue(property: string): string {
  const value = originalGetPropertyValue.call(this, property);
  if ((property === 'transition-duration' || property === 'transition-delay') && !value) {
    return '0s';
  }
  return value;
};
