/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */
 
//NOTES:
//dataFormat 'text' is only supported for now
//only complete event is dispatched. (need to dispatch other types even if faked)
//more types of errors need to be thrown

package flash.net
{
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.HTTPStatusEvent;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.utils.ByteArray;
	
	import browser.Browser;
	
	

	public class URLLoader extends EventDispatcher
	{
		private var _xmlHttpRequest:Object;
		

		public var bytesLoaded : uint;


		public var bytesTotal : uint;


		public var data : *;


		public var dataFormat : String = 'text';


		public function URLLoader(request:URLRequest=null)
		{
			super();
			
			if (request) load(request);
		}

		public function load(request:URLRequest):void
		{
			if (!request || !request.url) throw new TypeError('request or request.url is null');
			
			var dataFormat:String = this.dataFormat;
			
			var a:* = document.createElement('a');
			a.href = request.url;
			
			var parts:Array = a.pathname.split('.');
			var suffix:String = parts.pop().toLowerCase();
			
			if (suffix == 'js' && window.loaderInfoParams && (!window.loaderInfoParams['debug'] && !window.loaderInfoParams['trace'])) 
			{
				parts.push('min');
				parts.push('js');
				a.pathname = parts.join('.');
			}
			
			var src:String;
			var regex:RegExp = /^(?:\/|[a-z]+:\/\/)/;
			if (regex.test(request.url)) //absolute
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
			
			_xmlHttpRequest = Browser.getNewXMLHttpRequest();
			_xmlHttpRequest.onload = onLoad;
			_xmlHttpRequest.onprogress = onProgress;
			_xmlHttpRequest.onerror = onError;
			_xmlHttpRequest.open(request.method, src, true);
			if (dataFormat == 'text') _xmlHttpRequest.overrideMimeType('text/plain');
			else _xmlHttpRequest.responseType = 'arraybuffer';
			
			var requestdata:* = request.data;
			if (requestdata && requestdata is ByteArray) requestdata = new window.Uint8Array((data as ByteArray).$__getArrayBuffer());
			
			_xmlHttpRequest.send(requestdata);
			
			function onLoad(event:Object):void
			{
				if (!_xmlHttpRequest) return;
				
				dispatchEvent(new HTTPStatusEvent(HTTPStatusEvent.HTTP_STATUS, false, false, _xmlHttpRequest.status));
				
				if (dataFormat == 'text') data = _xmlHttpRequest.responseText;
				else
				{
					var byteArray:ByteArray = new ByteArray();
					byteArray.$__setArrayBuffer(_xmlHttpRequest.response);
					data = byteArray;
				}
				
				_xmlHttpRequest.onprogress = null;
				_xmlHttpRequest.onload = null;
				_xmlHttpRequest.onerror = null;
				_xmlHttpRequest = null;
				
				dispatchEvent(new Event(Event.COMPLETE));
			}
			
			function onProgress(event:Object):void
			{
				if (!_xmlHttpRequest) return;
				if (!event.lengthComputable) return;
				
				bytesLoaded = event.loaded;
				bytesTotal = event.total;
				dispatchEvent(new ProgressEvent(ProgressEvent.PROGRESS, false, false, bytesLoaded, bytesTotal));
			}
			
			function onError(event:Object):void
			{
				if (!_xmlHttpRequest) return;
				
				close();
				dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, event.error));
			}
		}
		

		public function close():void
		{
			bytesLoaded = 0;
			bytesTotal = 0;
			
			if (!_xmlHttpRequest) return;
		
			_xmlHttpRequest.onload = null;
			_xmlHttpRequest.onprogress = null;
			_xmlHttpRequest.onerror = null;
			_xmlHttpRequest.abort();
			_xmlHttpRequest = null;
		}
	}
}
