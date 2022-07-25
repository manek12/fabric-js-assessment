var canvas = new fabric.Canvas('canvas');

document.getElementById("uploader").onchange = function(e) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var image = new Image();
    image.src = e.target.result;
    image.onload = function() {
      var img = new fabric.Image(image);
      img.set({
        
      });
      img.scaleToWidth(800);
      img.scaleToHeight(600);
      canvas.clear();
      canvas.add(img).setActiveObject(img).renderAll();
      canvas.centerObject(img);
      console.log(canvas);
      
    }
  }
  reader.readAsDataURL(e.target.files[0]);
}

canvas.on('mouse:wheel', function(opt) {
    var delta = opt.e.deltaY;
    var zoom = canvas.getZoom();
    console.log(canvas.viewportTransform);
    zoom *= 0.999 ** delta;
    if (zoom > 30) zoom = 30;
    if (zoom < 1){
        zoom = 1;
        canvas.setViewportTransform([1,0,0,1,0,0]);
    }
    canvas.zoomToPoint(new fabric.Point(opt.e.offsetX,opt.e.offsetY),zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
})


function chooseFile(){
    document.getElementById('uploader').click();
}      