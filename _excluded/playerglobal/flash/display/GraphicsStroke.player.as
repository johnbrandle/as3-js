/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.IGraphicsFill;

	public final UNIMPLEMENTED class GraphicsStroke  implements IGraphicsStroke, IGraphicsData
	{
		public var fill : flash.display.IGraphicsFill;
		public var miterLimit : Number;
		public var pixelHinting : Boolean;
		public var thickness : Number;

		public function get caps () : String
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented function "caps"');
		}

		public function set caps (value:String) : void
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented function "caps"');
		}

		public function get joints () : String
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented function "joints"');
		}

		public function set joints (value:String) : void
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented function "joints"');
		}

		public function get scaleMode () : String
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented function "scaleMode"');
		}

		public function set scaleMode (value:String) : void
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented function "scaleMode"');
		}

		public function GraphicsStroke (thickness:Number=NaN, pixelHinting:Boolean=false, scaleMode:String="normal", caps:String="none", joints:String="round", miterLimit:Number=3, fill:IGraphicsFill=null)
		{
			throw new Error('GraphicsStroke: attempted call to an unimplemented constructor');
		}

	}
}
