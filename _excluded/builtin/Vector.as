/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	public class Vector
	{
		public var length:uint;
		
		public function concat(... args):* { return null; }
		public function every(callback:Function, thisObject:* = null):Boolean { return false; }
		public function filter(callback:Function, thisObject:* = null):* { return null; }
		public function forEach(callback:Function, thisObject:* = null):void {}
		public function indexOf(searchElement:*, fromIndex:int = 0):int { return 0; }
		public function join(sep:*):String { return null; }
		public function lastIndexOf(searchElement:*, fromIndex:int = 0x7fffffff):int { return 0; }
		public function map(callback:Function, thisObject:* = null):* { return null; }
		public function pop():* { return null; }
		public function push(... args):uint { return 0; }
		public function reverse():* { return null; }
		public function shift():* { return null; }
		public function slice(startIndex:int = 0, endIndex:int = 16777215):* { return null; }
		public function some(callback:Function, thisObject:* = null):Boolean { return false; }
		public function sort(... args):* { return null; }
		public function sortOn(fieldName:Object, options:Object = null):* { return null; }
		public function splice(startIndex:int, deleteCount:uint, ... values):* { return null; }
		public function unshift(... args):uint { return 0; }
	}
}