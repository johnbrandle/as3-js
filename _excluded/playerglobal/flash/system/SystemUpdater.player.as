/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	import flash.events.EventDispatcher;
	import flash.events.Event;

	public UNIMPLEMENTED class SystemUpdater extends EventDispatcher
	{

		public function cancel () : void
		{
			throw new Error('SystemUpdater: attempted call to an unimplemented function "cancel"');
		}


		public function SystemUpdater ()
		{
			throw new Error('SystemUpdater: attempted call to an unimplemented constructor');
		}


		public function update (type:String) : void
		{
			throw new Error('SystemUpdater: attempted call to an unimplemented function "update"');
		}

	}
}
