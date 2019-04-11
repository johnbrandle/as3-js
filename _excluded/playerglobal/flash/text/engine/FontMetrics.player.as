/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.geom.Rectangle;

	public final UNIMPLEMENTED class FontMetrics 
	{
		public var emBox : flash.geom.Rectangle;
		public var lineGap : Number;


		public var strikethroughOffset : Number;


		public var strikethroughThickness : Number;


		public var subscriptOffset : Number;


		public var subscriptScale : Number;


		public var superscriptOffset : Number;


		public var superscriptScale : Number;


		public var underlineOffset : Number;


		public var underlineThickness : Number;


		public function FontMetrics (emBox:Rectangle, strikethroughOffset:Number, strikethroughThickness:Number, underlineOffset:Number, underlineThickness:Number, subscriptOffset:Number, subscriptScale:Number, superscriptOffset:Number, superscriptScale:Number, lineGap:Number=0)
		{
			throw new Error('FontMetrics: attempted call to an unimplemented constructor');
		}

	}
}
