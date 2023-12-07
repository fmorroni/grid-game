class Player {
  static Dir = {
    up: -1,
    down: 1,
    left: -1,
    right: 1,
  };

  constructor(grid, color) {
    this.color = color;
    const trailInc = 90;
    const filledInc = 50;
    const rgb = getColorRGB(color);
    this.trailColor =
      'rgb(' +
      rgb.map((c) => (c < 255 - trailInc ? c + trailInc : 255)).join(',') +
      ')';
    this.filledColor =
      'rgb(' +
      rgb.map((c) => (c < 255 - filledInc ? c + filledInc : 255)).join(',') +
      ')';
    this.position = { x: 0, y: 0 };
    this.speed = { x: 0, y: 0 };
    this.moving = false;
    this.grid = grid;

    this.prevPos = Object.assign({}, this.position);
    this.trail = new GridSet(this.grid);
    this.trail.add(Object.assign({}, this.position));
    this.filled = new GridSet(this.grid);

    this.grid.canvas.addEventListener('keydown', (ev) => {
      if (
        (ev.code == 'KeyW' || ev.code == 'KeyS') &&
        (!this.movedXY.y || this.filled.has(this.position))
      ) {
        this.speed.x = 0;
        this.speed.y = ev.code == 'KeyW' ? Player.Dir.up : Player.Dir.down;
        this.moving = true;
        this.movedXY.y = false;
      } else if (
        (ev.code == 'KeyA' || ev.code == 'KeyD') &&
        (!this.movedXY.x || this.filled.has(this.position))
      ) {
        this.speed.y = 0;
        this.speed.x = ev.code == 'KeyA' ? Player.Dir.left : Player.Dir.right;
        this.moving = true;
        this.movedXY.x = false;
      }
    });

    // this.update = this.update.bind(this);
    this.transitionCount = 3;
    this.transitionPos = Object.assign({}, this.position);
    this.transitionOver = false;
    this.frameDelay = 60;
    this.prevMs = 0;
    this.moved = false;
    this.movedXY = { x: false, y: false };

    this.isDebugging = false;
    this.debugMs = 0;
    this.debugFunction = this.debugFunction.bind(this);
  }

  draw() {
    this.grid.fillCell(
      this.prevPos,
      this.filled.has(this.prevPos) ? this.filledColor : this.trailColor
    );
    this.grid.fillCell(this.position, this.color);
  }

  transition() {
    this.grid.fillCell(
      this.transitionPos,
      this.filled.has(this.prevPos) ? this.filledColor : this.trailColor
      // this.filled.has(this.prevPos) ? 'red' : 'blue'
    );
    this.transitionPos = {
      x:
        this.prevPos.x +
        (this.position.x - this.prevPos.x) / this.transitionCount,
      y:
        this.prevPos.y +
        (this.position.y - this.prevPos.y) / this.transitionCount,
    };
    this.grid.fillCell(this.transitionPos, this.color);
    if (this.transitionCount > 1) --this.transitionCount;
    else this.transitionOver = true;
  }

  borderCollisionDir(dir) {
    const d = this.position[dir] + this.speed[dir];
    return d < 0 || d >= this.grid[dir == 'x' ? 'cols' : 'rows'];
  }

  borderCollisionX() {
    return this.borderCollisionDir('x');
  }

  borderCollisionY() {
    return this.borderCollisionDir('y');
  }

  borderCollision() {
    return this.borderCollisionX() || this.borderCollisionY();
  }

  inBorder() {
    return (
      this.position.x == 0 ||
      this.position.y == 0 ||
      this.position.x == this.grid.cols - 1 ||
      this.position.y == this.grid.rows - 1
    );
  }

  move() {
    if (!this.moving) return;
    this.prevPos = Object.assign({}, this.position);
    if (this.speed.x != 0) {
      if (this.borderCollisionX()) {
        this.stopMoving();
      } else {
        this.position.x += this.speed.x;
        this.movedXY.x = true;
        this.movedXY.y = false;
      }
    } else if (this.speed.y != 0) {
      if (this.borderCollisionY()) {
        this.stopMoving();
      } else {
        this.position.y += this.speed.y;
        this.movedXY.x = false;
        this.movedXY.y = true;
      }
    }
    if (this.moving && this.trail.has(this.position)) {
      this.stopMoving();
      throw new Error('You lost');
    } else if (
      !this.trail.isEmpty() &&
      (!this.moving || this.filled.has(this.position))
    ) {
      // this.stopMoving();
      this.closeTrail();
    } else if (!this.filled.has(this.position)) {
      this.trail.add(Object.assign({}, this.position));
    }
  }

  stopMoving() {
    this.speed.x = 0;
    this.speed.y = 0;
    this.moving = false;
  }

  closeTrail() {
    this.filled.addAll(this.trail);
    this.trail.clear();
    this.filled.forEach((p) => this.grid.fillCell(p, this.filledColor));
    this.grid.fillCell(this.position, this.color);
  }

  closestLimit(pos) {
    this.trail.getRow(pos.y);
  }

  update(ms) {
    if (this.moving && !this.moved) {
      this.move();
      this.moved = true;
      this.transitionOver = false;
      // To force transition right after move.
      this.prevMs = ms;
    }
    const frameMs = ms - this.prevMs;
    if (frameMs > this.frameDelay) {
      this.grid.strokeCell(this.prevPos);
      this.prevMs = ms;
      this.transitionCount = parseInt(this.frameDelay / frameMs) || 3;
      this.draw();
      this.moved = false;
    } else if (this.moving && !this.transitionOver) {
      this.transition();
    }
    if (!this.isDebugging) {
      window.requestAnimationFrame((ms) => this.update(ms));
    }
  }

  debugFunction(ev) {
    if (ev.code == 'Space') {
      this.update(this.debugMs);
      this.debugMs += 17;
    }
  }

  debug() {
    this.isDebugging = true;
    setTimeout(() => {
      this.prevMs = 0;
    }, 100);
    document.body.addEventListener('keydown', this.debugFunction);
  }

  stopDebug() {
    this.isDebugging = false;
    document.body.removeEventListener('keydown', this.debugFunction);
    this.prevMs = 0;
    this.update(0);
  }

  start() {
    this.draw();
    this.grid.canvas.focus();
    this.update(0);
  }
}
