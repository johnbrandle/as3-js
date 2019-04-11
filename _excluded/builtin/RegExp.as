/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	public class RegExp
	{
		public var lastIndex:Number;
		
		public function get global():Boolean { return false; }
		public function get ignoreCase():Boolean { return false; }
		public function get multiline():Boolean { return false; }
		public function get source():String { return null; }
	
		public function exec(str:String):Object { return null; }
		public function test(str:String):Boolean { return false; }
	}
}