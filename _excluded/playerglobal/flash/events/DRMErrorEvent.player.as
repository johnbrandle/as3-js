/**
 * @author		John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.events
{
	import flash.events.Event;
	import flash.net.drm.DRMContentData;

	public UNIMPLEMENTED class DRMErrorEvent extends ErrorEvent
	{
		private var _contentData:DRMContentData;
		private var _drmUpdateNeeded:Boolean;
		private var _subErrorID:int;
		private var _systemUpdateNeeded:Boolean;
		private var _metadata:DRMContentData;

		public static const DRM_ERROR:String = "drmError";
		public static const DRM_LOAD_DEVICEID_ERROR:String;

		public function get contentData():DRMContentData
		{
			return _contentData;
		}

		public function set contentData(value:DRMContentData):void
		{
			_contentData = value;
		}

		public function get drmUpdateNeeded():Boolean
		{
			return _drmUpdateNeeded;
		}

		public function get subErrorID():int
		{
			return _subErrorID;
		}

		public function get systemUpdateNeeded():Boolean
		{
			return _systemUpdateNeeded;
		}

		override public function clone():Event
		{
			return new DRMErrorEvent(type, bubbles, cancelable, text, errorID, subErrorID, _metadata, systemUpdateNeeded, drmUpdateNeeded);
		}

		public function DRMErrorEvent(type:String = "drmError", bubbles:Boolean = false, cancelable:Boolean = false, inErrorDetail:String = "", inErrorCode:int = 0, insubErrorID:int = 0, inMetadata:DRMContentData = null, inSystemUpdateNeeded:Boolean = false, inDrmUpdateNeeded:Boolean = false)
		{
			super(type, bubbles, cancelable, inErrorDetail, inErrorCode);
			_subErrorID = insubErrorID;
			_metadata = inMetadata;
			_systemUpdateNeeded = inSystemUpdateNeeded;
			_drmUpdateNeeded = inDrmUpdateNeeded;
		}

		override public function toString():String
		{
			return formatToString('DRMErrorEvent', 'type', 'bubbles', 'cancelable', 'text', 'subErrorID', 'errorID');
		}

	}
}
