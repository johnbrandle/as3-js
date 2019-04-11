/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.globalization
{
	public final UNIMPLEMENTED class CurrencyParseResult 
	{
		public function get currencyString () : String
		{
			throw new Error('CurrencyParseResult: attempted call to an unimplemented function "currencyString"');
		}

		public function get value () : Number
		{
			throw new Error('CurrencyParseResult: attempted call to an unimplemented function "value"');
		}

		public function CurrencyParseResult (value:Number=NaN, symbol:String="")
		{
			throw new Error('CurrencyParseResult: attempted call to an unimplemented constructor');
		}

	}
}
