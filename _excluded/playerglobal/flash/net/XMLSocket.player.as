/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.DataEvent;
	import flash.events.Event;
	import flash.events.EventDispatcher;
	import flash.events.IOErrorEvent;
	import flash.events.ProgressEvent;
	import flash.events.SecurityErrorEvent;

	public class XMLSocket extends EventDispatcher
	{
		private var _socket:Socket;
		
		public function XMLSocket (host:String=null, port:int=0)
		{
			_socket = new Socket();
			
			if (host) connect(host, port);
		}
		
		public function get connected () : Boolean
		{
			return _socket.connected;
		}

		public function get timeout () : int
		{
			return _socket.timeout;
		}

		public function set timeout (value:int) : void
		{
			_socket.timeout = value;
		}


		public function close () : void
		{
			var timeout:int = _socket.timeout;
			
			_socket.removeEventListener(ProgressEvent.SOCKET_DATA, onSocketDataEvent);
			_socket.removeEventListener(SecurityErrorEvent.SECURITY_ERROR, onSecurityErrorEvent);
			_socket.removeEventListener(IOErrorEvent.IO_ERROR, onIOErrorEvent);
			_socket.removeEventListener(Event.CONNECT, onConnectEvent);
			_socket.removeEventListener(Event.CLOSE, onCloseEvent);
			
			_socket.close();
			
			_socket = new Socket();
			_socket.timeout = timeout;
		}


		public function connect (host:String, port:int) : void
		{
			if (_socket.hasEventListener(Event.CONNECT)) throw new Error('socket connect already called');
			
			_socket.connect(host, port);
			_socket.addEventListener(ProgressEvent.SOCKET_DATA, onSocketDataEvent);
			_socket.addEventListener(SecurityErrorEvent.SECURITY_ERROR, onSecurityErrorEvent);
			_socket.addEventListener(IOErrorEvent.IO_ERROR, onIOErrorEvent);
			_socket.addEventListener(Event.CONNECT, onConnectEvent);
			_socket.addEventListener(Event.CLOSE, onCloseEvent);
		}
		
		private function onSocketDataEvent(event:ProgressEvent):void
		{
			var data:String = _socket.readUTFBytes(_socket.bytesAvailable);
			_socket.readByte();
			
			dispatchEvent(new DataEvent(DataEvent.DATA, false, false, data));
		}
		
		private function onSecurityErrorEvent(event:SecurityErrorEvent):void
		{
			dispatchEvent(new SecurityErrorEvent(SecurityErrorEvent.SECURITY_ERROR, false, false, "XMLSOCKET could not connect to server."));
		}
		
		private function onIOErrorEvent(event:IOErrorEvent):void
		{
			dispatchEvent(new IOErrorEvent(IOErrorEvent.IO_ERROR, false, false, "XMLSOCKET trouble sending and or receiving data."));
		}
		
		private function onConnectEvent(event:Event):void
		{
			dispatchEvent(new Event(Event.CONNECT));	
		}
		
		private function onCloseEvent(event:Event):void
		{
			close();
			dispatchEvent(new Event(Event.CLOSE));	
		}


		public function send (object:*):void
		{
			_socket.writeUTFBytes(object.toString());
			_socket.writeByte(0);
		}
	}
}
