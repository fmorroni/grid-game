function getColorRGB(colorString) {
  const tempDiv = document.createElement('div');
  tempDiv.style.color = colorString;
  document.body.appendChild(tempDiv);
  const computedStyle = window.getComputedStyle(tempDiv);
  const rgbValues = computedStyle.color
    .match(/\d+/g)
    .map((value) => parseInt(value));

  document.body.removeChild(tempDiv);

  return rgbValues;
}
