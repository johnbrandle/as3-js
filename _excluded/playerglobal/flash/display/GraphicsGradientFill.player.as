/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.geom.Matrix;

	public final UNIMPLEMENTED class GraphicsGradientFill  implements IGraphicsFill, IGraphicsData
	{
		public var alphas : Array;
		public var colors : Array;
		public var focalPointRatio : Number;
		public var matrix : flash.geom.Matrix;
		public var ratios : Array;

		public function get interpolationMethod () : String
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented function "interpolationMethod"');
		}

		public function set interpolationMethod (value:String) : void
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented function "interpolationMethod"');
		}

		public function get spreadMethod () : String
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented function "spreadMethod"');
		}

		public function set spreadMethod (value:String) : void
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented function "spreadMethod"');
		}

		public function get type () : String
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented function "type"');
		}

		public function set type (value:String) : void
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented function "type"');
		}

		public function GraphicsGradientFill (type:String="linear", colors:Array=null, alphas:Array=null, ratios:Array=null, matrix:*=null, spreadMethod:*="pad", interpolationMethod:String="rgb", focalPointRatio:Number=0)
		{
			throw new Error('GraphicsGradientFill: attempted call to an unimplemented constructor');
		}

	}
}
