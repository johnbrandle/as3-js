/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.text.engine.ElementFormat;
	import flash.events.EventDispatcher;

	public final UNIMPLEMENTED class TextElement extends ContentElement
	{

		public function set text (value:String) : void
		{
			throw new Error('TextElement: attempted call to an unimplemented function "text"');
		}


		public function replaceText (beginIndex:int, endIndex:int, newText:String) : void
		{
			throw new Error('TextElement: attempted call to an unimplemented function "replaceText"');
		}


		public function TextElement (text:String=null, elementFormat:ElementFormat=null, eventMirror:EventDispatcher=null, textRotation:String="rotate0")
		{
			throw new Error('TextElement: attempted call to an unimplemented constructor');
		}

	}
}
