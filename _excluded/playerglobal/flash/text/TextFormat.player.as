/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text
{
	public  class TextFormat 
	{
		public var _url:String;
		private var _align:String = TextFormatAlign.LEFT;
		private var _blockIndent:Object;
		private var _bold:Object;
		private var _bullet:Object;
		private var _color:Object;
		private var _display:String;
		private var _indent:Object;
		private var _font:String;
		private var _italic:Object;
		private var _leading:Object;
		private var _kerning:Object;
		private var _leftMargin:Object;
		private var _letterSpacing:Object;
		private var _rightMargin:Object;
		private var _size:Object;
		private var _tabStops:Array;
		private var _target:String;
		private var _underline:Object;
		
		

		public function TextFormat(font:String=null, size:Object=null, color:Object=null, bold:Object=null, italic:Object=null, underline:Object=null, url:String=null, target:String=null, align:String=null, leftMargin:Object=null, rightMargin:Object=null, indent:Object=null, leading:Object=null)
		{
			_font =  font;
			_size =  size;
			_color =  color;
			_bold =  bold;
			_italic =  italic;
			_underline =  underline;
			_url =  url;
			_target =  target;
			_align =  align;
			_leftMargin =  leftMargin;
			_rightMargin =  rightMargin;
			_indent =  indent;
			_leading =  leading;
		}
		

		public function get align () : String
		{
			return _align;
		}

		public function set align (value:String) : void
		{
			_align = value;
		}


		public function get blockIndent () : Object
		{
			return _blockIndent;
		}

		public function set blockIndent (value:Object) : void
		{
			_blockIndent = value;
		}


		public function get bold () : Object
		{
			return _bold;
		}

		public function set bold (value:Object) : void
		{
			_bold = value;
		}


		public function get bullet () : Object
		{
			return _bullet;
		}

		public function set bullet (value:Object) : void
		{
			_bullet = value;
		}


		public function get color () : Object
		{
			return (_color == null) ? null : Number(_color);
		}

		public function set color (value:Object) : void
		{
			_color = value;
		}

		public function get display () : String
		{
			return _display;
		}

		public function set display (value:String) : void
		{
			_display = value;
		}


		public function get font () : String
		{
			return _font;
		}

		public function set font (value:String) : void
		{
			_font = value;
		}


		public function get indent () : Object
		{
			return _indent
		}

		public function set indent (value:Object) : void
		{
			_indent = value;
		}


		public function get italic () : Object
		{
			return _italic;
		}

		public function set italic (value:Object) : void
		{
			_italic = value;
		}


		public function get kerning () : Object
		{
			return _kerning;
		}

		public function set kerning (value:Object) : void
		{
			_kerning = value;
		}


		public function get leading () : Object
		{
			return _leading;
		}

		public function set leading (value:Object) : void
		{
			_leading = value;
		}


		public function get leftMargin () : Object
		{
			return _leftMargin;
		}

		public function set leftMargin (value:Object) : void
		{
			_leftMargin = value;
		}


		public function get letterSpacing () : Object
		{
			return _letterSpacing;
		}

		public function set letterSpacing (value:Object) : void
		{
			_letterSpacing = value;
		}


		public function get rightMargin () : Object
		{
			return _rightMargin;
		}

		public function set rightMargin (value:Object) : void
		{
			_rightMargin = value;
		}


		public function get size () : Object
		{
			return _size;
		}

		public function set size (value:Object) : void
		{
			_size = value;
		}


		public function get tabStops () : Array
		{
			return _tabStops;
		}

		public function set tabStops (value:Array) : void
		{
			_tabStops = value;
		}


		public function get target () : String
		{
			return _target;
		}

		public function set target (value:String) : void
		{
			_target = value;
		}


		public function get underline () : Object
		{
			return _underline;
		}

		public function set underline (value:Object) : void
		{
			_underline = value;
		}


		public function get url () : String
		{
			return _url;
		}

		public function set url (value:String) : void
		{
			_url = value
		}
	}
}
