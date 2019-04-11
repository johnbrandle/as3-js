/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text.engine
{
	import flash.text.engine.TextLine;
	import flash.text.engine.TextLineMirrorRegion;
	import flash.events.EventDispatcher;
	import flash.text.engine.ContentElement;
	import flash.geom.Rectangle;

	public final UNIMPLEMENTED class TextLineMirrorRegion 
	{

		public function get bounds () : flash.geom.Rectangle
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented function "bounds"');
		}


		public function get element () : flash.text.engine.ContentElement
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented function "element"');
		}


		public function get mirror () : flash.events.EventDispatcher
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented function "mirror"');
		}


		public function get nextRegion () : flash.text.engine.TextLineMirrorRegion
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented function "nextRegion"');
		}


		public function get previousRegion () : flash.text.engine.TextLineMirrorRegion
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented function "previousRegion"');
		}


		public function get textLine () : flash.text.engine.TextLine
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented function "textLine"');
		}

		public function TextLineMirrorRegion ()
		{
			throw new Error('TextLineMirrorRegion: attempted call to an unimplemented constructor');
		}

	}
}
