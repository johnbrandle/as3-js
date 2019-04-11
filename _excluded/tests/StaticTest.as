/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package
{
	import flash.events.Event;

	public class StaticTest extends Event
	{
		public static var CONNECT:String = "CONNECT";

		//public var connect:String = CONNECT;

		/*
		public function StaticTest()
		{
			super(StaticTest.CONNECT, false, false);
			trace(CONNECT);
			trace(StaticTest.CONNECT);
		}
		*/

		public static function toString():String
		{
			
		}

		public override function toString():String
		{
			return '';
		}

		public function staticMethodTest()
		{
			trace(CONNECT);
			trace(Event.CONNECT);
			trace(super.toString());

			//trace(StaticTest.CONNECT);
		}

		/*
		public function methodTest()
		{
			trace(CONNECT);
			trace(StaticTest.CONNECT);
		}
		*/
	}
}