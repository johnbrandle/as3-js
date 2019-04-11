/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.ime
{
	public final UNIMPLEMENTED class CompositionAttributeRange 
	{

		public var converted : Boolean;


		public var relativeEnd : int;


		public var relativeStart : int;


		public var selected : Boolean;


		public function CompositionAttributeRange (relativeStart:int, relativeEnd:int, selected:Boolean, converted:Boolean)
		{
			throw new Error('CompositionAttributeRange: attempted call to an unimplemented constructor');
		}

	}
}
