/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.sampler
{
	public final UNIMPLEMENTED class StackFrame 
	{

		public const file : String;


		public const line : uint;


		public const name : String;


		public const scriptID : Number;

		public function StackFrame ()
		{
			throw new Error('StackFrame: attempted call to an unimplemented constructor');
		}


		public function toString () : String
		{
			throw new Error('StackFrame: attempted call to an unimplemented function "toString"');
		}

	}
}
