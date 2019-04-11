/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.system
{
	import flash.display.Stage;
	import flash.utils.ByteArray;
	import flash.utils.getDefinitionByName;

	public final class ApplicationDomain 
	{
		public var $__definitions:Object = {};
		

		public function ApplicationDomain (parentDomain:ApplicationDomain=null)
		{
		}

		public static function get currentDomain ():flash.system.ApplicationDomain
		{
			return Stage.$__stageReference.loaderInfo.applicationDomain;
		}


		public UNIMPLEMENTED function get domainMemory () : flash.utils.ByteArray
		{
			throw new Error('ApplicationDomain: attempted call to an unimplemented function "domainMemory"');
		}

		public UNIMPLEMENTED function set domainMemory (mem:ByteArray) : void
		{
			throw new Error('ApplicationDomain: attempted call to an unimplemented function "domainMemory"');
		}


		public UNIMPLEMENTED static function get MIN_DOMAIN_MEMORY_LENGTH () : uint
		{
			throw new Error('ApplicationDomain: attempted call to an unimplemented function "MIN_DOMAIN_MEMORY_LENGTH"');
		}


		public UNIMPLEMENTED function get parentDomain () : flash.system.ApplicationDomain
		{
			throw new Error('ApplicationDomain: attempted call to an unimplemented function "parentDomain"');
		}


		public function getDefinition(name:String):Object
		{
			var definitions:Object = $__definitions;
			if (definitions[name] !== undefined) return definitions[name];
			
			return flash.utils.getDefinitionByName(name);
		}


		public UNIMPLEMENTED function hasDefinition (name:String) : Boolean
		{
			throw new Error('ApplicationDomain: attempted call to an unimplemented function "hasDefinition"');
		}

	}
}
