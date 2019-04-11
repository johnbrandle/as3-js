/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.net
{
	import flash.events.EventDispatcher;

	public UNIMPLEMENTED class FileReferenceList extends EventDispatcher
	{
		public function get fileList () : Array
		{
			throw new Error('FileReferenceList: attempted call to an unimplemented function "fileList"');
		}

		public function browse (typeFilter:Array=null) : Boolean
		{
			throw new Error('FileReferenceList: attempted call to an unimplemented function "browse"');
		}

		public function FileReferenceList ()
		{
			throw new Error('FileReferenceList: attempted call to an unimplemented constructor');
		}

	}
}
