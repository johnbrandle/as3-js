/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package browser
{
	import flash.display.Sprite;
	import flash.utils.ByteArray;
	
	public final class Browser
	{
		private static var $_transformOriginString:String;
		private static var $_transformString:String;
		private static var $_backfaceVisibilityString:String;
		
		public static function doEval(js:String):Sprite
		{
			var object:* = (window.execScript) ? window.execScript(js) : window.eval.call(window, js);
			if (object) $es4.$$construct(object, []);
			else object = new Sprite();
			
			return object;
		}
		
		public static function getWindow():Object
		{
			return window;
		}
		
		public static function domParseXML(textValue:String):Object
		{
			return new window.DOMParser().parseFromString(textValue, 'text/xml');
		}
		
		public static function getNewAudio():*
		{
			if (window.audios && window.audios.length) return window.audios.pop();
			
			return document.createElement('audio');
		}
		
		public static function getNewAudioContext():*
		{
			var audioContext:*;
			if (window.audioContexts && window.audioContexts.length) audioContext = window.audioContexts[0];
			else if (!window.mobile) //no point trying to create it here on mobile, as it likely will start in a suspended state. it will be created automatically when the user presses.
			{
				window.audioContexts = [];
				try
				{
					audioContext = window.audioContexts[0] = new (window.webkitAudioContext !== undefined ? window.webkitAudioContext : window.AudioContext)();
				}
				catch (error:*)
				{
					trace('failed to create audio context: ' + error);
				}
			}

			if (audioContext && audioContext.state !== undefined && audioContext.state != 'running' && window.mobile) //firefox, desktop, starts state as suspended sometimes it seems. only realy care about mobile anyway, as desktop will not likely have issues
			{
				trace('invalid audioContext state: ' + audioContext.state);
				if (audioContext.close !== undefined) audioContext.close();
				window.audioContexts = [];
				return null;
			}

			return audioContext;
		}
		
		public static function getNewVideo():Object
		{
			if (window.videos && window.videos.length) return window.videos.pop();
			
			var video:* = document.createElement('video');
			video.setAttribute('webkit-playsinline', '');
			video.setAttribute('preload', 'auto');
			video.style.objectFit = video.style.imageFit = 'fill';
			
			return video;
		}
		
		public static function getDisplayObjectElement(displayObject:*):*
		{
			return displayObject.$__properties().DisplayObjectScope.$_domView;
		}
		
		public static function getNewUint8Array(value:*):Object
		{
			return new window.Uint8Array(value);
		}
		
		public static function getTransformOriginString():String
		{
			if ($_transformOriginString) return $_transformOriginString;
			
			var transformString:String;
			if (document.body.style.transformOrigin !== undefined) transformString = 'transformOrigin';
			else if (document.body.style.webkitTransformOrigin !== undefined) transformString = 'webkitTransformOrigin';
			else if (document.body.style.mozTransformOrigin !== undefined) transformString = 'mozTransformOrigin';
			else if (document.body.style.msTransformOrigin !== undefined) transformString = 'msTransformOrigin';
			else if (document.body.style.oTransformOrigin !== undefined) transformString = 'oTransformOrigin';
			
			return $_transformOriginString = transformString;
		}
		
		public static function getTransformString():String
		{
			if ($_transformString) return $_transformString;
			
			var transformString:String;
			if (document.body.style.transform !== undefined) transformString = 'transform';
			else if (document.body.style.webkitTransform !== undefined) transformString = 'webkitTransform';
			else if (document.body.style.mozTransform !== undefined) transformString = 'mozTransform';
			else if (document.body.style.msTransform !== undefined) transformString = 'msTransform';
			else if (document.body.style.oTransform !== undefined) transformString = 'oTransform';
			
			return $_transformString = transformString;
		}
		
		public static function getBackfaceVisibilityString():String
		{
			if ($_backfaceVisibilityString) return $_backfaceVisibilityString;
			
			var backfaceVisibilityString:String;
			if (document.body.style.backfaceVisibility !== undefined) backfaceVisibilityString = 'backfaceVisibility';
			else if (document.body.style.webkitBackfaceVisibility !== undefined) backfaceVisibilityString = 'webkitBackfaceVisibility';
			
			return $_backfaceVisibilityString = backfaceVisibilityString;
		}
		
		public static function getTapHighlightColorString():String
		{
			return 'webkitTapHighlightColor';
		}
		
		public static function getNewXMLSerializer():Object
		{
			return new window.XMLSerializer();
		}
		
		public static function getNewXMLHttpRequest():Object
		{
			return new window.XMLHttpRequest();
		}
		
		public static function getLWF():Object //small, shouldn't be a problem
		{
			if (window.LWF) return window.LWF;
			
			var xmlHttpRequest:Object = getNewXMLHttpRequest();
			xmlHttpRequest.open('GET', 'js/as3-js-player/lwf/lwf.min.js', false);
			xmlHttpRequest.overrideMimeType('text/javascript');
			xmlHttpRequest.send(null);
			
			var js:String = xmlHttpRequest.responseText;
			(window.execScript) ? window.execScript(js) : window.eval.call(window, js);
			
			return window.LWF;
		}
		
		public static function getFlashWebGL():Object
		{
			if (window.flwebgl) return window.flwebgl;
			
			var xmlHttpRequest:Object = getNewXMLHttpRequest();
			xmlHttpRequest.open('GET', 'js/as3-js-player/flwebgl/flwebgl-0.2.min.js', false);
			xmlHttpRequest.overrideMimeType('text/javascript');
			xmlHttpRequest.send(null);
			
			var js:String = xmlHttpRequest.responseText;
			(window.execScript) ? window.execScript(js) : window.eval.call(window, js);
			
			return window.flwebgl;
		}
		
		public static function getByteArray(url:String):ByteArray //ideally this has already be cached by the browser
		{
			var xmlHttpRequest:* = Browser.getNewXMLHttpRequest();
			xmlHttpRequest.open('GET', url, false);
			xmlHttpRequest.responseType = 'arraybuffer';
			xmlHttpRequest.send(null);
			
			var byteArray:ByteArray = new ByteArray();
			byteArray['$__setArrayBuffer'](xmlHttpRequest.response);
			
			return byteArray;
		}

		include "convertArrayBufferToBase64String.player.as"
	}
}