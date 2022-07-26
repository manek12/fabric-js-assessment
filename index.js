var canvas = new fabric.Canvas('canvas',{selection:false});

let viewports = [];
let uploadedImage = null;
let dragable = {
  dragableLeft: false,
  dragableTop: false,
  dragableRight: false,
  dragableBottom: false,
};

document.getElementById("uploader").onchange = function(e) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var image = new Image();
    image.src = e.target.result;
    image.onload = function() {
      var img = new fabric.Image(image);
      uploadedImage=img;
      img.scaleToWidth(800);
      img.scaleToHeight(600);
      img.selectable=false;
      canvas.clear().renderAll();
      canvas.add(img);
      canvas.centerObject(img);
      
    }
  }
  reader.readAsDataURL(e.target.files[0]);
}

canvas.on("mouse:wheel", function (options) {
  let delta = options.e.deltaY;
  let presentZoom = canvas.getZoom();
  let newZoom = presentZoom * Math.pow(0.9995, delta);
  let vpt = this.viewportTransform;

  setImageDragableProperty();
  if (newZoom >= presentZoom) {
    newZoom = newZoom < 0.1 ? 0.1 : newZoom;
    viewports.push(vpt);
    canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, newZoom);
  } else {
    newZoom = newZoom > 20 ? 20 : newZoom;
    if (viewports.length > 0) {
      let previousViewport = viewports[viewports.length - 1];
      viewports.pop();
      canvas.setViewportTransform(previousViewport);
    }
  }
});

canvas.on("mouse:down", function (opt) {
  var evt = opt.e;
  if (evt.altKey === true) {
    this.isDragging = true;
    this.selection = false;
    this.lastPosX = evt.clientX;
    this.lastPosY = evt.clientY;
  }
});
canvas.on("mouse:move", function (options) {
  if (this.isDragging && viewports.length > 0) {
    var e = options.e;
    var vpt = this.viewportTransform;
    console.log(vpt);
    if (dragable.dragableLeft || dragable.dragableRight)
      vpt[4] += e.clientX - this.lastPosX;
    if (dragable.dragableTop || dragable.dragableRight)
      vpt[5] += e.clientY - this.lastPosY;

    this.requestRenderAll();
    this.lastPosX = e.clientX;
    this.lastPosY = e.clientY;
  }
});
canvas.on("mouse:up", function () {
  this.setViewportTransform(this.viewportTransform);
  this.isDragging = false;
  this.selection = true;
});


function chooseFile(){
    document.getElementById('uploader').click();
}      



//smoothing

const getCanvasCenterCornerCoordinates = function (points) {
  var invertedMatrix = fabric.util.invertTransform(canvas.viewportTransform);
  var transformedP = fabric.util.transformPoint(points, invertedMatrix);
  return transformedP;
};
const setDragable = function (
  canvasBottomCornerCoordinates,
  canvasTopCornerCoordinates,
  canvasRightCornerCoordinates,
  canvasLeftCornerCoordinates
) {
  dragable.dragableBottom =
    canvasBottomCornerCoordinates.y <
    (canvasBottomCornerCoordinates.y - canvasTopCornerCoordinates.y) / 2 +
      uploadedImage.height / 2
      ? true
      : false;

  dragable.dragableTop =
    canvasTopCornerCoordinates.y >
    (canvasBottomCornerCoordinates.y - canvasTopCornerCoordinates.y) / 2 -
      uploadedImage.height / 2
      ? true
      : false;

  dragable.dragableRight =
    canvasRightCornerCoordinates.x <
    (canvasRightCornerCoordinates.x - canvasLeftCornerCoordinates.x) / 2 +
      uploadedImage.width / 2
      ? true
      : false;
  dragable.dragableLeft =
    canvasLeftCornerCoordinates.x >
    (canvasRightCornerCoordinates.x - canvasLeftCornerCoordinates.x) / 2 -
      uploadedImage.width / 2
      ? true
      : false;
};
const setImageDragableProperty = function () {
  let canvasBottomCornerCoordinates = getCanvasCenterCornerCoordinates({
    x: canvas.width / 2,
    y: canvas.height,
  });
  let canvasTopCornerCoordinates = getCanvasCenterCornerCoordinates({
    x: canvas.width / 2,
    y: 0,
  });
  let canvasRightCornerCoordinates = getCanvasCenterCornerCoordinates({
    x: canvas.width,
    y: canvas.height / 2,
  });
  let canvasLeftCornerCoordinates = getCanvasCenterCornerCoordinates({
    x: 0,
    y: canvas.height / 2,
  });
  setDragable(
    canvasBottomCornerCoordinates,
    canvasTopCornerCoordinates,
    canvasRightCornerCoordinates,
    canvasLeftCornerCoordinates
  );
};