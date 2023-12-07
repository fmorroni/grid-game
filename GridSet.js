class GridSet {
  constructor(grid) {
    this.cols = grid.cols;
    this.rows = grid.rows;
    this.set = Array(this.rows)
      .fill(0)
      .map(() => Array(this.cols));
    this.size = 0;
  }

  add(pos) {
    if (!this.set[pos.y][pos.x]) {
      ++this.size;
      this.set[pos.y][pos.x] = pos;
    }
  }

  addAll(gridSet) {
    gridSet.set.forEach((row) => row.forEach(p => this.add(p)));
  }

  has(pos) {
    return Boolean(this.set[pos.y][pos.x]);
  }

  remove(pos) {
    if (this.size > 0) {
      --this.size;
      delete this.set[pos.y][pos.x];
    }
  }

  clear() {
    this.size = 0;
    this.set = Array(this.rows)
      .fill(0)
      .map(() => Array(this.cols));
  }

  isEmpty() {
    return this.size == 0;
  }

  getRow(idx) {
    const row = [];
    this.set[idx].forEach(p => row.push(p))
    return row.length ? row : null
  }

  getCol(idx) {
    const col = [];
    for (let i = 0; i < this.rows; ++i) {
      if (this.set[i][idx]) col.push(this.set[i][idx])
    }
    return col.length ? col : null
  }

  forEach(callback) {
    for (const row of this.set) {
      row.forEach(callback)
    }
  }
}
