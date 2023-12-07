class Canvas {
  constructor(width, height, bgColor = 'hsl(0deg 0% 15%)') {
    this.width = width;
    this.height = height;
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.tabIndex = 1;
    this.canvas.style.padding = '3px';
    this.ctx = this.canvas.getContext('2d');
    this.bgColor = bgColor;
    this.clear();
  }

  clear() {
    const fillStyle = this.ctx.fillStyle;
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = fillStyle;
  }

  appendTo(element) {
    element.appendChild(this.canvas);
  }
}
