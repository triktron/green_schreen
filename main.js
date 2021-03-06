var frame;
var of;

(function (doc, nav) {
  "use strict";

  var video, width, height, context;

  function initialize() {
    // The source video.
    video = doc.getElementById("v");
    width = video.width;
    height = video.height;

    // The target canvas.
    var canvas = doc.getElementById("c");
    context = canvas.getContext("2d");

    // Get the webcam's stream.
    nav.getUserMedia({video: true}, startStream, function () {});
  }

  function startStream(stream) {
    video.src = URL.createObjectURL(stream);
    video.play();

    // Ready! Let's start drawing.
    requestAnimationFrame(draw);
  }

  function draw() {
    frame = readFrame();

    if (frame) {
      replaceGreen(frame.data);
      context.putImageData(frame, 0, 0);
    }

    // Wait for the next frame.
    requestAnimationFrame(draw);
  }

  

  function replaceGreen(data) {
    var len = data.length;

    for (var i = 0, j = 0; j < len; i++, j += 4) {
      // Convert from RGB to HSL...
      /*var hsl = rgb2hsl(data[j], data[j + 1], data[j + 2]);
      var h = hsl[0], s = hsl[1], l = hsl[2];

      // ... and check if we have a somewhat green pixel.
      if (h >= 90 && h <= 160 && s >= 25 && s <= 90 && l >= 20 && l <= 75) {
        data[j + 3] = 0;
      }*/
	  
	  /*if (data[j] >= 110 && data[j + 1] >= 110 && data[j + 2] >= 110) {
		  data[j + 3] = 0;
	  }*/
	  
	  if (data[j] <= of[j][0]+2 && data[j] >= of[j][0]-2 && data[j + 1] <= of[j + 1][1]+2 && data[j + 1] >= of[j + 2][1]-2 && data[j] <= of[j + 2][2]+2 && data[j] >= of[i + 2][2]-2) {
		  data[j + 3] = 0;
	  }
    }
  }

  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;

    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h, s, l;

    if (max == min) {
      h = 0;
    } else if (r == max) {
      h = (g - b) / delta;
    } else if (g == max) {
      h = 2 + (b - r) / delta;
    } else if (b == max) {
      h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
      h += 360;
    }

    l = (min + max) / 2;

    if (max == min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
  }

  addEventListener("DOMContentLoaded", initialize);
})(document, navigator);

function show_coords(event)
{
var x=event.clientX - 8;
var y=event.clientY - 8;
var j = (x*y)*4;
 document.getElementById("log").innerHTML = "X coords: " + x + ", Y coords: " + y + ":" + j;
 document.title = frame.data[j] +"," + frame.data[j + 1] + "," + frame.data[j + 2];
}

function reedit(data) {
	var len = data.length;
	of = Create2DArray(len/4);

    for (var i = 0, j = 0; j < len; i++, j += 4) {
		of[i][0] = data[j]
		of[i][1] = data[j + 1]
		of[i][2] = data[j + 2]
    }
}

function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}

function readFrame() {
    try {
      context.drawImage(video, 0, 0, width, height);
    } catch (e) {
      // The video may not be ready, yet.
      return null;
    }

    return context.getImageData(0, 0, width, height);
  }