var kAcier = "acier";
var kArgent = "metal-argent";
var kAzur = "azur";
var kBlack = "black";
var kGueule = "gueules"
var kMure = "mure";
var kOr = "metal-or";
var kOrange = "orange";
var kPourpre = "pourpre";
var kSable = "sable";
var kSanguine = "sanguine";
var kSinople = "sinople";
var kTenne = "tenne";
var kCarnation = "carnation";
var hatching_frequency = 5

function HatchingFrequency() {
	return hatching_frequency;
}

function SetHatchingFrequency(v) {
	hatching_frequency = v;
}

function PatternFrequency() {
	return hatching_frequency / 5 * 3;
}

function DiagonalFrequency() {
	return hatching_frequency / 5 * 8;
}

function rgbToHsl(r, g, b){
  r /= 255;
  g /= 255;
  b /= 255;
	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if (max == min){
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, l];
}

function RGBToPattern(r, g, b) {
	var hsl = rgbToHsl(r, g, b);
	// Reference is not in degree yet
	var h = hsl[0] * 360;
	var s = hsl[1];
	var l = hsl[2];
	if (l > 0.9) {
		return kArgent;
	}
	if (l < 0.2) {
		return kBlack;
	}
	if (s < 0.2) {
		if (l < 0.4) {
			return kBlack;
		}
		if (l > 0.7) {
			return kArgent;
		}
		return kAcier;
	}
	if (h < 20 ) {
		if (l < 0.40) {
			return kSanguine;
		}
		return kGueule;
	}
	if (h < 40) {
		if (l > 0.7 && s < 0.7) {
			return kCarnation;
		}
		if (l > 0.4) {
			return kOrange;
		}
		return kTenne;
	}
	if (h < 60) {
		return kOr;
	}
	if (h < 160) {
		return kSinople;
	}
	if (h < 260) {
		return kAzur;
	}
	// Anything redish dark is mure

	if (h < 340) {
		if (l < 0.3) {
			return kMure;
		}
		return kPourpre;
	}
	if (l < 0.40) {
		return kSanguine;
	}
	return kGueule;
}

function Acier(x, y) {
	var block = (Math.floor(x / HatchingFrequency()) +  Math.floor(y / HatchingFrequency())) % 2;
	var half = Math.floor(HatchingFrequency() / 2)
	if (block == 0) {
		return x % HatchingFrequency() == half ? 0 : 255;
	} else {
		return y % HatchingFrequency() == half ? 0 : 255;
	}
}

function Orange(x, y) {
	var block = (Math.floor(x / HatchingFrequency()) +  Math.floor(y / HatchingFrequency())) % 2;
	var half = Math.floor(HatchingFrequency() / 2)
	if (block == 0) {
		return x % HatchingFrequency() == half ? 0 : 255;
	} else {
		return (x % HatchingFrequency() == half) && (y % HatchingFrequency()) == half ? 0 : 255;
	}
}

function Carnation(x, y) {
	var block = (Math.floor(x / HatchingFrequency()) +  Math.floor(y / HatchingFrequency())) % 2;
	var half = Math.floor(HatchingFrequency() / 2)
	if (block == 0) {
		return x % HatchingFrequency() == half ? 0 : 255;
	} else {
		return 255;
	}
}

function ditherImage(canvas_id) {
	var src_canvas = document.getElementById(canvas_id);
  var src_ctx = src_canvas.getContext("2d");
  var src_width = src_canvas.width;
  var src_height = src_canvas.height;
  var src = src_ctx.getImageData(0, 0, src_width, src_height);

	for(var y = 0; y < src_height; y++) {
		for(var x = 0; x < src_width; x++) {
			var in_offset = ((src_width * y) + x) * 4;
			var red = src.data[in_offset];
      var green = src.data[in_offset + 1];
      var blue = src.data[in_offset + 2];
			var output = RGBToPattern(red, green, blue);
			var gray = 255;  // Will hold output
			switch (output) {
				case kBlack:
					gray = 0;
					break;
				case kArgent:
					gray = 255;
					break;
				case kGueule:
					// Pattern: ▥
					gray = x % HatchingFrequency() == 0 ? 0 : 255;
					break;
				case kAzur:
					// Pattern: ▤
					gray = y % HatchingFrequency() == 0 ? 0 : 255;
					break;
				case kOr:
				  // Pattern: ▒
					gray = (x % PatternFrequency() == 0) && (y % PatternFrequency()) == 0 ? 0 : 255;
					break;
				case kPourpre:
					// Pattern: ▨
					gray = (x + y) % DiagonalFrequency() == 0 ? 0 : 255;
					break;
				case kSinople:
					// Pattern: ▧
					gray = (x - y) % DiagonalFrequency() == 0 ? 0 : 255;
					break;
				case kSable:
					// Pattern: ▦
					gray = (x % HatchingFrequency() == 0) || (y % HatchingFrequency()) == 0 ? 0 : 255;
					break;
				case kTenne:
					// Pattern: ▥ + ▧
					gray = (x % HatchingFrequency() == 0) || ((x - y) % DiagonalFrequency() == 0) ? 0 : 255;
					break;
				case kSanguine:
					// Pattern: ▤ + ▨
					gray = (y % HatchingFrequency() == 0) || ((x - y) % DiagonalFrequency() == 0) ? 0 : 255;
					break;
				case kMure:
					// Pattern: ▨ + ▧
					gray = ((x - y) % DiagonalFrequency() == 0)  || ((x + y) % DiagonalFrequency() == 0) ? 0 : 255;
					break;
				case kAcier:
					gray = Acier(x, y);
					break;
				case kOrange:
					gray = Orange(x, y);
					break;
				case kCarnation:
					gray = Carnation(x, y);
					break;
				default:
					break;
			}
			src.data[in_offset] = gray;
			src.data[in_offset+ + 1] = gray;
			src.data[in_offset+ + 2] = gray;
			continue;
		}
	}
	src_ctx.putImageData(src, 0, 0);
}

function uploadImage(e){
  var reader = new FileReader();
  reader.onload = function(event){
    var img = new Image();
    img.onload = function() {
    	var canvas = document.getElementById('image_canvas');
    	canvas.width = img.width;
      canvas.height = img.height;
			var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
    }
    img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);
}

function downloadCanvas(link, canvasId, filename) {
	console.log(filename);
  link.href = document.getElementById(canvasId).toDataURL();
  link.download = filename;
}

var imageLoader = document.getElementById('image_loader');
imageLoader.addEventListener('change', uploadImage, false);
document.getElementById('download_image').addEventListener('click', function() {
  downloadCanvas(this, 'image_canvas', "hatched.png");
}, false);


