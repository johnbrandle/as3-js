/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text
{
	import flash.events.EventDispatcher;
	import flash.text.TextFormat;
	
	
	
	public dynamic class StyleSheet extends EventDispatcher
	{
		private static var _ID:int = 0;
		
		public var $__id:* = "__style__" + _ID++;
		private var _styleNode:*;
		private var _styles:Object = {};
		

		public function StyleSheet()
		{
			var doc:* = document;
			var styleNode:* = doc.createElement('style');
			styleNode.type = 'text/css';
			doc.getElementsByTagName('head')[0].appendChild(styleNode);
			
			_styleNode = styleNode;
		}


		public UNIMPLEMENTED function setStyle (styleName:String, styleObject:Object):void
		{
			throw new Error('StyleSheet: attempted call to an unimplemented function "setStyle"');
		}
		

		public UNIMPLEMENTED function get styleNames () : Array
		{
			throw new Error('StyleSheet: attempted call to an unimplemented function "styleNames"');
		}


		public function clear () : void
		{
			_styleNode.innerHTML = '';
		}


		public function getStyle (styleName:String) : Object
		{
			return JSON.parse(JSON.stringify(_styles[styleName]));
		}


		public function parseCSS(text:*):void
		{
			text = (text || '').trim();
			
			if (!text.length) return;
			
			var parts:* = text.split('}');
			var id:* = $__id;
			for (var i:* = parts.length; i--;)
			{
				if (!parts[i].length) continue;
				
				parts[i] = ' .' + id + ' ' + parts[i];
			}
		
			_styleNode.innerHTML = parts.join('}');
		}


		public UNIMPLEMENTED function transform (formatObject:Object) : flash.text.TextFormat
		{
			throw new Error('StyleSheet: attempted call to an unimplemented function "transform"');
		}
	}
}
