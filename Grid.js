class Grid extends Canvas {
  constructor(
    cols,
    rows,
    cellSize,
    strokeWidth,
    bgColor = 'hsl(0deg 0% 15%)',
    strokeColor = 'hsl(0deg 0% 30%)'
  ) {
    super(
      cols * cellSize + strokeWidth * (cols + 1),
      rows * cellSize + strokeWidth * (rows + 1),
      bgColor
    );
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.strokeWidth = strokeWidth;
    this.strokeColor = strokeColor;
  }

  draw() {
    this.clear();
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;

    this.ctx.strokeRect(
      this.strokeWidth / 2,
      this.strokeWidth / 2,
      this.width - this.strokeWidth,
      this.height - this.strokeWidth
    );

    this.ctx.beginPath;
    for (let col = 1; col < this.cols; ++col) {
      const x = col * this.cellSize + (col + 1 / 2) * this.strokeWidth;
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
    }
    for (let row = 1; row < this.rows; ++row) {
      const y = row * this.cellSize + (row + 1 / 2) * this.strokeWidth;
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
    }
    this.ctx.stroke();

    this.ctx.restore();
  }

  colRowToXY(col, row) {
    return {
      x: col * this.cellSize + (col + 1) * this.strokeWidth,
      y: row * this.cellSize + (row + 1) * this.strokeWidth,
    };
  }

  fillCell(position, color) {
    this.ctx.save();
    this.ctx.fillStyle = color;

    const { x, y } = this.colRowToXY(position.x, position.y);
    this.ctx.fillRect(x, y, this.cellSize, this.cellSize);

    this.ctx.restore();
  }

  clearCell(position) {
    this.fillCell(position, this.bgColor);
  }

  strokeCell(position) {
    this.ctx.save();
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;

    const { x, y } = this.colRowToXY(position.x, position.y);
    this.ctx.strokeRect(
      x - this.strokeWidth / 2,
      y - this.strokeWidth / 2,
      this.cellSize + this.strokeWidth,
      this.cellSize + this.strokeWidth
    );

    this.ctx.restore();
  }
}
