/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.text.engine.ContentElement;
	import flash.text.engine.GroupElement;
	import flash.text.engine.TextElement;
	import flash.text.engine.ElementFormat;
	import flash.events.EventDispatcher;

	public final UNIMPLEMENTED class GroupElement extends ContentElement
	{

		public function get elementCount () : int
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "elementCount"');
		}


		public function getElementAt (index:int) : flash.text.engine.ContentElement
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "getElementAt"');
		}


		public function getElementAtCharIndex (charIndex:int) : flash.text.engine.ContentElement
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "getElementAtCharIndex"');
		}


		public function getElementIndex (element:ContentElement) : int
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "getElementIndex"');
		}


		public function GroupElement (elements:Vector.<flash.text.engine.ContentElement>=null, elementFormat:ElementFormat=null, eventMirror:EventDispatcher=null, textRotation:String="rotate0")
		{
			throw new Error('GroupElement: attempted call to an unimplemented constructor');
		}


		public function groupElements (beginIndex:int, endIndex:int) : flash.text.engine.GroupElement
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "groupElements"');
		}


		public function mergeTextElements (beginIndex:int, endIndex:int) : flash.text.engine.TextElement
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "mergeTextElements"');
		}


		public function replaceElements (beginIndex:int, endIndex:int, newElements:Vector.<flash.text.engine.ContentElement>) : Vector.<flash.text.engine.ContentElement>
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "replaceElements"');
		}


		public function setElements (value:Vector.<flash.text.engine.ContentElement>) : void
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "setElements"');
		}


		public function splitTextElement (elementIndex:int, splitIndex:int) : flash.text.engine.TextElement
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "splitTextElement"');
		}


		public function ungroupElements (groupIndex:int) : void
		{
			throw new Error('GroupElement: attempted call to an unimplemented function "ungroupElements"');
		}

	}
}
