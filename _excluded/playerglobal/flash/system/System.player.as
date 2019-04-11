/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	import flash.system.IME;
	
	
	public final class System 
	{
		public UNIMPLEMENTED static function get freeMemory () : Number
		{
			throw new Error('System: attempted call to an unimplemented function "freeMemory"');
		}


		public UNIMPLEMENTED static function get ime () : flash.system.IME
		{
			throw new Error('System: attempted call to an unimplemented function "ime"');
		}


		public UNIMPLEMENTED static function get privateMemory () : Number
		{
			throw new Error('System: attempted call to an unimplemented function "privateMemory"');
		}

		public UNIMPLEMENTED static function get processCPUUsage () : Number
		{
			throw new Error('System: attempted call to an unimplemented function "processCPUUsage"');
		}


		public UNIMPLEMENTED static function get totalMemory () : uint
		{
			throw new Error('System: attempted call to an unimplemented function "totalMemory"');
		}


		public UNIMPLEMENTED static function get totalMemoryNumber () : Number
		{
			throw new Error('System: attempted call to an unimplemented function "totalMemoryNumber"');
		}


		public UNIMPLEMENTED static function get useCodePage () : Boolean
		{
			throw new Error('System: attempted call to an unimplemented function "useCodePage"');
		}

		public UNIMPLEMENTED static function set useCodePage (value:Boolean) : void
		{
			throw new Error('System: attempted call to an unimplemented function "useCodePage"');
		}

		public UNIMPLEMENTED static function get vmVersion () : String
		{
			throw new Error('System: attempted call to an unimplemented function "vmVersion"');
		}


		public UNIMPLEMENTED static function disposeXML (node:XML) : void
		{
			throw new Error('System: attempted call to an unimplemented function "disposeXML"');
		}


		public UNIMPLEMENTED static function exit (code:uint) : void
		{
			throw new Error('System: attempted call to an unimplemented function "exit"');
		}


		public UNIMPLEMENTED static function gc () : void
		{
			throw new Error('System: attempted call to an unimplemented function "gc"');
		}


		public UNIMPLEMENTED static function pause () : void
		{
			throw new Error('System: attempted call to an unimplemented function "pause"');
		}

		public UNIMPLEMENTED static function pauseForGCIfCollectionImminent (imminence:Number=0.75) : void
		{
			throw new Error('System: attempted call to an unimplemented function "pauseForGCIfCollectionImminent"');
		}


		public UNIMPLEMENTED static function resume () : void
		{
			throw new Error('System: attempted call to an unimplemented function "resume"');
		}


		public static function setClipboard (string:String) : void
		{
			if (window.mobile) window.prompt('Press and hold over highlighted text, and then press copy.', string);
			else window.prompt('Press Ctrl+C or Cmd+C, and then click OK.', string);
		}

		public function System ()
		{
			throw new Error('System: attempted call to an unimplemented constructor');
		}

	}
}
