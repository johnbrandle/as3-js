/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	public dynamic class Array
	{
		public static var CASEINSENSITIVE:uint = 1;
		public static var DESCENDING:uint = 2;
		public static var NUMERIC:uint = 16;
		public static var RETURNINDEXEDARRAY:uint = 8;
		public static var UNIQUESORT:uint = 4;
	
		public var length:uint;
	
		public function concat(... args):Array { return null; }
		public function every(callback:Function, thisObject:* = null):Boolean { return false; }
		public function filter(callback:Function, thisObject:* = null):Array { return null; }
		public function forEach(callback:Function, thisObject:* = null):void {}
		public function indexOf(searchElement:*, fromIndex:int = 0):int { return 0; }
		public function join(sep:*):String { return null; }
		public function lastIndexOf(searchElement:*, fromIndex:int = 0x7fffffff):int { return 0; }
		public function map(callback:Function, thisObject:* = null):Array { return null; }
		public function pop():* { return null; }
		public function push(... args):uint { return 0; }
		public function reverse():Array { return null; }
		public function shift():* { return null; }
		public function slice(startIndex:int = 0, endIndex:int = 16777215):Array { return null; }
		public function some(callback:Function, thisObject:* = null):Boolean { return false; }
		public function sort(... args):Array { return null; }
		public function sortOn(fieldName:Object, options:Object = null):Array { return null; }
		public function splice(startIndex:int, deleteCount:uint, ... values):Array { return null; }
		public function unshift(... args):uint { return 0; }
	}
}