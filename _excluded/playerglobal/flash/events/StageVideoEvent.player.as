/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public UNIMPLEMENTED class StageVideoEvent extends Event
	{
		public const codecInfo : String;

		public static const RENDER_STATE : String = "renderState";
		public static const RENDER_STATUS_ACCELERATED : String = "accelerated";
		public static const RENDER_STATUS_SOFTWARE : String = "software";
		public static const RENDER_STATUS_UNAVAILABLE : String = "unavailable";

		public function get colorSpace () : String
		{
			throw new Error('StageVideoEvent: attempted call to an unimplemented function "colorSpace"');
		}

		public function get status () : String
		{
			throw new Error('StageVideoEvent: attempted call to an unimplemented function "status"');
		}

		public function StageVideoEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, status:String=null, colorSpace:String=null)
		{
			throw new Error('StageVideoEvent: attempted call to an unimplemented constructor');
		}

	}
}
