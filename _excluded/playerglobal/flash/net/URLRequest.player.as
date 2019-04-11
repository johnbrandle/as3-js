/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	public final class URLRequest 
	{
		
		private var _method:String;
		private var _url:String;
		private var _requestHeaders:Array;
		private var _digest:String;
		private var _data:Object;
		private var _contentType:String;
		
		

		public function URLRequest (url:String=null)
		{
			_method = URLRequestMethod.GET;
			_url = url;
		}

		public function get contentType () : String
		{
			return _contentType;
		}

		public function set contentType (value:String) : void
		{
			_contentType = value;
		}

		public function get data () : Object
		{
			return _data;
		}

		public function set data (value:Object) : void
		{
			_data = value;
		}


		public function get digest () : String
		{
			return _digest;
		}


		public function set digest (value:String) : void
		{
			_digest = value;
		}


		public function get method () : String
		{
			return _method;
		}

		public function set method (value:String) : void
		{
			_method = value;
		}

		public function get requestHeaders () : Array
		{
			return _requestHeaders;
		}

		public function set requestHeaders (value:Array) : void
		{
			_requestHeaders = value;
		}

		public function get url () : String
		{
			return _url;
		}

		public function set url (value:String) : void
		{
			_url = value;
		}
	}
}
