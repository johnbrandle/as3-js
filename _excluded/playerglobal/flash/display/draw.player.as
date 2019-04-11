/**
 BitmapData for EaselJS
 Version: 1.00
 Author: kudox
 http://kudox.jp/
 http://twitter.com/u_kudox
 Licensed under the MIT License
 Copyright (c) 2013 kudox.jp
 https://github.com/u-kudox/BitmapData_for_EaselJS/blob/master/src/BitmapData.js
 */
public function draw(source:IBitmapDrawable, matrix:Matrix=null, colorTransform:ColorTransform=null, blendMode:String=null, clipRect:Rectangle=null, smoothing:Boolean=false) : void
{
	var sourceCanvas:*;
	if (source is Bitmap) sourceCanvas = (source as DisplayObject).$__properties().DisplayObjectScope.$_domView;
	else if (source is DisplayObject) sourceCanvas = (source as DisplayObject).$__properties().DisplayObjectScope.$_toCanvas();
	else if ((source is BitmapData)) sourceCanvas = $_createOrGetCanvas(source as BitmapData);
	else throw new Error('bitmapdata draw implementation only supports a ibitmapdrawable source of type bitmapdata');

	if (!matrix)
	{
		matrix = new Matrix();
		matrix.identity();
	}
	if (!clipRect) clipRect = new Rectangle(0, 0, sourceCanvas.width, sourceCanvas.height);

	var canvas:* = $_createOrGetCanvas(this);
	var context:* = canvas.getContext('2d');

	context.save();

	context.imageSmoothingEnabled = smoothing;
	context.mozImageSmoothingEnabled = smoothing;
	context.beginPath();
	context.rect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
	context.clip();

	context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	context.drawImage(sourceCanvas, 0, 0);
	context.closePath();
	context.restore();

	//canvas.setAttribute('rawData', canvas.toDataURL());
}