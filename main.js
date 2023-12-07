const g = new Grid(20, 30, 25, 2);
g.appendTo(document.querySelector('.container'));
g.draw();
const p1 = new Player(g, 'orange');
// p1.debug();
p1.start();
