/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.printing
{
	import flash.display.Sprite;
	import flash.events.EventDispatcher;
	import flash.geom.Rectangle;
	import flash.printing.PrintJobOptions;
	
	

	public class PrintJob extends EventDispatcher
	{
		private var $_pages:Array = [];

		public function PrintJob()
		{
		}
		

		public static function get isSupported():Boolean
		{
			return true;
		}


		public UNIMPLEMENTED function get orientation () : String
		{
			throw new Error('PrintJob: attempted call to an unimplemented function "orientation"');
		}


		public UNIMPLEMENTED function get pageHeight () : int
		{
			throw new Error('PrintJob: attempted call to an unimplemented function "pageHeight"');
		}


		public UNIMPLEMENTED function get pageWidth () : int
		{
			throw new Error('PrintJob: attempted call to an unimplemented function "pageWidth"');
		}


		public UNIMPLEMENTED function get paperHeight () : int
		{
			throw new Error('PrintJob: attempted call to an unimplemented function "paperHeight"');
		}


		public UNIMPLEMENTED function get paperWidth () : int
		{
			throw new Error('PrintJob: attempted call to an unimplemented function "paperWidth"');
		}

		public function addPage(sprite:Sprite, printArea:Rectangle=null, options:PrintJobOptions=null, frameNum:int=0):void
		{
			$_pages.push({sprite:sprite, printArea:printArea, options:options, frameNum:frameNum});
		}

		public function send():void
		{
			for (var i:int = $_pages.length; i--;) $_pages[i].sprite.$__domView.classList.add('printable');
			
			window.print();
		}

		public function start():Boolean
		{
			var nodes:* = window.document.querySelectorAll('.printable');
			
			for (var i:Number = nodes.length; i--;) nodes[i].classList.remove('printable');
			
			return true;
		}
	}
}
