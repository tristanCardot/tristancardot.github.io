(function(){
	angular
	    .module('portfolioApp')
	    .service('scrollService', ScrollService);

	ScrollService.$inject = ['$window', '$timeout'];

//GLOBAL
	var $window, 
	    $timeout;
	var GLOBAL_OFFSET = .15;
	var lastTime = 0, firstFrame = true;


//SERVICE
	function ScrollService($window_, $timeout_){
		$window = $window_;
		$timeout = $timeout_;
		//-----

		this.scroll = {
			buffer : 0,
			pos : 0
		};

		this.range = {
			min : 0,
			max : 0
		};
		//-----

		this.events = [];
		this.linkedBackgrounds = [];

		this.run = false;
		this.locked = false;

		//-----

		var self = this;
		this.resize = (function(){
			return function resize(){
				var sections = document.getElementsByTagName('section');
				var lastSection = sections[sections.length-1];

				self.range.max = lastSection.offsetTop + lastSection.offsetHeight - window.innerHeight;
			};
		})();

		self.launch(self);
	}

	ScrollService.prototype = {
		addEvent : function(target, call){
			this.events.push({
				target : target,
				call : call
			});
		},

		addBackground : function(target, ratio){
			this.linkedBackgrounds.push({
				target : target, 
				ratio : ratio
			});
		},

		sortEvents : function(){
			this.events.sort(function(eventA, eventB){
				return eventA.target.offsetTop - eventB.target.offsetTop;
			});
		},


		launch : function(self){
			var scroll = function(e){
				e.preventDefault();

				if(self.locked)
					return;

				if( (e.wheelDelta || -e.detail) < 0)
					self.scroll.buffer += 40;
				else
					self.scroll.buffer -= 40;

				self.scroll.buffer = Math.max( -200, Math.min( self.scroll.buffer, 200));

				self.start();
			};

			if(document.body.onmousewheel !== undefined)
				window.addEventListener('mousewheel', scroll, false);
			else
				window.addEventListener('DOMMouseScroll', scroll, false);

			var lastY=0;
			window.addEventListener('touchmove', function(e){
				scroll({wheelDelta: e.changedTouches[0].screenY-lastY, preventDefault : function(){}});
				lastY = e.changedTouches[0].screenY;
			}, false);


			window.addEventListener('resize', self.resize, false);

			angular.element(document).ready(function () {
		        console.log(' --- LOADED --- ');

		        $timeout(function(){
					self.sortEvents();
					self.resize();
		        	window.loaderIsActive = false;
		        }, 1000);
		    });
   		},

		start : function(){
			if(!this.run){
				this.run = true;
				firstFrame = true;
				this.update(this, 0);
			}
		},


		DELAY : 15,
		update : function(self, delta){delta/=25;
			if(self.locked === true || self.scroll.buffer === 0)
				return self.run = false;

			var request = function(time){
				if(firstFrame){
					firstFrame = false;
					lastTime = time;
					$timeout(request, self.DELAY);
					return;
				}

				self.update(self, self.DELAY);
				lastTime = time;
			};

			$timeout(request, self.DELAY);

			var abs = Math.abs(self.scroll.buffer);
			var off = ~~Math.min( Math.max(2*delta, abs*.115*delta), abs) * (self.scroll.buffer<0 ? -1:1);
			self.scroll.pos += off;


			if(self.scroll.pos < self.range.min){
				self.scroll.pos = self.range.min;
				self.scroll.buffer  = 0;

			}else if(self.scroll.pos > self.range.max){
				self.scroll.pos = self.range.max;
				self.scroll.buffer  = 0;

			}else 
				self.scroll.buffer -= off;


			document.body.style.transform = 'translateY(-'+ self.scroll.pos +'px)';

			while(self.events.length !== 0 && 
				  (self.events[0].target.offsetTop + self.events[0].target.offsetHeight) < 
				  (self.scroll.pos + document.body.offsetHeight*(1-GLOBAL_OFFSET) ) ){

				self.events[0].call();
				self.events.shift();
			}

			this.linkedBackgrounds.forEach(function(background){
				background.target.style.backgroundPosition = '0px '+ (-self.scroll.pos*background.ratio) +'px';
			});
		},

		addArea : function(pos, range, ratio){
			var area = new StaticArea(pos, range, ratio, this.scroll);
			this.areas.push( area );
			return area;
		},

		removeArea : function(area){
			var index = area.indexOf(area);

			if(index !== -1)
				this.areas.splice(index, 1);
		}
	};




//UTIL
	function StaticArea(pos, range, ratio, scroll){
		this.pos = pos;
		this.range = range;
		this.ratio = ratio;

		this.scroll = scroll;

		this.scrollInArea = false;
	}

	StaticArea.prototype = {
		update : function(scroll){
			if(scroll.pos > this.pos)
				scroll.pos -= Math.min(scroll.pos-this.pos, this.range) *this.ratio;
		},

		updateState : function(){
			return this.scrollInArea = this.scroll.pos > this.pos && this.scroll.pos < this.pos + this.range*(1-this.ratio);
		}

	};
})();