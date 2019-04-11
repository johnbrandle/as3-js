/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.text.engine.FontDescription;
	import flash.text.engine.ContentElement;
	import flash.text.engine.TextLine;
	import flash.text.engine.TextJustifier;
	import flash.text.engine.TabStop;

	public final UNIMPLEMENTED class TextBlock 
	{

		public var userData : *;


		public function get applyNonLinearFontScaling () : Boolean
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "applyNonLinearFontScaling"');
		}

		public function set applyNonLinearFontScaling (value:Boolean) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "applyNonLinearFontScaling"');
		}


		public function get baselineFontDescription () : flash.text.engine.FontDescription
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "baselineFontDescription"');
		}

		public function set baselineFontDescription (value:FontDescription) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "baselineFontDescription"');
		}


		public function get baselineFontSize () : Number
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "baselineFontSize"');
		}

		public function set baselineFontSize (value:Number) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "baselineFontSize"');
		}


		public function get baselineZero () : String
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "baselineZero"');
		}

		public function set baselineZero (value:String) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "baselineZero"');
		}


		public function get bidiLevel () : int
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "bidiLevel"');
		}

		public function set bidiLevel (value:int) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "bidiLevel"');
		}


		public function get content () : flash.text.engine.ContentElement
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "content"');
		}

		public function set content (value:ContentElement) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "content"');
		}


		public function get firstInvalidLine () : flash.text.engine.TextLine
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "firstInvalidLine"');
		}


		public function get firstLine () : flash.text.engine.TextLine
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "firstLine"');
		}


		public function get lastLine () : flash.text.engine.TextLine
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "lastLine"');
		}


		public function get lineRotation () : String
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "lineRotation"');
		}

		public function set lineRotation (value:String) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "lineRotation"');
		}


		public function get tabStops () : Vector.<flash.text.engine.TabStop>
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "tabStops"');
		}

		public function set tabStops (value:Vector.<TabStop>) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "tabStops"');
		}


		public function get textJustifier () : flash.text.engine.TextJustifier
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "textJustifier"');
		}

		public function set textJustifier (value:TextJustifier) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "textJustifier"');
		}


		public function get textLineCreationResult () : String
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "textLineCreationResult"');
		}


		public function createTextLine (previousLine:TextLine=null, width:Number=1000000, lineOffset:Number=0, fitSomething:Boolean=false) : flash.text.engine.TextLine
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "createTextLine"');
		}

		public function dump () : String
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "dump"');
		}


		public function findNextAtomBoundary (afterCharIndex:int) : int
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "findNextAtomBoundary"');
		}


		public function findNextWordBoundary (afterCharIndex:int) : int
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "findNextWordBoundary"');
		}


		public function findPreviousAtomBoundary (beforeCharIndex:int) : int
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "findPreviousAtomBoundary"');
		}


		public function findPreviousWordBoundary (beforeCharIndex:int) : int
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "findPreviousWordBoundary"');
		}


		public function getTextLineAtCharIndex (charIndex:int) : flash.text.engine.TextLine
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "getTextLineAtCharIndex"');
		}


		public function recreateTextLine (textLine:TextLine, previousLine:TextLine=null, width:Number=1000000, lineOffset:Number=0, fitSomething:Boolean=false) : flash.text.engine.TextLine
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "recreateTextLine"');
		}


		public function releaseLineCreationData () : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "releaseLineCreationData"');
		}


		public function releaseLines (firstLine:TextLine, lastLine:TextLine) : void
		{
			throw new Error('TextBlock: attempted call to an unimplemented function "releaseLines"');
		}


		public function TextBlock (content:ContentElement=null, tabStops:Vector.<flash.text.engine.TabStop>=null, textJustifier:TextJustifier=null, lineRotation:String="rotate0", baselineZero:String="roman", bidiLevel:int=0, applyNonLinearFontScaling:Boolean=true, baselineFontDescription:FontDescription=null, baselineFontSize:Number=12)
		{
			throw new Error('TextBlock: attempted call to an unimplemented constructor');
		}

	}
}
