/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.geom
{
	import flash.geom.Vector3D;

	public UNIMPLEMENTED class Matrix3D 
	{
		public function get determinant () : Number
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "determinant"');
		}

		public function get position () : flash.geom.Vector3D
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "position"');
		}

		public function set position (pos:Vector3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "position"');
		}

		public function get rawData () : Vector.<Number>
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "rawData"');
		}

		public function set rawData (v:Vector.<Number>) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "rawData"');
		}

		public function append (lhs:Matrix3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "append"');
		}

		public function appendRotation (degrees:Number, axis:Vector3D, pivotPoint:Vector3D=null) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "appendRotation"');
		}

		public function appendScale (xScale:Number, yScale:Number, zScale:Number) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "appendScale"');
		}

		public function appendTranslation (x:Number, y:Number, z:Number) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "appendTranslation"');
		}

		public function clone () : flash.geom.Matrix3D
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "clone"');
		}

		public function copyColumnFrom (column:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyColumnFrom"');
		}

		public function copyColumnTo (column:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyColumnTo"');
		}

		public function copyFrom (sourceMatrix3D:Matrix3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyFrom"');
		}

		public function copyRawDataFrom (vector:Vector.<Number>, index:uint=0, transpose:Boolean=false) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyRawDataFrom"');
		}

		public function copyRawDataTo (vector:Vector.<Number>, index:uint=0, transpose:Boolean=false) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyRawDataTo"');
		}

		public function copyRowFrom (row:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyRowFrom"');
		}

		public function copyRowTo (row:uint, vector3D:Vector3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyRowTo"');
		}

		public function copyToMatrix3D (dest:Matrix3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "copyToMatrix3D"');
		}

		public function decompose (orientationStyle:String="eulerAngles") : Vector.<flash.geom.Vector3D>
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "decompose"');
		}

		public function deltaTransformVector (v:Vector3D) : flash.geom.Vector3D
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "deltaTransformVector"');
		}

		public function identity () : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "identity"');
		}

		public static function interpolate (thisMat:Matrix3D, toMat:Matrix3D, percent:Number) : flash.geom.Matrix3D
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "interpolate"');
		}

		public function interpolateTo (toMat:Matrix3D, percent:Number) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "interpolateTo"');
		}

		public function invert () : Boolean
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "invert"');
		}

		public function Matrix3D (v:Vector.<Number>=null)
		{
			throw new Error('Matrix3D: attempted call to an unimplemented constructor');
		}

		public function pointAt (pos:Vector3D, at:Vector3D=null, up:Vector3D=null) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "pointAt"');
		}

		public function prepend (rhs:Matrix3D) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "prepend"');
		}

		public function prependRotation (degrees:Number, axis:Vector3D, pivotPoint:Vector3D=null) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "prependRotation"');
		}

		public function prependScale (xScale:Number, yScale:Number, zScale:Number) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "prependScale"');
		}

		public function prependTranslation (x:Number, y:Number, z:Number) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "prependTranslation"');
		}

		public function recompose (components:Vector.<flash.geom.Vector3D>, orientationStyle:String="eulerAngles") : Boolean
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "recompose"');
		}

		public function transformVector (v:Vector3D) : flash.geom.Vector3D
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "transformVector"');
		}

		public function transformVectors (vin:Vector.<Number>, vout:Vector.<Number>) : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "transformVectors"');
		}

		public function transpose () : void
		{
			throw new Error('Matrix3D: attempted call to an unimplemented function "transpose"');
		}

	}
}
