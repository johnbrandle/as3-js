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
	public class ColorTransform 
	{
		public var alphaMultiplier : Number;
		public var alphaOffset : Number;
		public var blueMultiplier : Number;
		public var blueOffset : Number;
		public var greenMultiplier : Number;
		public var greenOffset : Number;
		public var redMultiplier : Number;
		public var redOffset : Number;

		public function get color () : uint
		{
			return redOffset << 16 | greenOffset << 8 | blueOffset;
		}

		public function set color (newColor:uint) : void
		{
			redOffset = newColor >> 16 & 0xFF;
			greenOffset = newColor >> 8 & 0xFF;
			blueOffset = newColor & 0xFF;
			redMultiplier = greenMultiplier = blueMultiplier = 1;
		}

		public function ColorTransform (redMultiplier:Number=1, greenMultiplier:Number=1, blueMultiplier:Number=1, alphaMultiplier:Number=1, redOffset:Number=0, greenOffset:Number=0, blueOffset:Number=0, alphaOffset:Number=0)
		{
			this.redMultiplier = redMultiplier;
			this.greenMultiplier = greenMultiplier;
			this.blueMultiplier = blueMultiplier;
			this.alphaMultiplier = alphaMultiplier;
			this.redOffset = redOffset;
			this.greenOffset = greenOffset;
			this.blueOffset = blueOffset;
			this.alphaOffset = alphaOffset;
		}

		public function concat (second:ColorTransform) : void
		{
			redMultiplier *= second.redMultiplier;
			greenMultiplier *= second.greenMultiplier;
			blueMultiplier *= second.blueMultiplier;
			alphaMultiplier *= second.alphaMultiplier;
			redOffset += second.redOffset;
			greenOffset += second.greenOffset;
			blueOffset += second.blueOffset;
			alphaOffset += second.alphaOffset;
		}

		public function toString () : String
		{
			return "[ColorTransform(" + [redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset].join(", ") + ")]";
		}
	}
}
