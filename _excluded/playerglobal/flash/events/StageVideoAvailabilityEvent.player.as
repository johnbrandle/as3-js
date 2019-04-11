/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public UNIMPLEMENTED class StageVideoAvailabilityEvent extends Event
	{
		public static const STAGE_VIDEO_AVAILABILITY : String = "stageVideoAvailability";

		public function get availability () : String
		{
			throw new Error('StageVideoAvailabilityEvent: attempted call to an unimplemented function "availability"');
		}

		public function StageVideoAvailabilityEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, availability:String=null)
		{
			throw new Error('StageVideoAvailabilityEvent: attempted call to an unimplemented constructor');
		}

	}
}
