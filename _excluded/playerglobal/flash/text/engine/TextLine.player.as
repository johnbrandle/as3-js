/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.display.DisplayObjectContainer;
	import flash.text.engine.TextBlock;
	import flash.text.engine.TextLine;
	import flash.text.engine.TextLineMirrorRegion;
	import flash.events.EventDispatcher;
	import flash.geom.Rectangle;
	import flash.display.DisplayObject;
	import flash.ui.ContextMenu;

	public final UNIMPLEMENTED class TextLine extends DisplayObjectContainer
	{

		public static const MAX_LINE_WIDTH : int = 1000000;


		public var userData : *;


		public function get ascent () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "ascent"');
		}


		public function get atomCount () : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "atomCount"');
		}

		public function set contextMenu (value:ContextMenu) : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "contextMenu"');
		}


		public function get descent () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "descent"');
		}

		public function set focusRect (focusRect:Object) : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "focusRect"');
		}


		public function get hasGraphicElement () : Boolean
		{
			throw new Error('TextLine: attempted call to an unimplemented function "hasGraphicElement"');
		}


		public function get hasTabs () : Boolean
		{
			throw new Error('TextLine: attempted call to an unimplemented function "hasTabs"');
		}


		public function get mirrorRegions () : Vector.<flash.text.engine.TextLineMirrorRegion>
		{
			throw new Error('TextLine: attempted call to an unimplemented function "mirrorRegions"');
		}


		public function get nextLine () : flash.text.engine.TextLine
		{
			throw new Error('TextLine: attempted call to an unimplemented function "nextLine"');
		}


		public function get previousLine () : flash.text.engine.TextLine
		{
			throw new Error('TextLine: attempted call to an unimplemented function "previousLine"');
		}


		public function get rawTextLength () : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "rawTextLength"');
		}


		public function get specifiedWidth () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "specifiedWidth"');
		}

		public function set tabChildren (enable:Boolean) : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "tabChildren"');
		}

		public function set tabEnabled (enabled:Boolean) : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "tabEnabled"');
		}

		public function set tabIndex (index:int) : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "tabIndex"');
		}


		public function get textBlock () : flash.text.engine.TextBlock
		{
			throw new Error('TextLine: attempted call to an unimplemented function "textBlock"');
		}


		public function get textBlockBeginIndex () : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "textBlockBeginIndex"');
		}

		public function get textHeight () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "textHeight"');
		}


		public function get textWidth () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "textWidth"');
		}


		public function get totalAscent () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "totalAscent"');
		}


		public function get totalDescent () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "totalDescent"');
		}


		public function get totalHeight () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "totalHeight"');
		}


		public function get unjustifiedTextWidth () : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "unjustifiedTextWidth"');
		}


		public function get validity () : String
		{
			throw new Error('TextLine: attempted call to an unimplemented function "validity"');
		}

		public function set validity (value:String) : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "validity"');
		}

		public function dump () : String
		{
			throw new Error('TextLine: attempted call to an unimplemented function "dump"');
		}


		public function flushAtomData () : void
		{
			throw new Error('TextLine: attempted call to an unimplemented function "flushAtomData"');
		}


		public function getAtomBidiLevel (atomIndex:int) : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomBidiLevel"');
		}


		public function getAtomBounds (atomIndex:int) : flash.geom.Rectangle
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomBounds"');
		}


		public function getAtomCenter (atomIndex:int) : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomCenter"');
		}


		public function getAtomGraphic (atomIndex:int) : flash.display.DisplayObject
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomGraphic"');
		}


		public function getAtomIndexAtCharIndex (charIndex:int) : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomIndexAtCharIndex"');
		}


		public function getAtomIndexAtPoint (stageX:Number, stageY:Number) : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomIndexAtPoint"');
		}


		public function getAtomTextBlockBeginIndex (atomIndex:int) : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomTextBlockBeginIndex"');
		}


		public function getAtomTextBlockEndIndex (atomIndex:int) : int
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomTextBlockEndIndex"');
		}


		public function getAtomTextRotation (atomIndex:int) : String
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomTextRotation"');
		}


		public function getAtomWordBoundaryOnLeft (atomIndex:int) : Boolean
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getAtomWordBoundaryOnLeft"');
		}


		public function getBaselinePosition (baseline:String) : Number
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getBaselinePosition"');
		}


		public function getMirrorRegion (mirror:EventDispatcher) : flash.text.engine.TextLineMirrorRegion
		{
			throw new Error('TextLine: attempted call to an unimplemented function "getMirrorRegion"');
		}

		public function TextLine ()
		{
			throw new Error('TextLine: attempted call to an unimplemented constructor');
		}

	}
}
