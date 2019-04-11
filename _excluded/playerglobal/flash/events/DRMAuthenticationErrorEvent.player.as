/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	public UNIMPLEMENTED class DRMAuthenticationErrorEvent extends ErrorEvent
	{
		private var _domain:String;
		private var _serverURL:String;
		private var _subErrorID:int;

		public static const AUTHENTICATION_ERROR:String = "authenticationError";

		public function get domain():String
		{
			return _domain;
		}

		public function set domain(value:String):void
		{
			_domain = value;
		}

		public function get serverURL():String
		{
			return _serverURL;
		}

		public function set serverURL(value:String):void
		{
			_serverURL = value;
		}

		public function get subErrorID():int
		{
			return _subErrorID;
		}

		public function set subErrorID(value:int):void
		{
			_subErrorID = value;
		}

		override public function clone():Event
		{
			return new DRMAuthenticationErrorEvent(type, bubbles, cancelable, text, errorID, subErrorID, serverURL, domain);
		}

		public function DRMAuthenticationErrorEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, inDetail:String = "", inErrorID:int = 0, inSubErrorID:int = 0, inServerURL:String = null, inDomain:String = null)
		{
			super(type, bubbles, cancelable, inDetail, inErrorID);
			_subErrorID = inSubErrorID;
			_serverURL = inServerURL;
			_domain = inDomain;
		}

	}
}
