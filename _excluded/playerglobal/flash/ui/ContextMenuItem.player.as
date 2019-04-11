/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.ui
{
	import flash.display.NativeMenuItem;
	import flash.ui.ContextMenuItem;

	public final UNIMPLEMENTED class ContextMenuItem extends NativeMenuItem
	{

		public function get caption () : String
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "caption"');
		}

		public function set caption (value:String) : void
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "caption"');
		}


		public function get separatorBefore () : Boolean
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "separatorBefore"');
		}

		public function set separatorBefore (value:Boolean) : void
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "separatorBefore"');
		}


		public function get visible () : Boolean
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "visible"');
		}

		public function set visible (value:Boolean) : void
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "visible"');
		}

		/// Creates a copy of the NativeMenuItem object.
		public function clone () : flash.display.NativeMenuItem
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented function "clone"');
		}


		public function ContextMenuItem (caption:String, separatorBefore:Boolean=false, enabled:Boolean=true, visible:Boolean=true)
		{
			throw new Error('ContextMenuItem: attempted call to an unimplemented constructor');
		}

	}
}
