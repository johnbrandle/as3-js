/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	public final UNIMPLEMENTED class GraphicsPath  implements IGraphicsPath, IGraphicsData
	{
		public var commands : Vector.<int>;
		public var data : Vector.<Number>;

		public function get winding () : String
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "winding"');
		}

		public function set winding (value:String) : void
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "winding"');
		}

		public function curveTo (controlX:Number, controlY:Number, anchorX:Number, anchorY:Number) : void
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "curveTo"');
		}

		public function GraphicsPath (commands:Vector.<int>=null, data:Vector.<Number>=null, winding:String="evenOdd")
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented constructor');
		}

		public function lineTo (x:Number, y:Number) : void
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "lineTo"');
		}

		public function moveTo (x:Number, y:Number) : void
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "moveTo"');
		}

		public function wideLineTo (x:Number, y:Number) : void
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "wideLineTo"');
		}
		public function wideMoveTo (x:Number, y:Number) : void
		{
			throw new Error('GraphicsPath: attempted call to an unimplemented function "wideMoveTo"');
		}

	}
}
