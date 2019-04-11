/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.text
{
	import flash.display.DisplayObject;
	import flash.display.InteractiveObject;
	import flash.events.Event;
	import flash.geom.Rectangle;
	import flash.text.StyleSheet;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.text.TextLineMetrics;
	
	
	
	
	public class TextField extends InteractiveObject
	{
		private var $_properties:*;
		private var $_domTextView:Object;
		
		private var $_type:String;	
		private var $_text:String = '';
		private var $_htmlText:String = '';
		private var $_multiline:Boolean;
		private var $_wordWrap:Boolean;
		private var $_autoSize:String = TextFieldAutoSize.NONE;
		private var $_selectable:Boolean = true;
		private var $_condenseWhite:Boolean;
		private var $_restrict:String;
		private var $_maxChars:int = int.MAX_VALUE;
		private var $_background:Boolean;
		private var $_backgroundColor:uint = 0xFFFFFF;
		private var $_border:Boolean = false;
		private var $_borderColor:uint;
		private var $_skipSetAutoDimensions:Boolean;
		
		private var $_characterTextFormats:Array;
		private var $_defaultTextFormat:TextFormat = new TextFormat();
		
		private var $_styleSheet:StyleSheet;
		

		public function TextField()
		{
			if ($_properties === undefined) $__properties({});
		
			super();

			$_properties.DisplayObjectScope.$_setExplicitBounds(100, 100);
			$es4.$$getDescriptor($_properties.TextFieldScope.pscope, 'type').set.call(this, TextFieldType.DYNAMIC);
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);

				object.TextFieldScope = {pscope:$es4.$$getOwnScope(this, TextField)};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}
		
		public override function set width(value:Number):void
		{
			$_domTextView.style.width = (value - ($_border ? 6 : 4)) + 'px';
			
			$_properties.DisplayObjectScope.$_setExplicitBounds(value, $_properties.DisplayObjectScope.$_height);
		}
		
		public override function set height(value:Number):void
		{
			$_domTextView.style.height = (value - ($_border ? 6 : 4)) + 'px';
			
			$_properties.DisplayObjectScope.$_setExplicitBounds($_properties.DisplayObjectScope.$_width, value);
		}
		
		public override function set scrollRect(rectangle:Rectangle):void
		{
			if (!rectangle)
			{
				super.scrollRect = rectangle;
				
				$_domTextView.style.width = ($_properties.DisplayObjectScope.$_width - ($_border ? 6 : 4)) + 'px';
				$_domTextView.style.height = ($_properties.DisplayObjectScope.$_height - ($_border ? 6 : 4)) + 'px';
				return;
			}
			
			super.scrollRect = rectangle;
		}
		

		public function get type():String
		{
			return $_type;
		}
		
		public function set type(value:String):void
		{
			if (value == $_type) return;
			
			if ($_domTextView) while ($_domTextView.hasChildNodes()) $_domTextView.removeChild($_domTextView.lastChild);
			
			$_domTextView = $_properties.DisplayObjectScope.$_domView;
			
			$_domTextView.removeEventListener('input', onInput);
			$_domTextView.removeEventListener('keydown', onKeyDown);
			$_domTextView.removeEventListener('keyup', onKeyUp);
			$_domTextView.removeEventListener('blur', onBlur);
			
			if (value == TextFieldType.DYNAMIC)
			{
				$_properties.DisplayObjectScope.$_domView.setAttribute('aria-hidden', true);
				
				$_domTextView.contentEditable = 'false';
				$_domTextView.style.backgroundColor = 'inherit';
				$_domTextView.style.outline = 'inherit';
				$_domTextView.style.resize = 'inherit';
			}
			else if (value == TextFieldType.INPUT)
			{
				$_properties.DisplayObjectScope.$_domView.setAttribute('aria-hidden', false);
				
				$_domTextView.contentEditable = 'true';
				$_domTextView.style.backgroundColor = 'transparent';
				$_domTextView.style.outline = 'none';
				$_domTextView.style.resize = 'none';
				
				$_domTextView.addEventListener('input', onInput);
				$_domTextView.addEventListener('keydown', onKeyDown);
				$_domTextView.addEventListener('keyup', onKeyUp);
				$_domTextView.addEventListener('blur', onBlur);
			}
			else throw new ArgumentError('Parameter type must be one of the accepted values.', 2008);

			$_type = value;
				
			$_domTextView.style.width = ($_properties.DisplayObjectScope.$_width - 4) + 'px'; //padding offset
			$_domTextView.style.height = ($_properties.DisplayObjectScope.$_height - 4) + 'px'; //padding offset
			$_domTextView.style.textRendering = 'optimizeSpeed';
			$_domTextView.style.paddingLeft = '2px'; //we should create a inner div, that has a 3px border, but this seems a bit overkill, so let's just do the left and top and not worry about the right and bottom
			$_domTextView.style.paddingTop = '2px'; //we should create a inner div, that has a 3px border, but this seems a bit overkill, so let's just do the left and top and not worry about the right and bottom	
			
			//forgot why we can't do the right and bottom... going to try it anyway and see what issues creep up
			$_domTextView.style.paddingRight = '2px'; //we should create a inner div, that has a 3px border, but this seems a bit overkill, so let's just do the left and top and not worry about the right and bottom
			$_domTextView.style.paddingBottom = '2px'; //we should create a inner div, that has a 3px border, but this seems a bit overkill, so let's just do the left and top and not worry about the right and bottom

			$_applyTextFormattingToNode($_domTextView);
			
			$_skipSetAutoDimensions = true; //we don't want to recalculate the dimensions over and over neadlessly...
			
			var pscope:Object = $_properties.TextFieldScope.pscope;
			$es4.$$getDescriptor(pscope, 'selectable').set.call(this, $_selectable);
			$es4.$$getDescriptor(pscope, 'autoSize').set.call(this, $_autoSize);
			$es4.$$getDescriptor(pscope, 'multiline').set.call(this, $_multiline);
			$es4.$$getDescriptor(pscope, 'border').set.call(this, $_border);
			$es4.$$getDescriptor(pscope, 'background').set.call(this, $_background);

			if ($_htmlText) $es4.$$getDescriptor($_properties.TextFieldScope.pscope, 'htmlText').set.call(this, $_htmlText);
			else if ($_text) $es4.$$getDescriptor($_properties.TextFieldScope.pscope, 'text').set.call(this, $_text);
			
			$_skipSetAutoDimensions = false;
			setAutoDimensions();
		}
		
		private function onKeyDown(event:Object):*
		{
			if ($_text.length >= $_maxChars) 
			{
				if (event.keyCode != 46 && event.keyCode != 8) event.preventDefault();
				return;
			}
			
			switch (event.keyCode)
			{
				case 27:
				case 8:
				case 9:
				case 20:
				case 16:
				case 17:
				case 91:
				case 92:
				case 18:
					return;
			}
			
			var char:String = (event.shiftKey) ? mapShiftKeyPressToActualCharacter(event.keyCode) : String.fromCharCode(event.keyCode);
			char = restrictTextHandler(char, $_restrict);
			
			if (char == '' || (event.keyCode == 13 && !$_multiline)) 
			{
				event.preventDefault();
				return;
			}
			
			if (event.keyCode == 13 && !window.ie) document.execCommand('formatBlock', false, 'p'); //div bad... p good?
		}
		
		private function onKeyUp(event:Object):*
		{
			var elements:* = $_domTextView.childNodes;
			for (var i:int = elements.length; i--;) 
			{
				if (elements[i].nodeName == 'P' && !window.ie) elements[i].setAttribute('contenteditable', true);
			}
		}
		
		private function setAutoDimensions():void
		{
			if ($_skipSetAutoDimensions) return;
			
			var body:* = document.body;
			if (!$_domTextView.parentNode && !body.contains($_domTextView))
			{
				body.appendChild($_domTextView);
				$_properties.DisplayObjectScope.$_setExplicitBounds($_domTextView.scrollWidth, $_domTextView.scrollHeight);
				body.removeChild($_domTextView);
			}
			else $_properties.DisplayObjectScope.$_setExplicitBounds($_domTextView.scrollWidth, $_domTextView.scrollHeight);
		}
		
		private function onInput(event:Object):void
		{
			$_text = $_domTextView.textContent;
			
			setAutoDimensions();
			
			dispatchEvent(new Event(Event.CHANGE, false, false));
				
			//$_domTextView.onblur = function(event:*):void //WILL PROBABLY NEED TO ADD THIS BACK AT SOME POINT
			//{
			//	window.onScreenKeyboardClosed = true;
			//	if (window.onresize) window.onresize();
			//}
		}
		
		private function onBlur(event:Object):void //this is a hack meant to fix an issue with contenteditable divs, where chrome (and possibly ie) do not properly give up focus when tabbing out (the div will sometimes steal focus back, even though we specifically requested another element to gain focus)
		{
			var sel:* = window.getSelection();
			sel.removeAllRanges();
		}

		public function get text():String
		{
			if ($_type == TextFieldType.INPUT) return $_domTextView.textContent;
			
			return $_text;
		}
		
		public function set text(text:String):void
		{
			if (text == null) text = '';
			
			$_characterTextFormats = null;
			
			text = restrictTextHandler(text, $_restrict);
			
			$_text = text;
			
			$_domTextView.innerHTML = ($_type == TextFieldType.DYNAMIC) ? $_applyTextFormatting(text) : text.split('&').join('&amp;').split('<').join('&lt;');//($_type == TextFieldType.DYNAMIC) ? $_generateHTMLText() : text;
			
			if ($_type == TextFieldType.INPUT && document.activeElement == $_domTextView)
			{
				var node:* = $_domTextView;
				var textNode:* = node.firstChild || node;
				var range:* = document.createRange();
				range.setStart(textNode, 0);
				range.setEnd(textNode, 0);
				var sel:* = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			}
			
			setAutoDimensions();
		}
		

		public function get htmlText():String
		{
			//if ($_type == TextFieldType.INPUT) throw new Error('TextField: htmlText for input textfield type is not supported.'); //don't remember why i had this restriction
			
			return $_generateHTMLText();
		}
		
		public function set htmlText(text:String):void
		{
			//if ($_type == TextFieldType.INPUT) throw new Error('TextField: htmlText for input textfield type is not supported.'); //don't remember why i had this restriction
			
			if (text == null) text = '';
			
			$_characterTextFormats = null;
			
			text = restrictTextHandler(text, $_restrict);

			var win:Object = window;
			$_htmlText = text;
			if (text.indexOf('<') !== -1) //there is html in this text
			{
				if ($_type == TextFieldType.INPUT)
				{
					win.$$getDescriptor($_properties.TextFieldScope.pscope, 'text').set.call(this, win.HTMLtoText('<root>' + text + '</root>'));
					return;
				}

				text = win.HTMLtoXML('<root>' + text + '</root>');
				text = text.substring(6, text.length - 7);
			}
			else if ($_type == TextFieldType.INPUT)
			{
				win.$$getDescriptor($_properties.TextFieldScope.pscope, 'text').set.call(this, text);
				return;
			}
			
			$_domTextView.innerHTML = $_applyTextFormatting(text);
			
			setAutoDimensions();
		}
		
		//http://adndevblog.typepad.com/infrastructure/2012/07/get-character-while-pressing-shift-key-using-javascript.html
		private static function mapShiftKeyPressToActualCharacter(characterCode:*):* 
		{
			switch (characterCode)
			{
				case 27:
				case 8:
				case 9:
				case 20:
				case 16:
				case 17:
				case 91:
				case 92:
				case 18:
					return '';
			}
			
			var characterMap:* = [];
			characterMap[192] = '~';
			characterMap[49] = '!';
			characterMap[50] = '@';
			characterMap[51] = '#';
			characterMap[52] = '$';
			characterMap[53] = '%';
			characterMap[54] = '^';
			characterMap[55] = '&';
			characterMap[56] = '*';
			characterMap[57] = '(';
			characterMap[48] = ')';
			characterMap[109] = '_';
			characterMap[107] = '+';
			characterMap[219] = '{';
			characterMap[221] = '}';
			characterMap[220] = '|';
			characterMap[59] = ':';
			characterMap[222] = '\'';
			characterMap[188] = '<';
			characterMap[190] = '>';
			characterMap[191] = '?';
			characterMap[32] = ' ';
			var character:* = '';
			
			if (characterCode >= 65 && characterCode <= 90) character = String.fromCharCode(characterCode);
			else character = characterMap[characterCode];
			
			return character;
		}
		
		private static function restrictTextHandler(text:*, restrict:*):*
		{
			if (restrict !== null) 
			{
				if (restrict == '') text = '';
				else text = text.replace(new RegExp('[^' + restrict + ']'), '');
			}
			
			return text;
		}
		

		public function get multiline():Boolean
		{
			return $_multiline;
		}
		
		public function set multiline(value:Boolean):void
		{
			$_multiline = value;
			
			if ($_type == TextFieldType.INPUT) 
			{
				if (!value) $_domTextView.style.whiteSpace = 'nowrap';
				else $_domTextView.style.whiteSpace = 'pre-wrap';
				
				setAutoDimensions();
			}
		}
		

		public function get wordWrap():Boolean
		{
			return $_wordWrap;
		}
		
		public function set wordWrap (value:Boolean):void
		{
			if (value == $_wordWrap) return;
			
			$_wordWrap = value;
			
			if ($_type == TextFieldType.INPUT) 
			{
				if (!value) $_domTextView.style.wordWrap = 'normal';
				else $_domTextView.style.wordWrap = 'break-word';
				
				setAutoDimensions();
			}
		}
		

		public function get textColor():uint
		{
			var color:String = $_domTextView.style.color;
			
			return parseInt(color.split('#').pop(), 16);
		}
		
		public function set textColor(value:uint):void
		{
			var color:String = '#' + value.toString(16);
			if (color == '#0') color = '#000000';
			
			$_domTextView.style.fill = color;
		}

		public function setTextFormat(format:TextFormat, beginIndex:int=-1, endIndex:int=-1):void
		{
			var text:String = $_text || $_htmlText;
			
			var textLength:int = text.length;
			if (beginIndex >= textLength || endIndex >= textLength) throw new Error('The supplied index is out of bounds.');
			if (!textLength) return;
			
			if (beginIndex == -1) beginIndex = 0;
			if (endIndex == -1) endIndex = textLength - 1;
			
			if (!$_characterTextFormats) $_characterTextFormats = [];
			var characterTextFormats:Array = $_characterTextFormats;
			for (var i:int = beginIndex; i < endIndex; i++) characterTextFormats[i] = format;
			
			$_domTextView.innerHTML = $_generateHTMLText();
			
			setAutoDimensions();
		}
		
		private function $_applyTextFormattingToNode(node:Object):void
		{			
			var characterTextFormats:Array = $_characterTextFormats;
			var defaultTextFormat:TextFormat = $_defaultTextFormat;
			var previousTextFormat:TextFormat = defaultTextFormat;
			var textFormat:TextFormat = defaultTextFormat;
			
			if (characterTextFormats && characterTextFormats.length && characterTextFormats[0]) textFormat = characterTextFormats[0]; //hack till I add proper setTextFormat support //todo
			
			var color:Object = (textFormat.color === null) ? '000000' : textFormat.color.toString(16); 
			while (color.length < 6) color = '0' + color;
			
			var textFormatProperties:Object = {url:textFormat.url,
				align: (textFormat.align) ? textFormat.align : 'left',
				blockIndent:textFormat.blockIndent,
				bold:(textFormat.bold) ? 'bold' : '500',
				bullet:textFormat.bullet,
				color:color,
				display:textFormat.display,
				indent:textFormat.indent,
				font:(textFormat.font) ? textFormat.font : 'Times New Roman',
				italic:textFormat.italic,
				leading:textFormat.leading,
				kerning:Number(textFormat.kerning),
				leftMargin:textFormat.leftMargin || 0,
				letterSpacing:textFormat.letterSpacing,
				rightMargin:textFormat.rightMargin || 0,
				size:(textFormat.size) ? Number(textFormat.size) : 12,
				tabStops:textFormat.tabStops,
				target:textFormat.target,
				underline:textFormat.underline
			};
			
			node.style.display = (textFormatProperties.align == 'left' ? 'inline-block' : 'block');
			node.style.textAlign = textFormatProperties.align;
			node.style.fontFamily = textFormatProperties.font;
			node.style.fontWeight = textFormatProperties.bold;
			node.style.fontSize = textFormatProperties.size + 'px';
			node.style.color = '#' + textFormatProperties.color;
			if (textFormatProperties.leftMargin !== null) node.style.marginLeft = textFormatProperties.leftMargin + 'px';
			if (textFormatProperties.rightMargin !== null) node.style.marginRight = textFormatProperties.rightMargin + 'px';
			if (textFormatProperties.leading !== null) node.style.lineHeight = textFormatProperties.leading + 'px';
			if (textFormatProperties.letterSpacing !== null) node.style.letterSpacing = textFormatProperties.letterSpacing + 'px';
		}
		
		private function $_applyTextFormatting(text:String):String
		{			
			var characterTextFormats:Array = $_characterTextFormats;
			
			var textFormat:TextFormat = $_defaultTextFormat;
			var textLength:int = text.length;
			var collected:String = '';
			var htmlText:String = '';
			
			if (characterTextFormats)
			{
				textFormat = characterTextFormats[0] || textFormat;
				for (var j:int = 0; j < textLength; j++)
				{
					if (characterTextFormats[j] !== undefined && characterTextFormats[j] !== textFormat)
					{
						htmlText += formatText(collected, textFormat);
						textFormat = characterTextFormats[j];
						collected = '';
					}
					
					collected += text.charAt(j);
				}
			}
			else collected = text;
			
			if (collected) htmlText += formatText(collected, textFormat);
				
			return htmlText;
			
			function formatText(text:String, textFormat:TextFormat):String
			{
				var htmlText:String = '';
				var color:Object = (textFormat.color === null) ? '000000' : textFormat.color.toString(16); 
				while (color.length < 6) color = '0' + color;
				
				var textFormatProperties:Object = {url:textFormat.url,
					align: (textFormat.align) ? textFormat.align : 'left',
					blockIndent:textFormat.blockIndent,
					bold:(textFormat.bold) ? 'bold' : '500',
					bullet:textFormat.bullet,
					color:color,
					display:textFormat.display,
					indent:textFormat.indent,
					font:(textFormat.font) ? textFormat.font : 'Times New Roman',
					italic:textFormat.italic,
					leading:textFormat.leading,
					kerning:Number(textFormat.kerning),
					leftMargin:textFormat.leftMargin || 0,
					letterSpacing:textFormat.letterSpacing,
					rightMargin:textFormat.rightMargin || 0,
					size:(textFormat.size) ? Number(textFormat.size) : 12,
					tabStops:textFormat.tabStops,
					target:textFormat.target,
					underline:textFormat.underline
				};
				
				var letterSpacing:Number= textFormatProperties.letterSpacing || 0;
				if (letterSpacing >= 1) //really bad hack that most likely won't work consistently, but letter spacing is not uniform accross browsers, and i know of no other potential solution besides rendering the text to bitmap manually, so let's try anyway...
				{
					var win:Object = window; 
					
					if (win.ie) letterSpacing -= .5;
					else if (!win.chrome) letterSpacing -= 1;
				}
				
				htmlText = '<span class="text' + ($_styleSheet !== null ? (' ' + $_styleSheet.$__id) : '') + '" tabindex="-1" ' + ($_type == TextFieldType.DYNAMIC ? 'role="presentation" aria-hidden="true" ' : 'contentEditable="true" ') 
					+ 'style="display:' + ((textFormatProperties.align === 'left' && $_styleSheet === null) ? 'inline-block' : 'block')  //text-align will not work with inline-block
					+ ';text-align:' + textFormatProperties.align 
					+ ';font-family:' + textFormatProperties.font 
					+ ';font-weight:' + textFormatProperties.bold 
					+ ';font-size:' + textFormatProperties.size + 'px'
					+ ';color:#' + textFormatProperties.color 
					+ (textFormatProperties.leftMargin === null ? '' : ';margin-left:' + textFormatProperties.leftMargin + 'px')
					+ (textFormatProperties.rightMargin === null ? '' : ';margin-right:' + textFormatProperties.rightMargin + 'px')
					+ (textFormatProperties.leading === null ? '' : ';line-height:' + textFormatProperties.leading + 'px')
					+ (textFormatProperties.letterSpacing === null ? '' : ';letter-spacing:' + letterSpacing + 'px')
					+ ($_wordWrap ? '' : ';white-space:nowrap')
					+ ';">';//;//COLOR="' +  + '" LETTERSPACING="' + textFormatProperties.letterSpacing + '" KERNING="' + textFormatProperties.kerning + '">';
				
				if (!$_multiline) text = text.split('<br/>').join('');
				if (text.indexOf("&#10;") !== -1) text = text.split("&#10;").join('<br/>'); //these line brakes always show even if not multiline
				if (text.indexOf("\\n") !== -1) text = text.split("\\n").join('<br/>'); //these line brakes always show even if not multiline
				
				if (!$_condenseWhite)
				{
					text = (text as Object).trim();
					
					var found:int = 0;
					var count:int = 0;
					for (var i:uint = 0; i < text.length; i++) //we need to do it this way or wordwrap will not work
					{
						var char:String = text.charAt(i);
						
						if (found)
						{
							if (char == ' ') count++;
							else
							{
								var begin:String = text.substring(0, found);
								var end:String = text.substring(i);
								var insert:String = ' ';
								found = 0;
								
								while (count > 1)
								{
									if (count == 2) insert += '&nbsp;&nbsp;';
									else insert += '&nbsp;';
									count--;	
								}
								count = 0;
								
								text = begin + insert + end;
								
								i = begin.length + insert.length;
							}
						}
						else if (char == ' ')
						{
							found = i;
							count = 1;
						}
					}
					
					//text = text.split(' ').join('&nbsp;');
					text = text.split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;'); //ideally there would be no tabs... tabs are not supported as they do not translate correctly to flash (flash textfields use actual fixed tabbing)
					//text = text.split('\n').join('<br/><br/>');
					text = text.split('\n').join('<br/>');
				}
				
				htmlText += text;
				htmlText += '</span>';
				
				return htmlText;
			}
		}
		
		private function $_generateHTMLText():String
		{			
			return $_applyTextFormatting($_text || $_htmlText);//.split('\n').join('<br/>').split('  ').join('&nbsp;'));
		}
		

		public function get defaultTextFormat():flash.text.TextFormat
		{
			return $_defaultTextFormat;
		}
		
		public function set defaultTextFormat(format:TextFormat):void
		{
			if (!format) format = new TextFormat();
		
			$_defaultTextFormat = format;
			
			$_applyTextFormattingToNode($_domTextView);
			
			setAutoDimensions();
		}
		

		public function get autoSize () : String
		{
			return $_autoSize;
		}
		
		public function set autoSize (value:String):void
		{
			if (value != TextFieldAutoSize.NONE) $_domTextView.style.removeProperty('height');
			
			if (value == TextFieldAutoSize.CENTER)
			{
				if ($_autoSize != TextFieldAutoSize.CENTER) this.width = this.width; //width was changed due to previous auto size property. make sure we update width before centering.
				$_domTextView.style.overflow = 'inherit';
				$_domTextView.style.textAlign = 'center';
			}
			else if (value == TextFieldAutoSize.LEFT) 
			{
				if (!$_multiline) $_domTextView.style.removeProperty('width');
				else $_domTextView.style.width = $_properties.DisplayObjectScope.$_width + 'px';
				$_domTextView.style.overflow = 'inherit';
				$_domTextView.style.removeProperty('text-align');
			}
			else 
			{
				$_domTextView.style.removeProperty('text-align');
				if ($_autoSize != TextFieldAutoSize.NONE) this.width = this.width; //width was changed due to previous auto size property. make sure we update width before disabling.
				$_domTextView.style.overflow = 'hidden';
			}
			
			$_autoSize = value;
			
			setAutoDimensions();
		}

		public function get length():int
		{
			return $_text.length;
		}
		

		public UNIMPLEMENTED function get alwaysShowSelection () : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "alwaysShowSelection"');
		}
		
		public UNIMPLEMENTED function set alwaysShowSelection (value:Boolean) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "alwaysShowSelection"');
		}

		public UNIMPLEMENTED function get antiAliasType () : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "antiAliasType"');
		}
		
		public UNIMPLEMENTED function set antiAliasType (antiAliasType:String) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "antiAliasType"');
		}

		public function get background () : Boolean
		{
			return $_background;
		}
		
		public function set background (value:Boolean) : void
		{
			$_background = value;

			if (!value)
			{
				$_domTextView.style.backgroundColor = 'transparent';
				return;
			}

			if ($_backgroundColor != 0xFFFFFF) $_domTextView.style.backgroundColor = toColor($_backgroundColor);
			else $_domTextView.style.backgroundColor = 'white';
		}

		public function get backgroundColor () : uint
		{
			return $_backgroundColor;
		}
		
		public function set backgroundColor (value:uint) : void
		{
			if (value == $_backgroundColor) return;

			$_backgroundColor = value;

			if ($_background)
			{
				if (value != 0xFFFFFF) $_domTextView.style.backgroundColor = toColor(value);
				else $_domTextView.style.backgroundColor = 'white';
			}
			else $_domTextView.style.backgroundColor = 'transparent';
		}

		public function get border () : Boolean
		{
			return $_border;
		}
		
		public function set border (value:Boolean) : void
		{
			if (value == $_border) return;

			$_border = value;

			if (!value)
			{
				$_domTextView.style.borderColor = 'transparent';
				$_domTextView.style.borderStyle = 'none';
				$_domTextView.style.borderWidth = '0px';
				if ($_domTextView.style.width !== undefined) $_domTextView.style.width = ($_properties.DisplayObjectScope.$_width - 4) + 'px'; //padding offset
				if ($_domTextView.style.height !== undefined) $_domTextView.style.height = ($_properties.DisplayObjectScope.$_height - 4) + 'px'; //padding offset

				return;
			}

			if ($_borderColor) $_domTextView.style.borderColor = toColor($_borderColor);
			else $_domTextView.style.borderColor = 'black';
			$_domTextView.style.borderStyle = 'solid';
			$_domTextView.style.borderWidth = '1px';
			if ($_domTextView.style.width !== undefined) $_domTextView.style.width = ($_properties.DisplayObjectScope.$_width - 6) + 'px'; //padding + border offset
			if ($_domTextView.style.height !== undefined) $_domTextView.style.height = ($_properties.DisplayObjectScope.$_height - 6) + 'px'; //padding + border offset
		}

		private function toColor(value:uint):String
		{
			var color:String = (!value) ? '000000' : value.toString(16);
			while (color.length < 6) color = '0' + color;

			return '#' + color;
		}

		public function get borderColor () : uint
		{
			return $_borderColor;
		}
		
		public function set borderColor (value:uint) : void
		{
			$_borderColor = value;

			if ($_border)
			{
				if (value) $_domTextView.style.borderColor = toColor(value);
				else $_domTextView.style.borderColor = 'black';
			}
			else $_domTextView.style.borderColor = 'transparent';
		}

		public UNIMPLEMENTED function get bottomScrollV () : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "bottomScrollV"');
		}

		public UNIMPLEMENTED function get caretIndex () : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "caretIndex"');
		}

		public function get condenseWhite():Boolean
		{
			return $_condenseWhite;
		}
		
		public function set condenseWhite(value:Boolean):void
		{
			$_condenseWhite = value;
		}

		public UNIMPLEMENTED function get displayAsPassword () : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "displayAsPassword"');
		}
		
		public UNIMPLEMENTED function set displayAsPassword (value:Boolean) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "displayAsPassword"');
		}

		public UNIMPLEMENTED function get embedFonts () : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "embedFonts"');
		 }
		
		public function set embedFonts (value:Boolean) : void
		{
		}

		public UNIMPLEMENTED function get gridFitType () : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "gridFitType"');
		}
		
		public UNIMPLEMENTED function set gridFitType (gridFitType:String) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "gridFitType"');
		}

		public function get maxChars () : int
		{
			return $_maxChars;
		}
		
		public function set maxChars (value:int) : void
		{
			$_maxChars = value;
		}

		public UNIMPLEMENTED function get maxScrollH () : int
		{
			throw new Error('TextField: maxScrollH is not supported.');
		}

		public UNIMPLEMENTED function get maxScrollV () : int //not likely to be implement due to performance issue calculating individual line heights that may vary in height
		{
			throw new Error('TextField: maxScrollV is not supported.');
		}
		

		public UNIMPLEMENTED function get mouseWheelEnabled () : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "mouseWheelEnabled"');
		}
		
		public UNIMPLEMENTED function set mouseWheelEnabled (value:Boolean) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "mouseWheelEnabled"');
		}
		

		public UNIMPLEMENTED function get numLines () : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "numLines"');
		}

		public function get restrict () : String
		{
			return $_restrict;
		}
		
		public function set restrict (value:String) : void
		{
			$_restrict = value;
		}
		

		public UNIMPLEMENTED function get scrollH () : int
		{
			throw new Error('TextField: scrollH is not supported.');
		}
		
		public UNIMPLEMENTED function set scrollH (value:int) : void
		{
			throw new Error('TextField: scrollH is not supported.');
		}
		

		public UNIMPLEMENTED function get scrollV () : int //not likely to be implement due to performance issue calculating individual line heights that may vary in height
		{
			throw new Error('TextField: scrollV is not supported.');
		}
		
		public UNIMPLEMENTED function set scrollV (value:int) : void //not likely to be implement due to performance issue calculating individual line heights that may vary in height
		{
			throw new Error('TextField: scrollV is not supported.');
		}
		

		public function get selectable():Boolean
		{
			return $_selectable;
		}
		
		public function set selectable(value:Boolean):void
		{			
			$_selectable = value;
			
			if (value && mouseEnabled) 
			{
				$_domTextView.style.webkitTouchCallout = $_domTextView.style.webkitUserSelect = $_domTextView.style.khtmlUserSelect = $_domTextView.style.mozUserSelect = $_domTextView.style.msUserSelect = $_domTextView.style.userSelect = $_domTextView.style.cursor = null;
				$_domTextView.style.cursor = 'text';
				$_domTextView.style.pointerEvents = 'auto';
			}
			else 
			{
				$_domTextView.style.webkitTouchCallout = $_domTextView.style.webkitUserSelect = $_domTextView.style.khtmlUserSelect = $_domTextView.style.mozUserSelect = $_domTextView.style.msUserSelect = $_domTextView.style.userSelect = 'none';
				$_domTextView.style.cursor = 'default'; //was null... changing to default so that the text cursor doesn't show... this may cause issues elsewhere
				$_domTextView.style.pointerEvents = 'none';
			}
		}
		
		public override function set mouseEnabled(enabled:Boolean):void
		{
			if (enabled && $_selectable) 
			{
				$_domTextView.style.webkitTouchCallout = $_domTextView.style.webkitUserSelect = $_domTextView.style.khtmlUserSelect = $_domTextView.style.mozUserSelect = $_domTextView.style.msUserSelect = $_domTextView.style.userSelect = $_domTextView.style.cursor = null;
				$_domTextView.style.cursor = 'text';
				$_domTextView.style.pointerEvents = 'auto';
			}
			else 
			{
				$_domTextView.style.webkitTouchCallout = $_domTextView.style.webkitUserSelect = $_domTextView.style.khtmlUserSelect = $_domTextView.style.mozUserSelect = $_domTextView.style.msUserSelect = $_domTextView.style.userSelect = 'none';
				$_domTextView.style.cursor = 'default'; //was null... changing to default so that the text cursor doesn't show... this may cause issues elsewhere
				$_domTextView.style.pointerEvents = 'none';
			}
			
			super.mouseEnabled = enabled;
		}
		
		public UNIMPLEMENTED function get selectedText () : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "selectedText"');
		}
		

		public UNIMPLEMENTED function get selectionBeginIndex () : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "selectionBeginIndex"');
		}
		

		public UNIMPLEMENTED function get selectionEndIndex () : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "selectionEndIndex"');
		}

		public UNIMPLEMENTED function get sharpness () : Number
		{
			throw new Error('TextField: attempted call to an unimplemented function "sharpness"');
		}
		
		public UNIMPLEMENTED function set sharpness (value:Number) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "sharpness"');
		}
		

		public function get styleSheet () : flash.text.StyleSheet
		{
			return $_styleSheet;
		}
		
		public function set styleSheet (value:StyleSheet) : void
		{
			$_styleSheet = value;
		}
		

		public UNIMPLEMENTED function get textHeight () : Number
		{
			throw new Error('TextField: attempted call to an unimplemented function "textHeight"');
		}
		

		public UNIMPLEMENTED function get textInteractionMode () : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "textInteractionMode"');
		}
		

		public UNIMPLEMENTED function get textWidth () : Number
		{
			throw new Error('TextField: attempted call to an unimplemented function "textWidth"');
		}

		public UNIMPLEMENTED function get thickness () : Number
		{
			throw new Error('TextField: attempted call to an unimplemented function "thickness"');
		}
		
		public UNIMPLEMENTED function set thickness (value:Number) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "thickness"');
		}
		

		public UNIMPLEMENTED function get useRichTextClipboard () : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "useRichTextClipboard"');
		}
		

		public UNIMPLEMENTED function set useRichTextClipboard (value:Boolean) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "useRichTextClipboard"');
		}
		

		public function appendText (newText:String) : void
		{
			this.htmlText += newText;
		}
		
		public UNIMPLEMENTED function copyRichText () : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "copyRichText"');
		}
		

		public UNIMPLEMENTED function getCharBoundaries (charIndex:int) : flash.geom.Rectangle
		{
			throw new Error('TextField: attempted call to an unimplemented function "getCharBoundaries"');
		}
		

		public UNIMPLEMENTED function getCharIndexAtPoint (x:Number, y:Number) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getCharIndexAtPoint"');
		}
		

		public UNIMPLEMENTED function getFirstCharInParagraph (charIndex:int) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getFirstCharInParagraph"');
		}
		

		public UNIMPLEMENTED function getImageReference (id:String) : flash.display.DisplayObject
		{
			throw new Error('TextField: attempted call to an unimplemented function "getImageReference"');
		}
		

		public UNIMPLEMENTED function getLineIndexAtPoint (x:Number, y:Number) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getLineIndexAtPoint"');
		}
		

		public UNIMPLEMENTED function getLineIndexOfChar (charIndex:int) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getLineIndexOfChar"');
		}
		

		public UNIMPLEMENTED function getLineLength (lineIndex:int) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getLineLength"');
		}
		

		public UNIMPLEMENTED function getLineMetrics (lineIndex:int) : flash.text.TextLineMetrics
		{
			throw new Error('TextField: attempted call to an unimplemented function "getLineMetrics"');
		}
		

		public UNIMPLEMENTED function getLineOffset (lineIndex:int) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getLineOffset"');
		}
		

		public UNIMPLEMENTED function getLineText (lineIndex:int) : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "getLineText"');
		}
		

		public UNIMPLEMENTED function getParagraphLength (charIndex:int) : int
		{
			throw new Error('TextField: attempted call to an unimplemented function "getParagraphLength"');
		}
		
		public UNIMPLEMENTED function getRawText () : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "getRawText"');
		}

		public UNIMPLEMENTED function getTextFormat (beginIndex:int=-1, endIndex:int=-1) : flash.text.TextFormat
		{
			throw new Error('TextField: attempted call to an unimplemented function "getTextFormat"');
		}
		
		public UNIMPLEMENTED function getTextRuns (beginIndex:int=0, endIndex:int=2147483647) : Array
		{
			throw new Error('TextField: attempted call to an unimplemented function "getTextRuns"');
		}
		
		public UNIMPLEMENTED function getXMLText (beginIndex:int=0, endIndex:int=2147483647) : String
		{
			throw new Error('TextField: attempted call to an unimplemented function "getXMLText"');
		}
		
		public UNIMPLEMENTED function insertXMLText (beginIndex:int, endIndex:int, richText:String, pasting:Boolean=false) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "insertXMLText"');
		}
		

		public UNIMPLEMENTED static function isFontCompatible (fontName:String, fontStyle:String) : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "isFontCompatible"');
		}
		
		public UNIMPLEMENTED function pasteRichText (richText:String) : Boolean
		{
			throw new Error('TextField: attempted call to an unimplemented function "pasteRichText"');
		}
		

		public UNIMPLEMENTED function replaceSelectedText (value:String) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "replaceSelectedText"');
		}
		

		public UNIMPLEMENTED function replaceText (beginIndex:int, endIndex:int, newText:String) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "replaceText"');
		}
		

		public UNIMPLEMENTED function setSelection (beginIndex:int, endIndex:int) : void
		{
			throw new Error('TextField: attempted call to an unimplemented function "setSelection"');
		}
		
		public override function set tabEnabled(enabled:Boolean):void
		{
			super.tabEnabled = enabled;
			
			if (!enabled && $_properties.InteractiveObjectScope.$_tabIndex == -1) $_domTextView.setAttribute('aria-hidden', true);
			else $_domTextView.removeAttribute('aria-hidden');
		}
		
		public override function set tabIndex(index:int):void
		{
			super.tabIndex = index;
			
			if (!$_properties.InteractiveObjectScope.$_tabEnabled && index == -1) $_domTextView.setAttribute('aria-hidden', true);
			else $_domTextView.removeAttribute('aria-hidden');
		}
	}
}
