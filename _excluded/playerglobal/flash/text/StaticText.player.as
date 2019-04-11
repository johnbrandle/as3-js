/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text
{
	import flash.display.DisplayObject;

	public final UNIMPLEMENTED class StaticText extends DisplayObject
	{

		public function get text () : String
		{
			throw new Error('StaticText: attempted call to an unimplemented function "text"');
		}

		public function StaticText ()
		{
			throw new Error('StaticText: attempted call to an unimplemented constructor');
		}

	}
}
