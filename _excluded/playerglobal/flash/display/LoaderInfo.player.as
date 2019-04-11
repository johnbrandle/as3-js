/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.display
{
	import flash.events.EventDispatcher;
	import flash.events.UncaughtErrorEvents;
	import flash.system.ApplicationDomain;
	import flash.utils.ByteArray;
	
	import browser.Browser;
	
	public class LoaderInfo extends EventDispatcher
	{
		private var $_properties:*;
	
		public function LoaderInfo()
		{
			if ($_properties === undefined) $__properties({});
			
			super();
		}
		
		public override function $__properties(object:*=null):*
		{
			if ($_properties === undefined) 
			{
				object = super.$__properties(object);
				
				object.LoaderInfoScope = {$_parameters:{}, $_contentType:null, $_url:null, $_bytesTotal:null, $_bytesLoaded:null, $_loader:null};
				object.TLScope = this;
				
				return $_properties = object;
			}
			
			return $_properties;
		}

		public function get actionScriptVersion():uint
		{
			if (contentType == 'application/x-shockwave-flash') return ActionScriptVersion.ACTIONSCRIPT3;
			
			throw new Error('Incorrect contentType or not enough info available to retrieve actionScriptVersion');
		}

		public function get bytesLoaded():uint
		{
			return $_properties.LoaderInfoScope.$_bytesLoaded;
		}

		public function get bytesTotal():uint
		{
			return $_properties.LoaderInfoScope.$_bytesTotal;
		}

		public function get content():flash.display.DisplayObject
		{
			return $_properties.LoaderInfoScope.$_loader.content;
		}

		public function get contentType():String
		{
			return $_properties.LoaderInfoScope.$_contentType;
		}

		public function get loader():flash.display.Loader
		{
			return $_properties.LoaderInfoScope.$_loader;
		}

		public function get swfVersion():uint
		{
			if (contentType == 'application/x-shockwave-flash') return SWFVersion.FLASH9;
			
			throw new Error('Incorrect contentType or not enough info available to retrieve swfVersion');
		}

		public function get url():String
		{
			return $_properties.LoaderInfoScope.$_url;
		}
		
		public UNIMPLEMENTED function get width () : int
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "width"');
		}

		public UNIMPLEMENTED static function getLoaderInfoByDefinition (object:Object) : flash.display.LoaderInfo
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "getLoaderInfoByDefinition"');
		}

		public function get uncaughtErrorEvents () : flash.events.UncaughtErrorEvents
		{
			return new UncaughtErrorEvents();
		}
		
		public UNIMPLEMENTED function get loaderURL():String
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "loaderURL"');
		}

		public function get parameters () : Object
		{
			return $_properties.LoaderInfoScope.$_parameters;
		}

		public UNIMPLEMENTED function get parentAllowsChild () : Boolean
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "parentAllowsChild"');
		}

		public UNIMPLEMENTED function get sameDomain () : Boolean
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "sameDomain"');
		}

		public UNIMPLEMENTED function get sharedEvents () : flash.events.EventDispatcher
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "sharedEvents"');
		}
		
		public UNIMPLEMENTED function get frameRate () : Number
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "frameRate"');
		}

		public UNIMPLEMENTED function get height () : int
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "height"');
		}

		public UNIMPLEMENTED function get isURLInaccessible () : Boolean
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "isURLInaccessible"');
		}
		
		public function get applicationDomain () : flash.system.ApplicationDomain
		{
			return $_properties.LoaderInfoScope.$_loader.$__properties().LoaderScope.$_loaderContext.applicationDomain;
		}

		public function get bytes () : flash.utils.ByteArray
		{
			return Browser.getByteArray($_properties.LoaderInfoScope.$_url);
		}
		
		public UNIMPLEMENTED function get childAllowsParent () : Boolean
		{
			throw new Error('LoaderInfo: attempted call to an unimplemented function "childAllowsParent"');
		}
	}
}
