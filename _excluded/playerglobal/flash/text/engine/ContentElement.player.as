/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.text.engine.TextBlock;
	import flash.text.engine.ElementFormat;
	import flash.events.EventDispatcher;
	import flash.text.engine.GroupElement;

	public UNIMPLEMENTED class ContentElement 
	{

		public static const GRAPHIC_ELEMENT : uint = 0xFDEF;


		public var userData : *;


		public function get elementFormat () : flash.text.engine.ElementFormat
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "elementFormat"');
		}

		public function set elementFormat (value:ElementFormat) : void
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "elementFormat"');
		}


		public function get eventMirror () : flash.events.EventDispatcher
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "eventMirror"');
		}

		public function set eventMirror (value:EventDispatcher) : void
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "eventMirror"');
		}


		public function get groupElement () : flash.text.engine.GroupElement
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "groupElement"');
		}


		public function get rawText () : String
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "rawText"');
		}


		public function get text () : String
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "text"');
		}


		public function get textBlock () : flash.text.engine.TextBlock
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "textBlock"');
		}


		public function get textBlockBeginIndex () : int
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "textBlockBeginIndex"');
		}


		public function get textRotation () : String
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "textRotation"');
		}

		public function set textRotation (value:String) : void
		{
			throw new Error('ContentElement: attempted call to an unimplemented function "textRotation"');
		}


		public function ContentElement (elementFormat:ElementFormat=null, eventMirror:EventDispatcher=null, textRotation:String="rotate0")
		{
			throw new Error('ContentElement: attempted call to an unimplemented constructor');
		}

	}
}
