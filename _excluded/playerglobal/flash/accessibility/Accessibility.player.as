/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.accessibility
{
	import flash.display.DisplayObject;

	public final class Accessibility 
	{
		public static function get active () : Boolean
		{
			return false;
		}

		public function Accessibility ()
		{
			throw new Error('Accessibility: attempted call to an unimplemented constructor');
		}

		public static function sendEvent (source:DisplayObject, childID:uint, eventType:uint, nonHTML:Boolean=false) : void
		{
			throw new Error('Accessibility: attempted call to an unimplemented function "sendEvent"');
		}

		public static function updateProperties():void
		{
		}
	}
}
