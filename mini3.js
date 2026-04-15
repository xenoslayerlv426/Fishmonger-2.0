// Create draggable object
 function createDraggableShape(x, y) {
  return {
    x: x,
    y: y,
    size: dragRadius * 7,
    isBeingDragged: false,
    offsetX: 0,
    offsetY: 0,
    active: true,
    img: fish,
    };
  }

  // Drag logic
  function handleDragging(shape) {
    if (!shape.active) return;

    if (shape.isBeingDragged) {
      shape.x = mouseX + shape.offsetX;
      shape.y = mouseY + shape.offsetY;

      // constrain inside canvas
      shape.x = constrain(shape.x, 0, width);
      shape.y = constrain(shape.y, 0, height);
    }
  }

 // Draw shapes
  function drawShape(shape) {
    if (!shape.active) return;

    push();
    imageMode(CENTER);
    image(shape.img, shape.x, shape.y, shape.size, shape.size);
    pop();
  }

  // Hit detection (from your point system idea)
  function mouseIsInside(shape) {
    return dist(mouseX, mouseY, shape.x, shape.y) < shape.size / 2.5;
  }

// Mouse drag
  function mouseDragged() {
    // handled in draw()
  }

function mouseReleased() {
  for (let shape of shapes) {
    if (!shape.active);

    if (shape.isBeingDragged) {

      // delete if dropped on right side
      if (shape.x > width / 2) {
        console.log("fish packed");
        insideCount++;
        shape.active = false;
      }

      shape.isBeingDragged = false;
      shape.offsetX = 0;
      shape.offsetY = 0;
    }
  }

  //CHECK IF PACK IS DONE
  if (cookMode == "Pack" && isPackComplete()) {
    restartCycle();
  }
}
  // Divider line
  function drawBoundary() {
    stroke(0);
    line(width / 0, 0, width / 0, height);
  }

function isPackComplete() {
  for (let shape of shapes) {
    if (shape.active) {
      return false;
    }
  }
  return true;
}

function restartCycle() {
  cookMode = "Mallet";
  tapCount = 0;
  miniGameLoaded = false;

  resetShapes();
}
function resetShapes() {
  shapes = [];

  shapes.push(createDraggableShape(width / 4, height / 3, "#ff0000"));
  shapes.push(createDraggableShape(width / 4, (2 * height) / 3, "#00ff00"));
  shapes.push(createDraggableShape(random(width / 2), random(height), "#0000ff"));
  shapes.push(createDraggableShape(random(width / 2), random(height), "#FFE304"));
  shapes.push(createDraggableShape(random(width / 2), random(height), "#D000FF"));
  // reset active state happens automatically here
}