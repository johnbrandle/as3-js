/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text
{
	public UNIMPLEMENTED class TextSnapshot 
	{

		public function get charCount () : int
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "charCount"');
		}


		public function findText (beginIndex:int, textToFind:String, caseSensitive:Boolean) : int
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "findText"');
		}


		public function getSelected (beginIndex:int, endIndex:int) : Boolean
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "getSelected"');
		}


		public function getSelectedText (includeLineEndings:Boolean=false) : String
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "getSelectedText"');
		}


		public function getText (beginIndex:int, endIndex:int, includeLineEndings:Boolean=false) : String
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "getText"');
		}

		public function getTextRunInfo (beginIndex:int, endIndex:int) : Array
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "getTextRunInfo"');
		}


		public function hitTestTextNearPos (x:Number, y:Number, maxDistance:Number=0) : Number
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "hitTestTextNearPos"');
		}


		public function setSelectColor (hexColor:uint=16776960) : void
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "setSelectColor"');
		}


		public function setSelected (beginIndex:int, endIndex:int, select:Boolean) : void
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented function "setSelected"');
		}

		public function TextSnapshot ()
		{
			throw new Error('TextSnapshot: attempted call to an unimplemented constructor');
		}

	}
}
