/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.utils.ByteArray;

	public UNIMPLEMENTED class DRMAuthenticationCompleteEvent extends Event
	{
		private var _domain:String;
		private var _serverURL:String;
		private var _token:ByteArray;

		public static const AUTHENTICATION_COMPLETE:String = "authenticationComplete";

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

		public function get token():ByteArray
		{
			return _token;
		}

		public function set token(value:ByteArray):void
		{
			_token = value;
		}

		override public function clone():Event
		{
			return new DRMAuthenticationCompleteEvent(type, bubbles, cancelable, serverURL, domain, token);
		}

		public function DRMAuthenticationCompleteEvent(type:String, bubbles:Boolean = false, cancelable:Boolean = false, inServerURL:String = null, inDomain:String = null, inToken:ByteArray = null)
		{
			super(type, bubbles, cancelable);
			_serverURL = inServerURL;
			_domain = inDomain;
			_token = inToken;
		}

	}
}
