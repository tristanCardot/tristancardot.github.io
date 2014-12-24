(function(){
    angular
        .module('portfolioApp')
        .directive('squareFont', squareFontDirective);

	squareFontDirective.$inject = ['$timeout'];



//GLOBAL
	var $timeout;

	var OFF = 30,
		DELAY = 20,
		COLOR = '#2979FF',
		CHARACTERS = (function(){
		var result = {};
			var replace = function(str){
				return str.replace(/█| /g,function(c){return c === ' ' ? '0':'1';});
			};

		var str = [
			replace(' ████ _█████ _ ████ _█████ _██████_██████_ █████_██  ██_██████_██████_██  ██_██    _█    █_██  ██_ ████ _█████ _ ████ _█████ _ █████_██████_██  ██_█    █_█    █_██  ██_██  ██_██████_      _    ██_██████_   ██ _██████_██████_██    _██████_██████_██████_██████_██████_      _ ██   _ ████ ').split('_'),
			replace('██████_██████_██████_██████_██████_██████_██████_██  ██_██████_██████_██ ███_██    _██  ██_██  ██_██████_██████_██████_██████_██████_██████_██  ██_█    █_█    █_██  ██_██  ██_██████_      _    ██_██████_   ██ _██████_██████_██    _██████_██████_██████_██████_██████_      _ ██   _██████').split('_'),
			replace('██  ██_██  ██_██  ██_██  ██_██    _██    _██    _██  ██_  ██  _   ██ _█████ _██    _██  ██_███ ██_██  ██_██  ██_██  ██_██  ██_██    _  ██  _██  ██_██  ██_█    █_██████_██  ██_   ███_      _   ██ _██  ██_   ██ _    ██_    ██_██    _██    _██    _    ██_██  ██_██  ██_      _ ██   _██  ██').split('_'),
			replace('██  ██_██  ██_██    _██  ██_██    _██    _██    _██  ██_  ██  _   ██ _████  _██    _██████_███ ██_██  ██_██  ██_██  ██_██  ██_██    _  ██  _██  ██_██  ██_█    █_ ████ _██  ██_  ███ _      _   ██ _██  ██_   ██ _    ██_    ██_██ █  _██    _██    _    ██_██  ██_██  ██_      _ ██   _█   ██').split('_'),
			replace('██  ██_█████ _██    _██  ██_████  _████  _██ ███_██████_  ██  _   ██ _███   _██    _██████_██████_██  ██_██████_██  ██_██████_█████ _  ██  _██  ██_██  ██_█ ██ █_  ██  _██████_  ███ _      _  ██  _██  ██_   ██ _██████_██████_██████_██████_██████_    ██_██████_██████_      _ ██   _   ██ ').split('_'),
			replace('██████_█████ _██    _██  ██_████  _████  _██ ███_██████_  ██  _   ██ _███   _██    _█ ██ █_██████_██  ██_█████ _██  ██_█████ _ █████_  ██  _██  ██_██  ██_█ ██ █_  ██  _ ████ _ ███  _      _  ██  _██  ██_   ██ _██████_██████_██████_██████_██████_    ██_██████_██████_      _ ██   _  ██  ').split('_'),
			replace('██████_██  ██_██    _██  ██_██    _██    _██  ██_██  ██_  ██  _   ██ _████  _██    _█ ██ █_██ ███_██  ██_██    _██  ██_████  _    ██_  ██  _██  ██_ ████ _██████_ ████ _  ██  _ ███  _      _ ██   _██  ██_   ██ _██    _    ██_  ██  _    ██_██  ██_    ██_██  ██_    ██_      _ ██   _  ██  ').split('_'),
			replace('██  ██_██  ██_██  ██_██  ██_██    _██    _██  ██_██  ██_  ██  _██ ██ _█████ _██    _█    █_██ ███_██  ██_██    _██ ███_█████ _    ██_  ██  _██  ██_ ████ _██  ██_██████_  ██  _███   _      _ ██   _██  ██_   ██ _██    _    ██_  ██  _    ██_██  ██_    ██_██  ██_    ██_      _      _      ').split('_'),
			replace('██  ██_██████_██████_██████_██████_██    _██████_██  ██_██████_█████ _██ ███_██████_█    █_██  ██_██████_██    _██████_██ ███_██████_  ██  _██████_  ██  _ █  █ _██  ██_  ██  _██████_      _██    _██████_   ██ _██████_██████_  ██  _██████_██████_    ██_██████_██████_ ██   _ ██   _  ██  ').split('_'),
			replace('██  ██_█████ _ ████ _█████ _██████_██    _ ████ _██  ██_██████_ ███  _██  ██_██████_█    █_██  ██_ ████ _██    _ █████_██  ██_█████ _  ██  _ ████ _  ██  _ █  █ _██  ██_  ██  _██████_      _██    _██████_   ██ _██████_██████_  ██  _██████_██████_    ██_██████_██████_ ██   _ ██   _  ██  ').split('_')          
		];

		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ /0123456789.!?';
		for(var i=0,j; i<characters.length; i++)
			result[ characters.charAt(i) ] = (function(){
					var data = [];

					for(j=0; j<10; j++)
						data.push( str[j][i] );

					return data;
			})();

		return result;
	})();



//animations
	function AnimatedChar(character, x, y, offset){
		this.character = character;
		this.offset = offset;

		this.x = x;
		this.y = y;

		this.time = 0;
		this.tickCount = 0;
	}

	AnimatedChar.prototype = {
		update : function(ctx, delta, SF){
			var needUpdate = false;
			this.time += delta;

			if(this.time <= DELAY)
				needUpdate = true;

			else
				while(this.time > DELAY){
					this.time -= DELAY;
					needUpdate |= this.tick(ctx, SF);
				}


			return needUpdate;
		},

		tick : function(ctx, SF){
			var needUpdate = false;

			for(var i=0, from, to, j; i<10; i++){
				from = Math.max( this.tickCount -OFF -this.offset[i], 0);
				to =   Math.min( this.tickCount      -this.offset[i], 6);

				if(from > 6)
					continue;

				needUpdate = true;

				for(j=from; j<to; j++)
					if(CHARACTERS[this.character][i][j] === '0'){
						if(j === from)
							ctx.clearRect(this.x + SF.total*j -.1, this.y + SF.total*i -.1, SF.scale +.2, SF.scale +.2);
					}else
						ctx.fillRect(this.x + SF.total*j, this.y + SF.total*i, SF.scale, SF.scale);
			}

			this.tickCount++;
			return needUpdate;
		}
	};



//CTRL
	function SquareFontCtrl(){
		this.ctx;
		this.index = 0;
		this.data = [];

		this.lastUpdate = 0;
		this.animations = [];
		this.run = false;
	}

	SquareFontCtrl.prototype = {
		link : function(scope, element){
			var self = this;

			var canvas = element[0].firstChild;

			canvas.width = scope.width;
			canvas.height = scope.height;

			this.ctx = canvas.getContext('2d');

			this.ctx.fillStyle = COLOR;
			this.ctx.globalAlpha = .16;

			this.data = scope.data;
			this.data.forEach(function(str, index){
				self.data[index] = str.toUpperCase().replace(/[^A-Z0-9 \/.!?]/g, '.');
			});


			this.scale = scope.scale;
			this.interspace = scope.interspace;
			this.total = this.scale + this.interspace;
			this.charWidth = this.total*7;


			var outside = false;
			var ticked = false;
			var tick = function (){
					if(ticked)
						return;

					ticked = true;
					self.drawNext();

					$timeout(function(){ ticked=false; if(outside)return; tick();}, 5000, 0, false);
			};

			var scroll = function(e){
				if( element[0].offsetTop + element[0].offsetHeight + parseInt(document.body.style.marginTop) < 0)
					outside = true;

				else{
					outside = false;
					tick();
				}
			};

			if(document.body.onmousewheel !== undefined)
				window.addEventListener('mousewheel', scroll, false);
			else
				window.addEventListener('DOMMouseScroll', scroll, false);


			tick();
		},

		drawNext : function(){
			if(this.run)
				return;

			this.index++;
			this.drawString( this.data[this.index%this.data.length] );
		},
			
		drawString : function(str){
			var self = this;
			var offset = this.getOffset(0,OFF);

			for(var i=0; i<str.length; i++)
				this.animations.push(
					(function(){
						var space = new AnimatedChar(' ', i*self.charWidth, 0, offset);
						space.time -= DELAY *6 *i;
						return space;
					})(),

					(function(character){
						var animation = new AnimatedChar(character, i*self.charWidth, 0, offset);
						animation.time -= DELAY *6 *(i+1);
						return animation;
					})( str.charAt(i))
				);

			this.start();
		},

		start : function(){
			if(!this.run){
				this.run = true;
				this.lastUpdate = Date.now();
				this.update(this);
			}
		},

		update : function(self){
			var now = Date.now();
			var delta = Math.min(now - this.lastUpdate, 60);
			this.lastUpdate = now;
			var needUpdate = false;

			for(var i=0; i<this.animations.length; i++)
				needUpdate |= this.animations[i].update(this.ctx, delta, this);

			if(needUpdate)
				requestAnimationFrame(function(){
					self.update(self);
				});

			else
				this.run = false;
		},

		getOffset : function(from, to){
			var offset = [];

			for(var i=0; i<10; i++)
				offset.push( ~~(Math.random()*(to-from) + from ) );

			return offset;
		}
	};



//DIRECTIVE
	function squareFontDirective($timeout_){
		$timeout = $timeout_;

		var squareFontLink = function(scope, element, attrs, ctrl){
			ctrl.link(scope, element);
		};


		return {
			restrict: 'E',
			controller: SquareFontCtrl,
			controllerAs: 'squarefont',
			link: squareFontLink,
			scope: {
				width: '=',
				height: '=',
				data: '=',
				scale: '=',
				interspace: '='
			},
			template : '<canvas></canvas>'
		};
	}
})();