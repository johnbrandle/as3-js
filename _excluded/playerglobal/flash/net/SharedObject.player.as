/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;
	import flash.net.NetConnection;
	
	
	
	public class SharedObject extends EventDispatcher
	{
		protected var $_name:String;
		protected var $_localPath:String;
		protected var $_secure:Boolean;
		protected var $_data:Object = {};
		protected static var $_dataAssociations:Object = {};
		

		public UNIMPLEMENTED function get client () : Object
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "client"');
		}

		public UNIMPLEMENTED function set client (object:Object) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "client"');
		}

		public function get data () : Object
		{
			return $_data;
		}


		public UNIMPLEMENTED static function get defaultObjectEncoding () : uint
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "defaultObjectEncoding"');
		}

		public UNIMPLEMENTED static function set defaultObjectEncoding (version:uint) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "defaultObjectEncoding"');
		}


		public UNIMPLEMENTED function set fps (updatesPerSecond:Number) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "fps"');
		}


		public UNIMPLEMENTED function get objectEncoding () : uint
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "objectEncoding"');
		}

		public UNIMPLEMENTED function set objectEncoding (version:uint) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "objectEncoding"');
		}


		public UNIMPLEMENTED function get size () : uint
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "size"');
		}


		public function clear () : void
		{
			//$_data = { };
			for (var prop:* in $_data)
			{
				delete $_data[prop];
			}
			
			$_deleteCookie($_name + "___" + $_localPath);
		}


		public UNIMPLEMENTED function close () : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "close"');
		}

		public UNIMPLEMENTED function connect (myConnection:NetConnection, params:String=null) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "connect"');
		}

		public UNIMPLEMENTED static function deleteAll (url:String) : int
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "deleteAll"');
		}


		public function flush (minDiskSpace:int=0):String
		{
			return $_setCookie($_name + "___" + $_localPath, JSON.stringify($_data), 99999);
		}

		public UNIMPLEMENTED static function getDiskUsage (url:String) : int
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "getDiskUsage"');
		}


		public static function getLocal (name:String, localPath:String=null, secure:Boolean=false) : flash.net.SharedObject
		{
			return new SharedObject(name,localPath, secure); 
		}


		public UNIMPLEMENTED static function getRemote (name:String, remotePath:String=null, persistence:Object=false, secure:Boolean=false) : flash.net.SharedObject
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "getRemote"');
		}


		public UNIMPLEMENTED function send (...rest) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "send"');
		}


		public UNIMPLEMENTED function setDirty (propertyName:String) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "setDirty"');
		}


		public UNIMPLEMENTED function setProperty (propertyName:String, value:Object=null) : void
		{
			throw new Error('SharedObject: attempted call to an unimplemented function "setProperty"');
		}

		public function SharedObject (name:String ="", localPath:String="", secure:Boolean=false)
		{
			$_name = name;
			$_localPath = localPath != null ?  localPath : "";
			$_secure = secure;
			
			if ($_dataAssociations[name + "___" + $_localPath])
			{
				$_data = $_dataAssociations[name + "___" + $_localPath];
				return;
			}
			
			var cookie:String = $_getCookie(name + "___" + $_localPath);
			if (cookie != null)
			{
				$_data = JSON.parse(cookie);
			}
			else
			{
				$_data = {};
			}
			$_dataAssociations[name + "___" + $_localPath] = $_data;
		}
		
		protected static function $_setCookie(cookie_name:String, cookie_value:String, extendDays:int=-1):String
		{
			var exdate:Date = new Date();
			
			exdate.setDate(exdate.getDate() + extendDays);
			var c_value:String = escape(cookie_value) + ((extendDays == -1) ? "" : "; expires=" + exdate.toUTCString());
			
			return document.cookie = cookie_name + "=" + c_value;
		}
		
		protected static function $_deleteCookie(name:String):void
		{
			document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
		
		protected static function $_getCookie(name:String):String
		{
			var nameEQ:String = name + "=";
			var ca:Array = document.cookie.split(';');
			for (var i:int = 0; i < ca.length; i++) 
			{
				var c:String = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1, c.length);
				if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
			}
			
			return null;
		}
	}
}