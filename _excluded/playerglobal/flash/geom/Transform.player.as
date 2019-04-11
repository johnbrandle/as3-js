/**
 * Copyright (c) 2008-2014 CoreMedia AG, Hamburg. Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this software except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for
 * the specific language governing permissions and limitations under the License.
 */

/**
 * NOTICE: FILE HAS BEEN CHANGED FROM ORIGINAL
 *
 * @contributor	 John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.geom
{
	import flash.display.DisplayObject;
	import flash.geom.ColorTransform;
	import flash.geom.Matrix;
	import flash.geom.Matrix3D;
	import flash.geom.PerspectiveProjection;
	import flash.geom.Rectangle;

	public class Transform 
	{
		private var _displayObject:DisplayObject;
		
		public function Transform (displayObject:DisplayObject)
		{
			_displayObject = displayObject;
		}

		public UNIMPLEMENTED function get colorTransform () : flash.geom.ColorTransform
		{
			//return _colorTransform;
		}

		public UNIMPLEMENTED function set colorTransform (value:ColorTransform) : void
		{
			//_colorTransform = value;
		}

		public UNIMPLEMENTED function get concatenatedColorTransform () : flash.geom.ColorTransform
		{
			/*
			var concCT : ColorTransform = _colorTransform;
			var currentDO : DisplayObject = displayObject.parent;
			while (currentDO)
			{
				concCT.concat(currentDO.transform.colorTransform);
				currentDO = currentDO.parent;
			}
			return colorTransform;
			*/
		}

		public function get concatenatedMatrix () : flash.geom.Matrix
		{
			var concMatrix:Matrix = _displayObject.$__properties().DisplayObjectScope.$_matrix;
			var currentDO:DisplayObject = _displayObject.parent;
			while (currentDO)
			{
				concMatrix.concat(currentDO.transform.matrix);
				currentDO = currentDO.parent;
			}
			return concMatrix;
		}

		public function get matrix () : flash.geom.Matrix
		{
			return _displayObject.$__properties().DisplayObjectScope.$_matrix.clone();
		}

		public UNIMPLEMENTED function set matrix (value:Matrix) : void
		{	
		}

		public UNIMPLEMENTED function get matrix3D () : flash.geom.Matrix3D
		{
			throw new Error('Transform: attempted call to an unimplemented function "matrix3D"');
		}

		public UNIMPLEMENTED function set matrix3D (m:Matrix3D) : void
		{
			throw new Error('Transform: attempted call to an unimplemented function "matrix3D"');
		}

		public UNIMPLEMENTED function get perspectiveProjection () : flash.geom.PerspectiveProjection
		{
			throw new Error('Transform: attempted call to an unimplemented function "perspectiveProjection"');
		}

		public UNIMPLEMENTED function set perspectiveProjection (pm:PerspectiveProjection) : void
		{
			throw new Error('Transform: attempted call to an unimplemented function "perspectiveProjection"');
		}

		public UNIMPLEMENTED function get pixelBounds () : flash.geom.Rectangle
		{
			throw new Error('Transform: attempted call to an unimplemented function "pixelBounds"');
		}

		public UNIMPLEMENTED function getRelativeMatrix3D (relativeTo:DisplayObject) : flash.geom.Matrix3D
		{
			throw new Error('Transform: attempted call to an unimplemented function "getRelativeMatrix3D"');
		}
	}
}
