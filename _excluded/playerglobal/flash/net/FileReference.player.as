/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;
	import flash.net.URLRequest;
	import flash.utils.ByteArray;

	public UNIMPLEMENTED class FileReference extends EventDispatcher
	{
		public function get creationDate () : Date
		{
			throw new Error('FileReference: attempted call to an unimplemented function "creationDate"');
		}


		public function get creator () : String
		{
			throw new Error('FileReference: attempted call to an unimplemented function "creator"');
		}

		public function get data () : flash.utils.ByteArray
		{
			throw new Error('FileReference: attempted call to an unimplemented function "data"');
		}

		public function get modificationDate () : Date
		{
			throw new Error('FileReference: attempted call to an unimplemented function "modificationDate"');
		}


		public function get name () : String
		{
			throw new Error('FileReference: attempted call to an unimplemented function "name"');
		}

		public function get size () : Number
		{
			throw new Error('FileReference: attempted call to an unimplemented function "size"');
		}


		public function get type () : String
		{
			throw new Error('FileReference: attempted call to an unimplemented function "type"');
		}


		public function browse (typeFilter:Array=null) : Boolean
		{
			throw new Error('FileReference: attempted call to an unimplemented function "browse"');
		}


		public function cancel () : void
		{
			throw new Error('FileReference: attempted call to an unimplemented function "cancel"');
		}

		public function download (request:URLRequest, defaultFileName:String=null) : void
		{
			throw new Error('FileReference: attempted call to an unimplemented function "download"');
		}

		public function FileReference ()
		{
			throw new Error('FileReference: attempted call to an unimplemented constructor');
		}

		public function load () : void
		{
			throw new Error('FileReference: attempted call to an unimplemented function "load"');
		}

		public function save (data:*, defaultFileName:String=null) : void
		{
			throw new Error('FileReference: attempted call to an unimplemented function "save"');
		}

		public function upload (request:URLRequest, uploadDataFieldName:String="Filedata", testUpload:Boolean=false) : void
		{
			throw new Error('FileReference: attempted call to an unimplemented function "upload"');
		}

	}
}
