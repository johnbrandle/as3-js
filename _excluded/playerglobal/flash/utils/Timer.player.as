/**
 * Copyright (c) 2008-2014 CoreMedia AG, Hamburg. Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this software except in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for
 * the specific language governing permissions and limitations under the License.
 */

/**
 * NOTICE: FILE HAS BEEN CHANGED FROM ORIGINAL
 *
 * @contributor	 John Brandle
 * @license		see "NOTICE" file
 * @date		04.15.2013
 */

package flash.utils
{
	import flash.events.EventDispatcher;
	import flash.events.TimerEvent;
	

	public class Timer extends EventDispatcher
	{
		private var timer:Object = null;
		private var _delay:Number;
		private var _repeatCount:int;
		private var _currentCount:int = 0;
	

		public function get currentCount () : int
		{
			return _currentCount;
		}


		public function get delay () : Number
		{
			return _delay;
		}

		public function set delay (value:Number) : void
		{
			_delay = value;
			
			if (timer) 
			{
				stop();
				start();
			}
		}


		public function get repeatCount () : int
		{
			return _repeatCount;
		}

		public function set repeatCount (value:int) : void
		{
			_repeatCount = value;
			checkComplete();
		}


		public function get running () : Boolean
		{
			return timer != null;
		}


		public function reset () : void
		{
			stop();
			_currentCount = 0;
		}


		public function start () : void
		{
			if (timer) return; 
			
			timer = window.setInterval(tick, _delay);
		}


		public function stop () : void
		{
			if (!timer) return;
			
			window.clearInterval(timer);
			timer = null;
		}


		public function Timer (delay:Number, repeatCount:int=0)
		{
			_delay = delay;
			_repeatCount = repeatCount;
		}
		
		private function tick():void 
		{
			if (!timer) 
			{
				// oops, a tick occurred although timer has been stopped:
				return;
			}
			
			++_currentCount;
			try 
			{
				dispatchEvent(new TimerEvent(TimerEvent.TIMER));
			} 
			catch (e:*) 
			{
				trace("ERROR", e);
			}
			checkComplete();
		}

		 private function checkComplete():void 
		 {
			if (_repeatCount > 0 && _currentCount >= _repeatCount) 
			{
				stop();
				dispatchEvent(new TimerEvent(TimerEvent.TIMER_COMPLETE));
			}
		}
	}
}
