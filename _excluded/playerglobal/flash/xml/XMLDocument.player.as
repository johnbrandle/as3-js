/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.xml
{
	import flash.xml.XMLNode;
	
	import browser.Browser;

	public class XMLDocument extends XMLNode
	{
		private static var $_regex2:RegExp = /<!--[\s\S]*?-->/g;
		
		private static var $_regex3:RegExp = /\S/;
		
		private var $_source:String;

		public var docTypeDecl : Object;


		public var idMap : Object;


		public var ignoreWhite : Boolean;


		public var xmlDecl : Object;

		public function XMLDocument (source:String=null)
		{
			if (source) parseXML(source);
			
			super(XMLNodeType.ELEMENT_NODE, source);
		}

		public UNIMPLEMENTED function createElement (name:String) : flash.xml.XMLNode
		{
			throw new Error('XMLDocument: attempted call to an unimplemented function "createElement"');
		}

		public UNIMPLEMENTED function createTextNode (text:String) : flash.xml.XMLNode
		{
			throw new Error('XMLDocument: attempted call to an unimplemented function "createTextNode"');
		}
		
		private static function trim(string:*):String
		{
			if (!string) return '';
			
			return string.trim();
		} 

		public function parseXML(source:String):void
		{
			$_source = source = trim(source.replace($_regex2, ''));
			
			var xmlDoc:Object;
			var node:XMLNode;
			
			if (source.charAt(0) !== '<')
			{
				if (source.indexOf('<![CDATA[') === 0) node = new XMLNode(XMLNodeType.CDATA_NODE, source);
				else node = new XMLNode(XMLNodeType.TEXT_NODE, source);	
				
				$__childNodes = [node];
				firstChild = lastChild = node;
				
				return;
			}
			
			xmlDoc = Browser.domParseXML(source);
			node = new XMLNode(XMLNodeType.ELEMENT_NODE, xmlDoc.documentElement.nodevalue);
			
			$__childNodes = [node];
			firstChild = lastChild = node;

			$_parseRecursiveXML(node, xmlDoc.documentElement);
		}
		
		private function $_parseRecursiveXML(node:*, domObject:*):void
		{
			node.$__prefix = domObject.prefix;
			node.nodeName = domObject.nodeName;
			node.$__localName = domObject.localName;
			var hasError:* = false;
			
			// if there is error parsing the node , better not parsing anything recursively inside it, since we have no idea what other errors will come out
			if (domObject.nodeName == 'parsererror') 
			{
				domObject.nodeName = null;
				node.nodeType = XMLNodeType.TEXT_NODE;
				hasError = true;
			}
			
			if (node.nodeName == "#cdata-section") node.nodeName = null;
			node.nodeValue = domObject.nodeValue;
			if (hasError) return;
			
			var domObjectAttributes:* = domObject.attributes;
			if (domObjectAttributes && domObjectAttributes.length)
			{
				var attributes:* = node.attributes;
				for (var i:int = domObjectAttributes.length; i--;) attributes[domObjectAttributes[i].nodeName] = domObjectAttributes[i].value;
			}
			
			var ignoreWhite:* = this.ignoreWhite;
			var domObjectChildNodes:* = domObject.childNodes;
			if (domObjectChildNodes && domObjectChildNodes.length)
			{
				var childNodes:* = node.$__childNodes;
				for (i = domObjectChildNodes.length; i--;)
				{
					var innerNode:* = domObjectChildNodes[i];
					
					// ignore nodes that have errors
					if (innerNode.nodeName == 'parsererror') continue;
					
					if (ignoreWhite)
					{
						if (innerNode.nodeType == XMLNodeType.ELEMENT_NODE) innerNode.nodeValue = (innerNode.nodeValue) ? trim(innerNode.nodeValue) : '';
						else if (innerNode.nodeType == XMLNodeType.TEXT_NODE && !(($_regex3).test(innerNode.nodeValue))) continue;
					}
					
					innerNode = new XMLNode(innerNode.nodeType, innerNode.nodeValue);
					innerNode.parentNode = node;
					$_parseRecursiveXML(innerNode, domObject.childNodes[i]);
					childNodes.unshift(innerNode);
				}
				
				node.firstChild = childNodes[0];
				node.lastChild = childNodes[childNodes.length - 1];
			}
		}


		override public function toString():String
		{
			return $_source;
		}
	}
}
