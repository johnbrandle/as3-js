/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.sampler
{
	public final UNIMPLEMENTED class NewObjectSample extends Sample
	{
		public const id : Number;


		public const type : Class;


		public function get object () : *
		{
			throw new Error('NewObjectSample: attempted call to an unimplemented function "object"');
		}


		public function get size () : Number
		{
			throw new Error('NewObjectSample: attempted call to an unimplemented function "size"');
		}

		public function NewObjectSample ()
		{
			throw new Error('NewObjectSample: attempted call to an unimplemented constructor');
		}

	}
}
