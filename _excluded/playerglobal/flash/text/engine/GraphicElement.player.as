/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.display.DisplayObject;
	import flash.text.engine.ElementFormat;
	import flash.events.EventDispatcher;

	public final UNIMPLEMENTED class GraphicElement extends ContentElement
	{

		public function get elementHeight () : Number
		{
			throw new Error('GraphicElement: attempted call to an unimplemented function "elementHeight"');
		}

		public function set elementHeight (value:Number) : void
		{
			throw new Error('GraphicElement: attempted call to an unimplemented function "elementHeight"');
		}


		public function get elementWidth () : Number
		{
			throw new Error('GraphicElement: attempted call to an unimplemented function "elementWidth"');
		}

		public function set elementWidth (value:Number) : void
		{
			throw new Error('GraphicElement: attempted call to an unimplemented function "elementWidth"');
		}


		public function get graphic () : flash.display.DisplayObject
		{
			throw new Error('GraphicElement: attempted call to an unimplemented function "graphic"');
		}

		public function set graphic (value:DisplayObject) : void
		{
			throw new Error('GraphicElement: attempted call to an unimplemented function "graphic"');
		}


		public function GraphicElement (graphic:DisplayObject=null, elementWidth:Number=15, elementHeight:Number=15, elementFormat:ElementFormat=null, eventMirror:EventDispatcher=null, textRotation:String="rotate0")
		{
			throw new Error('GraphicElement: attempted call to an unimplemented constructor');
		}

	}
}
