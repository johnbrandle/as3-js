/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.ime
{
	import flash.text.ime.CompositionAttributeRange;
	import flash.geom.Rectangle;

	public interface IIMEClient
	{
		function get compositionEndIndex () : int;

		function get compositionStartIndex () : int;

		function get selectionActiveIndex () : int;

		function get selectionAnchorIndex () : int;

		function get verticalTextLayout () : Boolean;

		function confirmComposition (text:String=null, preserveSelection:Boolean=false) : void;

		function getTextBounds (startIndex:int, endIndex:int) : flash.geom.Rectangle;

		function getTextInRange (startIndex:int, endIndex:int) : String;

		function selectRange (anchorIndex:int, activeIndex:int) : void;

		function updateComposition (text:String, attributes:Vector.<flash.text.ime.CompositionAttributeRange>, compositionStartIndex:int, compositionEndIndex:int) : void;
	}
}
