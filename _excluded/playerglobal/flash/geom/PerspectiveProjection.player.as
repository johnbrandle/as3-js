/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.geom
{
	import flash.geom.Point;
	import flash.geom.Matrix3D;

	public UNIMPLEMENTED class PerspectiveProjection 
	{
		public function get fieldOfView () : Number
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "fieldOfView"');
		}

		public function set fieldOfView (fieldOfViewAngleInDegrees:Number) : void
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "fieldOfView"');
		}

		public function get focalLength () : Number
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "focalLength"');
		}

		public function set focalLength (value:Number) : void
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "focalLength"');
		}

		public function get projectionCenter () : flash.geom.Point
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "projectionCenter"');
		}

		public function set projectionCenter (p:Point) : void
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "projectionCenter"');
		}

		public function PerspectiveProjection ()
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented constructor');
		}

		public function toMatrix3D () : flash.geom.Matrix3D
		{
			throw new Error('PerspectiveProjection: attempted call to an unimplemented function "toMatrix3D"');
		}

	}
}
