/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.display.Shader;
	import flash.geom.Matrix;

	public final UNIMPLEMENTED class GraphicsShaderFill  implements IGraphicsFill, IGraphicsData
	{
		public var matrix : flash.geom.Matrix;
		public var shader : flash.display.Shader;

		public function GraphicsShaderFill (shader:Shader=null, matrix:Matrix=null)
		{
			throw new Error('GraphicsShaderFill: attempted call to an unimplemented constructor');
		}

	}
}
