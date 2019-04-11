/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.UncaughtErrorEvents;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.system.LoaderContext;
	import flash.utils.ByteArray;
	import flash.utils.setTimeout;
	
	import browser.Browser;

	public class Loader extends DisplayObjectContainer
	{
		private var $_properties:*;

		public function Loader()
		{
			if ($_properties === undefined) $__properties({});
			
			super();
			
			$_properties.LoaderScope.$_contentLoaderInfo = new LoaderInfo();
			$_properties.LoaderScope.$_contentLoaderInfo.$__properties().LoaderInfoScope.$_loader = this;
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.LoaderScope = {$_content:null, $_contentLoaderInfo:null, $_font:null, $_lwf:null, $_srcset:null, $_urlLoader:null, $_loaderContext:null};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}

		public function load(request:URLRequest, context:LoaderContext=null):void
		{
			var a:*;
			var parts:Array;
			var url:String = request.url;
			var content:*;
			var urlLoader:*;
			
			var contentLoaderInfo:LoaderInfo = $_properties.LoaderScope.$_contentLoaderInfo;
			contentLoaderInfo.$__properties().LoaderInfoScope.$_url = url;
			$_properties.LoaderScope.$_loaderContext = context = (context || new LoaderContext());
			
			var suffix:String = url.split('.').pop().toLowerCase().split('?')[0];
			
			var onLoad:Function;
			var onProgress:Function;
			var onComplete:Function;
			switch (suffix)
			{	
				case 'fgl':
					a = document.createElement('a');
					a.href = url;
					
					var sinSuffix:String = a.href.substr(0, a.href.lastIndexOf('.'));
					
					var json:*;
					var atlasList:* = [];
					var flwebgl:* = Browser.getFlashWebGL();
					var player:*;
					var canvas:*;
					
					var onLoaded:Function = function():void
					{
						player.play();
						
						canvas.player = player;
						
						content.$__properties().MovieClipScope.$_setupFLWebGL();
						content.$__properties().DisplayObjectScope.$_loaderInfo = contentLoaderInfo;
						
						addChild(content);
						
						contentLoaderInfo.dispatchEvent(new Event(Event.INIT));
						contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
					}
					
					var create:Function = function():void
					{
						content = $_properties.LoaderScope.$_content = new MovieClip();
						
						canvas = content.$__properties().DisplayObjectScope.$_domView;						
						player = new flwebgl.Player();
						
						//Create textureatlas object for all the textures which you have
						var textureAtlasList:* = [];
						for (var i:* = 0; i < atlasList.length; i++) textureAtlasList.push(new flwebgl.TextureAtlas(atlasList[i].json, atlasList[i].image));
						
						var result:* = player.init(canvas, json, textureAtlasList, onLoaded);
						
						if (result === flwebgl.Player.E_CONTEXT_CREATION_FAILED || result === flwebgl.Player.E_REQUIRED_EXTENSION_NOT_PRESENT) throw new Error(result);
						
						var width:* = player.getStageWidth();
						var height:* = player.getStageHeight();
						canvas.width = width;
						canvas.height = height;
						player.setViewport(new flwebgl.geom.Rect(0, 0, width, height));
					}
					
					var loadJSONAtlas:Function = function():void
					{
						var xmlHttpRequest:* = Browser.getNewXMLHttpRequest();
						xmlHttpRequest.open('GET', sinSuffix + '_atlas.json', true);
						xmlHttpRequest.overrideMimeType('text/plain');
						xmlHttpRequest.onload = function() 
						{ 
							xmlHttpRequest.onload = undefined;
							
							atlasList.push({json:JSON.parse(xmlHttpRequest.responseText), image:sinSuffix + '_atlas.png'});
							
							create();
						}
							
						xmlHttpRequest.send(null);
					}
					
					var loadJSON:Function = function():void
					{
						var xmlHttpRequest:* = Browser.getNewXMLHttpRequest();
						xmlHttpRequest.open('GET', sinSuffix + '.json', true);
						xmlHttpRequest.overrideMimeType('text/plain');
						xmlHttpRequest.onload = function() 
						{ 
							xmlHttpRequest.onload = undefined;
							
							json = JSON.parse(xmlHttpRequest.responseText);
							
							loadJSONAtlas();
						}
							
						xmlHttpRequest.send(null);
					}
					
					var xmlHttpRequest:* = Browser.getNewXMLHttpRequest();
					xmlHttpRequest.open('GET', sinSuffix + '_actions.js', true);
					xmlHttpRequest.overrideMimeType('text/javascript');
					xmlHttpRequest.onload = function() 
					{ 
						xmlHttpRequest.onload = undefined;
						
						Browser.doEval(xmlHttpRequest.responseText);
						
						loadJSON();
					}
					
					xmlHttpRequest.send(null);
					
					return;
				case 'js':
				case 'swf':
					contentLoaderInfo.$__properties().LoaderInfoScope.$_contentType = 'application/x-shockwave-flash';
					
					if (contentLoaderInfo.parameters.font)
					{
						a = document.createElement('a');
						a.href = url;
						
						parts = a.pathname.split('.');
						parts[parts.length - 1] = 'ttf';
						a.pathname = parts.join('.');
						
						var fontName:String = a.pathname.split('/').pop().split('.').shift();
						
						var onFontLoaded:Function = function():void
						{
							var FontClass:* = {'$$isclass':true, name:fontName}; //fake being a class
							FontClass[fontName] = FontClass;
							
							context.applicationDomain.$__definitions[fontName] = FontClass;
							contentLoaderInfo.dispatchEvent(new Event(Event.INIT));
							contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
						};
						
						/*  //this may be overkill...
						$_font = new window.Font();
						$_font.onload = onFontLoaded;
						
						$_font.fontFamily = fontName;
						$_font.src = a.href;
						*/
						
						var src:String;
						var regex:RegExp = /^(?:\/|[a-z]+:\/\/)/;
						if (regex.test(url)) //absolute
						{
							src = a.href;
						}
						else //relative
						{
							var location:Object = window.location;
							parts = location.pathname.split('/');
							parts.pop();
							var slocation:String = parts.join('/');
							src = (a.pathname.indexOf(slocation) == -1) ? (location.pathname + '/../' + a.pathname + a.search + a.hash) : a.href;
						}
						
						var element:* = document.createElement('style');
						element.setAttribute('type', 'text/css');
						element.innerHTML = "@font-face {font-family: '" + fontName + "'; src: url('" + src + "') format('truetype');}";
						document.head.appendChild(element);
						
						setTimeout(onFontLoaded, 1);
						return;
					}
					else
					{
						a = document.createElement('a');
						a.href = url;
						
						parts = a.pathname.split('.');
						if (parts.pop().toLowerCase() != 'js')
						{
							content = $_properties.LoaderScope.$_content = new MovieClip();
							
							canvas = content.$__properties().DisplayObjectScope.$_domView;
							canvas.width = 0;
							canvas.height = 0;
							
							Browser.getLWF().useCanvasRenderer();
		
							var sinSuffix:String = a.href.substr(0, a.href.lastIndexOf('.'));
							var fileName:String = sinSuffix.split('/').pop();
							
							var lwfURL:String = fileName + '.lwf';
							var prefix:String = sinSuffix + '.lwf/';
							
							onLoad = function(lwf:Object):void
							{
								$_properties.LoaderScope.$_lwf = lwf;
								
								//lwf.rootMovie.dispatchMessage = function(e):void { trace('event: ' + e); }; //temp
								
								canvas.lwf = lwf;
								
								content.$__properties().MovieClipScope.$_setupLWF();
								content.$__properties().DisplayObjectScope.$_loaderInfo = contentLoaderInfo;
								
								addChild(content);
								
								contentLoaderInfo.dispatchEvent(new Event(Event.INIT));
								contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
							}
							
							onProgress = function(loaded:uint, total:uint):void
							{
								var properties:* = contentLoaderInfo.$__properties().LoaderInfoScope;
								properties.$_bytesLoaded = loaded;
								properties.$_bytesTotal = total;
								contentLoaderInfo.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, loaded, total));
							}
							
							var cache:Object = Browser.getLWF().ResourceCache.get();
							cache.loadLWF({lwf:lwfURL, prefix:prefix, stage:canvas, onload:onLoad, onprogress:onProgress});
						}
						else
						{
							onComplete = function(event:Event):void
							{
								urlLoader.removeEventListener(Event.COMPLETE, onComplete);
							
								content = $_properties.LoaderScope.$_content = Browser.doEval(urlLoader.data) as DisplayObject;
								
								addChild(content);
								
								$_properties.LoaderScope.$_urlLoader = null;
								
								contentLoaderInfo.dispatchEvent(new Event(Event.INIT));
								contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
							}
							
							urlLoader = $_properties.LoaderScope.$_urlLoader = new URLLoader();
							urlLoader.addEventListener(Event.COMPLETE, onComplete);
							urlLoader.load(request);						
						}
					}
					return;
				case 'jpg':
				case 'jpeg':
				case 'gif':
				case 'png':
				case 'xpng':
					var contentType:String;
					switch (suffix)
					{
						case 'jpg':
						case 'jpeg':
							contentType = 'image/jpeg';
							break;
						case 'gif': 
							contentType = 'image/gif';
							break;
						case 'png':
						case 'xpng':
							contentType = 'image/png';
							break;
					}
					
					contentLoaderInfo.$__properties().LoaderInfoScope.$_contentType = contentType;
	
					var img:* = document.createElement('img');
					img.onerror = function(event:Object):void
					{
						img.onload = img.onerror = null;
						 
						contentLoaderInfo.dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, event.error));
					}
					img.onload = function(event:Object):void
					{
						img.onerror = img.onload = null;

						content = $_properties.LoaderScope.$_content = new Bitmap();
						
						var properties:* = content.$__properties();
						var canvas:* = properties.DisplayObjectScope.$_domView;
						canvas.width = img.naturalWidth;
						canvas.height = img.naturalHeight;
						canvas.getContext('2d').drawImage(img, 0, 0);
						
						var bitmapData:BitmapData = new BitmapData(canvas.width, canvas.height);
						bitmapData.$__properties().BitmapDataScope.$_canvas = canvas;
						
						properties.BitmapScope.$_bitmapData = bitmapData;
						properties.DisplayObjectScope.$_setExplicitBounds(canvas.width, canvas.height);
						
						addChild(content);
						
						
						//window.$$getDescriptor(pscope, 'bitmapData').set.call(content, bitmapData);
						
						//content.width = img.naturalWidth;
						//content.height = img.naturalHeight;
						
						contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
					}
					if ($_properties.LoaderScope.$_srcset != null) img.srcset = $_properties.LoaderScope.$_srcset; 
					img.src = url;
					return;
				/*
				case 'xpng':
					contentLoaderInfo.$__properties().LoaderInfoScope.$_contentType = 'image/png';
					
					onComplete = function(event:Event):void
					{
						urlLoader.removeEventListener(Event.COMPLETE, onComplete);
						
						var byteArray:ByteArray = urlLoader.data;
						
						$_properties.LoaderScope.$_urlLoader = null;
						
						//var blob:* = new window.Blob([byteArray.$__getArrayBuffer()]);
						//url = window.URL.createObjectURL(blob);
						
						var img:* = document.createElement('img');
						img.onload = function(event:Object):void
						{
							img.onload = null;
							
							content = $_properties.LoaderScope.$_content = new Bitmap();
							
							var canvas:* = content.$__properties().DisplayObjectScope.$_domView;
							canvas.width = img.naturalWidth;
							canvas.height = img.naturalHeight;
							canvas.getContext('2d').drawImage(img, 0, 0);
							//canvas.setAttribute('rawData', canvas.toDataURL());
							
							var bitmapData:BitmapData = new BitmapData(canvas.width, canvas.height);
							bitmapData.$__properties().BitmapDataScope.$_canvas = canvas;
							
							content.$__properties().BitmapScope.$_bitmapData = bitmapData;
							content.width = img.naturalWidth;
							content.height = img.naturalHeight;
							
							//window.URL.revokeObjectURL(url);
							
							addChild(content);
							
							contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));
						}
						
						img.src = url;
					}
					
					urlLoader = $_properties.LoaderScope.$_urlLoader = new URLLoader();
					urlLoader.dataFormat = URLLoaderDataFormat.BINARY;
					urlLoader.addEventListener(Event.COMPLETE, onComplete);
					urlLoader.load(request);
					return;
					*/
					
					
					/*
					onLoad = function(event:Object):void
					{
						if (!$_xmlHttpRequest) return;
						
						var arrayBuffer:Object = $_xmlHttpRequest.response;
						var base64String:String = Browser.convertArrayBufferToBase64String(arrayBuffer);
						
						$_xmlHttpRequest.onprogress = null;
						$_xmlHttpRequest.onload = null;
						$_xmlHttpRequest = null;
						
						var domImage:Object = document.createElement('img');
						domImage.setAttribute('src', 'data:' + $_contentLoaderInfo.contentType + ';base64,' + base64String);
						
						var bytes:Object = Browser.getNewUint8Array(arrayBuffer);
						var width:Number;
						var height:Number;
						if (bytes[0] == 0x89 && bytes[1] == 0x50 && bytes[2] == 0x4E && bytes[3] == 0x47 && bytes[4] == 0x0D && bytes[5] == 0x0A && bytes[6] == 0x1A && bytes[7] == 0x0A) //PNG
						{
							width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
							height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
						}
						else if (bytes[0] == 0x47 && bytes[1] == 0x49 && bytes[2] == 0x46 && bytes[3] == 0x38 && bytes[4] == 0x39 && bytes[5] == 0x61) //GIF
						{
							width = (bytes[7] << 8) | bytes[6];
							height = (bytes[9] << 8) | bytes[8];
						}
						else if (bytes[0] == 0xFF && bytes[1] == 0xD8) //JPEG
						{
							var i:int = 4;
							var blockLength:int = (bytes[i] << 8) + bytes[i + 1];
							while(i < bytes.length) 
							{
								i += blockLength;
								
								if (i >= bytes.length || bytes[i] != 0xFF) throw new Error('invalid jpg format loaded: ' + request.url);
								
								if (bytes[i + 1] == 0xC0) 
								{   
									height = (bytes[i + 5] << 8) + bytes[i + 6];
									width = (bytes[i + 7] << 8) + bytes[i + 8];
									break;
								}
								
								i += 2;
								blockLength = (bytes[i] << 8) + bytes[i + 1];
							}
						}
						else throw new Error('invalid image format loaded: ' + request.url);
						
						domImage.setAttribute('width', width);
						domImage.setAttribute('height', height);
						
						$_content = new Bitmap();
						
						var canvas:* = $_content.$__properties().DisplayObjectScope.$_domView;
						canvas.width = width;
						canvas.height = height;
						canvas.getContext('2d').drawImage(domImage, 0, 0);
						
						var bitmapData:BitmapData = new BitmapData(canvas.width, canvas.height);
						bitmapData.$__properties().BitmapDataScope.$_canvas = canvas;
						
						$_content.$__properties().BitmapScope.$_bitmapData = bitmapData;
						$_content.width = width;
						$_content.height = height;
						
						addChild($_content);
						
						$_contentLoaderInfo.dispatchEvent(new Event(Event.COMPLETE));	
					}
					
					onProgress = function(event:Object):void
					{
						if (!event.lengthComputable) return;
						
						$_contentLoaderInfo.$__bytesLoaded = event.loaded;
						$_contentLoaderInfo.$__bytesTotal = event.total;
						$_contentLoaderInfo.dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, event.loaded, event.total));
					}
				
					$_xmlHttpRequest = Browser.getNewXMLHttpRequest();
					$_xmlHttpRequest.onload = onLoad;
					$_xmlHttpRequest.onprogress = onProgress;
					$_xmlHttpRequest.open('GET', request.url, true);
					$_xmlHttpRequest.responseType = 'arraybuffer';
					$_xmlHttpRequest.overrideMimeType('text/plain; charset=x-user-defined');
					$_xmlHttpRequest.send(null);
					return;
					*/
				default:
					throw new Error('Loader, attempt to load unknown type: ' + request.url);
			}
		}
		
		override public function get width():Number 
		{
			if ($_properties.LoaderScope.$_content is Bitmap) return $_properties.LoaderScope.$_content.width * scaleX;
			
			return super.width;
		}
		
		override public function get height():Number 
		{
			if ($_properties.LoaderScope.$_content is Bitmap) return $_properties.LoaderScope.$_content.height * scaleY;
			
			return super.height;
		}
		

		public function get srcset():String
		{
			return $_properties.LoaderScope.$_srcset;
		}
		
		public function set srcset(srcset:String):void
		{
			$_properties.LoaderScope.$_srcset = srcset;
		}

		public function get content():flash.display.DisplayObject
		{
			return $_properties.LoaderScope.$_content;
		}

		public function get contentLoaderInfo():flash.display.LoaderInfo
		{
			return $_properties.LoaderScope.$_contentLoaderInfo;
		}

		public function unload():void
		{
			if (!$_properties.LoaderScope.$_lwf) return;
			
			if ($_properties.LoaderScope.$_content.parent == this) $_properties.LoaderScope.$_content.$__properties().TLScope.parent.$__properties().TLScope.removeChild($_properties.LoaderScope.$_content);
			
			var cache:Object = Browser.getLWF().ResourceCache.get();
			cache.unloadLWF($_properties.LoaderScope.$_lwf);
		}

		public function unloadAndStop (gc:Boolean=true):void
		{
			unload();
		}

		public UNIMPLEMENTED function get uncaughtErrorEvents () : flash.events.UncaughtErrorEvents
		{
			throw new Error('Loader: attempted call to an unimplemented function "uncaughtErrorEvents"');
		}

		public function close():void
		{
			//trace('Loader: warning call to an unimplemented function "close"');
		}

		public UNIMPLEMENTED function loadBytes (bytes:ByteArray, context:LoaderContext=null) : void
		{
			throw new Error('Loader: attempted call to an unimplemented function "loadBytes"');
		}
	}
}
