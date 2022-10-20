window.addEventListener('load', ()=>{
    document.addEventListener('click', click);    
    document.addEventListener('mousedown', startdrawormove);
    document.addEventListener('mouseup', stopdrawormove);
    document.addEventListener('mousemove', sketch);
    document.addEventListener('mousehover', sketch);
});


var canvas = new fabric.Canvas("canvas");

var isDown, origX, origY;

var colorinput = document.getElementById("favcolor");
var slider = document.getElementById("opacity");
var output_o = document.getElementById("value");
var colorvalue = document.getElementById('colorVal');

output_o.innerHTML = slider.value;
colorvalue.innerHTML = colorinput.value;

colors = colorinput.value;
opacitys = slider.value;

var isSelect = false;
var activeGroup = null;
var tooltype = null;
var shapetype = "Rect";

function click(event){ 
  // if users click reset, clear all shapes in the interface (10pts)
  /* your code is here */
  if (tooltype == "reset") {
    canvas.clear();
  }
}


function startdrawormove(event) {
  isDown = true;
  var pointer = canvas.getPointer(event); // get mouse position
  origX = pointer.x;
  origY = pointer.y;
    if (tooltype == "draw") {
      //Use fabric.Circle/Rect/Triangle to define a circle/rectangle/triangle, respectively. Each shape is for 9pts
     /* your code is here */
      if (shapetype == "Rect") {
        obj = new fabric.Rect({
          left: origX,
          top: origY,
          fill: colors,
          opacity: opacitys,
        });
      } else if(shapetype == "Circle") {
        obj = new fabric.Circle({
          left: origX,
          top: origY,
          originX: 'left',
          originY: 'top',
          radius: pointer.x-origX,
          angle: 0,
          fill: colors,
          opacity: opacitys,
      });
      } else if(shapetype == "Triangle"){
        obj = new fabric.Triangle({
          left: origX,
          top: origY,
          width: pointer.x-origX, // 底边长度
          height: pointer.y-origY,
          fill: colors,
          opacity: opacitys,
          }); 
      }
    // add the defined shape into canvas (3pts).
    /* your code is here */
      canvas.add(obj);
      canvas.forEachObject(object => {
        object.hasControls = false;
        object.selectable = false;
      });
    }
    else if (tooltype == "move" && isSelect == false){
      // make all shapes selectable (4pts).
    /* your code is here */
      canvas.forEachObject(object => {
        object.selectable = true;
      });
    }
    if (isSelect){
      activeGroup = null;
      isSelect = false;
      canvas.discardActiveObject();
      canvas.renderAll();
      isDown = false;
      console.log('press for confirm');
    }
    
}

function stopdrawormove(event){
  isDown = false;
  if(change_o){
    change_o=false;
  }
}

function sketch(event){
  if (tooltype=="draw"){
    if (!isDown) return;
    var pointer = canvas.getPointer(event); 
    if (shapetype == "Circle"){
      // set the circle radius based on the mouse position (6pts)
      /* your code is here */
      var radius = Math.min(Math.abs(origY - pointer.y),Math.abs(origX - pointer.x));
      if (radius > obj.strokeWidth) {
        radius -= obj.strokeWidth/2;
      }
      obj.set({ radius: radius});
      if(origX>pointer.x){
        obj.set({originX: 'right' });
      } else {
        obj.set({originX: 'left' });
      }
      if(origY>pointer.y){
        obj.set({originY: 'bottom'  });
      } else {
        obj.set({originY: 'top'  });
      }
    }
    else if (shapetype == "Rect" || shapetype == "Triangle") {
      // set the width and height of rectangle or triangle based on the mouse position (6pts)
      /* your code is here */
      if(origX>pointer.x){
        obj.set({ left: Math.abs(pointer.x) });
      }
      if(origY>pointer.y){
        obj.set({ top: Math.abs(pointer.y) });
      }

      obj.set({ width: Math.abs(origX - pointer.x) });
      obj.set({ height: Math.abs(origY - pointer.y) });
    }
    canvas.renderAll();
    canvas.discardActiveObject();
  }

  else if (tooltype == "move" && !isSelect && !change_o){
    var pointer = canvas.getPointer(event);

    // move the selected shape  hint: use getActiveObject() function(8pts)
    /* your code is here */
    

    if (!canvas.getActiveObject()) {
      return;
    }

    if (canvas.getActiveObject().type !== 'group') {
      activeGroup = canvas.getActiveObject();
    } else if (canvas.getActiveObject().type == 'activeSelection') {
      activeGroup = canvas.getActiveObject().toGroup();
    }
    activeGroup.hasControls = false;
    isSelect = true;
  
  } else if (isSelect&& !change_o){
    var pointer = canvas.getPointer(event);
    activeGroup.set({ 
      left: Math.abs(pointer.x), 
      top: Math.abs(pointer.y),
    });
    activeGroup.setCoords();
    canvas.renderAll();
  }

  // get all shapes from canvas (6pts) and change the opacity of each shape (6pts)
  /* your code is here */
  
}


function select_shape(shape){
  shapetype = shape;
}


function use_tool(tool){
  tooltype = tool;
}

function changeColors(){
  colors = colorinput.value;
  colorvalue.innerHTML = colorinput.value;
}

var change_o=false;
function changeOpacity(){
  opacitys = slider.value;
  output_o.innerHTML = slider.value;
  change_o = true;
  // var sel = new fabric.ActiveSelection(canvas.getObjects(), {
  //   canvas: canvas,
  // });
  // canvas.setActiveObject(sel);
  // // sel.hasControls=set.hasBorders = set.selectable = false;
  // //var allobject = canvas.getActiveObject();
  // sel.set({opacity:opacitys});
  // canvas.requestRenderAll();
  // //canvas.discardActiveObject();


  canvas.forEachObject(object => {
    object.opacity = opacitys;
  });
  canvas.requestRenderAll();
}




