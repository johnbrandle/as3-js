/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;

	public UNIMPLEMENTED class SyncEvent extends Event
	{
		public static const SYNC : String = "sync";

		public function get changeList () : Array
		{
			throw new Error('SyncEvent: attempted call to an unimplemented function "changeList"');
		}

		public function set changeList (value:Array) : void
		{
			throw new Error('SyncEvent: attempted call to an unimplemented function "changeList"');
		}

		public function clone () : flash.events.Event
		{
			throw new Error('SyncEvent: attempted call to an unimplemented function "clone"');
		}

		public function SyncEvent (type:String, bubbles:Boolean=false, cancelable:Boolean=false, changeList:Array=null)
		{
			throw new Error('SyncEvent: attempted call to an unimplemented constructor');
		}

		public function toString () : String
		{
			throw new Error('SyncEvent: attempted call to an unimplemented function "toString"');
		}

	}
}
