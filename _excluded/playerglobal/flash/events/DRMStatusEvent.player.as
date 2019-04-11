/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.net.drm.DRMContentData;
	import flash.net.drm.DRMVoucher;

	public UNIMPLEMENTED class DRMStatusEvent extends Event
	{
		private var _contentData:DRMContentData;
		private var _isLocal:Boolean;
		private var _voucher:DRMVoucher;
		private var _metadata:DRMContentData;

		public static const DRM_STATUS:String = "drmStatus";

		public function get contentData():DRMContentData
		{
			return _contentData;
		}

		public function set contentData(value:DRMContentData):void
		{
			_contentData = value;
		}

		public function get isLocal():Boolean
		{
			return _isLocal;
		}

		public function set isLocal(value:Boolean):void
		{
			_isLocal = value;
		}

		public function get voucher():DRMVoucher
		{
			return _voucher;
		}

		public function set voucher(value:DRMVoucher):void
		{
			_voucher = value;
		}

		override public function clone():Event
		{
			return new DRMStatusEvent(type, bubbles, cancelable, _metadata, voucher, isLocal);
		}

		public function DRMStatusEvent(type:String = "drmStatus", bubbles:Boolean = false, cancelable:Boolean = false, inMetadata:DRMContentData = null, inVoucher:DRMVoucher = null, inLocal:Boolean = false)
		{
			super(type, bubbles, cancelable);
			_metadata = inMetadata;
			_voucher = inVoucher;
			_isLocal = inLocal;
		}

		override public function toString():String
		{
			return formatToString('DRMStatusEvent', 'type', 'bubbles', 'cancelable', 'voucher', 'isLocal');
		}

	}
}
