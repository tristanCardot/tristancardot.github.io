if(document.createElement('div').style.transform === undefined)
	Object.defineProperty(CSSStyleDeclaration.prototype, "transform", { 
		get : function () { return this.webkitTransform; }, 
		set : function (v) { this.webkitTransform = v; }
	});

var menu = {
	HIDE : 1,
	SHOW : 2,
	TOP : 3,

	selected : 2,

	updateSelected : function(newSelected, callback){
		if(this.selected === newSelected)
			return;

		this.selected = newSelected || this.selected;

		switch(this.selected){
			case this.HIDE:
				var count = 0;

				for(key in this.icons)
					setTimeout(function(s){
							s.style.transform = "";
							s.style.className = s.className = s.className.split("hide")[0] + "hide";
						}, 
						count*150, 
						this.icons[key].svg.parentNode,
						count++
					);
				
				setTimeout(function(){
					document.getElementsByTagName('header')[0].className="hide";
				}, 800);
			break;
			case this.SHOW:
				var count = 0,
					offX, offY;
				
				if(window.innerWidth > 1015){
					offX = (window.innerWidth /2 -400) /2 +100;
					offY = (window.innerHeight/2 - 250)/2 +140;
					
				}else{
					offX = -142;
					offY = undefined;
				}

				document.getElementsByTagName('header')[0].className="";

				for(key in this.icons)
					setTimeout(function(s, count){
							s.style.transform = "translateX("+ (count%2 === 0 ? -offX:offX) +"px)"+
												"translateY("+ ( offY? count<2 ? -offY:offY : 250+count*200) +"px)";
							s.className = s.className.split("hide")[0];
						},
						count*150 +500,
						this.icons[key].svg.parentNode,
						count++
					);

			break;
			case this.TOP:
				var count = 0;

				for(key in this.icons)
					setTimeout(function(s){
							s.style.transform = "";
							s.style.className = s.className = s.className.split("hide")[0] + "hide";
						},
						count*150,
						this.icons[key].svg.parentNode,
						count++
					);

					setTimeout(function(){
						document.getElementsByTagName('header')[0].className="top";
					}, 800);
			break;
		}
		
		if(callback)
			setTimeout(callback, 1000);
	},

	hideList : function(){
		document.getElementById('list').style.opacity = 0;
	},

	showList : function(data){//target,src,txt
		var list = document.getElementById('list');
		list.innderHTML = "";
		var result = "";

		
		for(var i=0,s; i<data.length; i++){
			s = data[i];

			result +="<div data-target='"+ s[0] +"' style='"+
					 "background-image:url("+ s[1] +");' onload='menu.loaded(this,event);' onerror='menu.loaded(this,event);'>"+
					 "<div>"+ s[2] +"</div>"+
					 "<div class='box'></div></div>";
		}

		list.innerHTML = result;
		list.style.opacity = 1;
	},
	
	loaded : function(node, e){console.log(node);
		node.parentNode.style.display ="";
	},
	
	init : function(){
		for(key in this.icons)
			this.icons[key].init();
		this.logo.init();
	},
	
  icons :{
//icon expériences
	exp : {
		init : function(){
			this.svg = document.getElementById('svgExp');
			this.g = this.svg.getElementsByTagName('g')[0];
			this.circles = this.svg.getElementsByTagName('circle');

			var self = this;
			this.svg.parentNode.addEventListener('mouseenter', function(){self.over();}, false);
			this.svg.parentNode.addEventListener('mouseleave', function(){self.out();}, false);
			
			var press = function(){
				menu.hideList();
				menu.updateSelected(menu.TOP, function(){
					menu.showList(self.data);
				});
			};

			this.svg.parentNode.addEventListener('click', press, false);
			this.svg.parentNode.addEventListener('touchend', press, false);
		},

		data : [
			['null','img/me200.png','some random text'],
			['null','img/iconCV.png','some random text'],
			['null','img/me200.png','some random text'],
		],

		currentTime : 0,

		update : function( delta){
			this.currentTime += delta;

			for( var i=0,c,t; i<this.circles.length; i++){
				c = this.circles[i];
				t = ( this.currentTime +i *700) %4200;

				if(t<500){
					c.setAttribute('cx', 0);
					c.setAttribute('cy', -t/20 -15);
					c.setAttribute('r', t/80);

				}else{
					t -= 500;
					c.setAttribute('cx', Math.sin( t *.003) *(t +5) /150 *( 1 -( i %2 *2) )+ t/80);
					c.setAttribute('cy', -t/40 -40);
					c.setAttribute('r', t/190 +6.25);
				}
			}

			if( this.t.from.y !== this.t.to.y){
				if( this.t.from.y < this.t.to.y){
					this.t.from.y += delta *.08;
					this.t.from.scale -= delta *.001;

					if( this.t.from.y >= this.t.to.y){
						this.t.from.y = this.t.to.y;
						this.t.from.scale = this.t.to.scale;
					}

				}else{
					this.t.from.y -= delta *.08;
					this.t.from.scale += delta *.001;

					if( this.t.from.y <= this.t.to.y){
						this.t.from.y = this.t.to.y;
						this.t.from.scale = this.t.to.scale;

						updateList.splice( updateList.indexOf( this), 1);
					}
				}

				this.g.setAttribute('transform', "translate(50,"+ this.t.from.y +") scale("+ this.t.from.scale +")");
			}
		},

		t : { 
			from: {y:50, scale:1},
			to: {y:50, scale:1}
		},

		over: function(){
			this.t.to.y = 70;
			this.t.to.scale = .75;

			if(updateList.indexOf(this) === -1)
				updateList.push(this);
		},

		out : function(){
			this.t.to.y = 50;
			this.t.to.scale = 1;
		}
	},

//iconAbout
	about : {
		init : function(){
			this.svg = document.getElementById('svgAbout');
			this.gs = this.svg.getElementsByTagName('g');
			this.path = this.svg.getElementsByTagName('path')[1];

			var self = this;
			this.svg.parentNode.addEventListener( 'mouseenter', function(){self.over();}, false);
			this.svg.parentNode.addEventListener( 'mouseleave', function(){self.out();}, false);
			
			var press = function(){
				frameManager.load('slider.html');
			};
			this.svg.parentNode.addEventListener( 'click', press, false);
			this.svg.parentNode.addEventListener( 'touchend', press, false);
		},

		currentTime : 0,

		update : function( delta){
			this.currentTime += delta;
			this.path.style.strokeDasharray = Math.sin( this.currentTime /100) +27.5;
			this.path.style.strokeDashoffset = -( this.currentTime /25) %110;

			if( this.t.from.y !== this.t.to.y){
				if( this.t.from.y > this.t.to.y)
					delta = -delta;

				this.t.from.x -= delta *.08;
				this.t.from.y += delta *.08;
				this.t.from.scale -= delta *.0006;
				this.t.from.bubble += delta *.004;

				if( delta > 0 && this.t.from.y >= this.t.to.y || delta < 0 && this.t.from.y <= this.t.to.y){
					this.t.from.x = this.t.to.x;
					this.t.from.y = this.t.to.y;
					this.t.from.scale = this.t.to.scale;
					this.t.from.bubble = this.t.to.bubble;

					if( delta < 0)
						updateList.splice( updateList.indexOf( this), 1);
				}

				this.gs[0].setAttribute('transform', "translate("+ this.t.from.x +","+ this.t.from.y +") scale("+ this.t.from.scale +")");	
				this.gs[1].setAttribute('transform', "scale("+ this.t.from.bubble +")");
			}
		},

		t : {
			from: {x:50, y:50, scale:.5, bubble: 0},
			to: {x:50, y:50, scale:.5, bubble: 1}
		},

		over: function(){
			this.t.to.x = 30;
			this.t.to.y = 70;
			this.t.to.scale = .35;
			this.t.to.bubble = 1;

			if(updateList.indexOf(this) === -1)
				updateList.push(this);
		},

		out : function(){
			this.t.to.x = 50;
			this.t.to.y = 50;
			this.t.to.scale = .5;
			this.t.to.bubble = 0;
		}
	},

//iconCV
	CV : {
		init : function(){
			this.svg = document.getElementById('svgCV');
			this.g = this.svg.getElementsByTagName('g')[0];
			this.path = this.svg.getElementsByTagName('path')[0];
			this.ligne = this.svg.getElementsByTagName('path')[1];

			var self = this;
			this.svg.parentNode.addEventListener('mouseenter', function(){self.over();}, false);
			this.svg.parentNode.addEventListener('mouseleave', function(){self.out();}, false);
		},

		currentTime : 0,

		update : function( delta){
			this.currentTime += delta;

			this.ligne.style.strokeDashoffset = this.currentTime/25 +'px';

			if( this.t.from.y !== this.t.to.y){
				if( this.t.from.y > this.t.to.y)
					delta = -delta;

				this.t.from.y += delta *.108;
				this.t.from.scale += delta *.003;
				this.t.from.offset -= delta *.96;

				if( delta > 0 && this.t.from.y >= this.t.to.y || delta < 0 && this.t.from.y <= this.t.to.y){
					this.t.from.y = this.t.to.y;
					this.t.from.scale = this.t.to.scale;
						this.t.from.offset = this.t.to.offset;

					if( delta > 0)
						updateList.splice( updateList.indexOf( this), 1);
				}
	
				this.g.setAttribute('transform', "translate(50,"+ this.t.from.y +") scale("+ this.t.from.scale +")");
				this.path.style.strokeDashoffset = this.t.from.offset +'px';
			}
		},
	
		t : {
			from: {y:77, scale:1.75, offset: -250},
			to: {y:77, scale:1.75, offset: -250}
		},
	
		over : function(){
			this.t.to.y = 50;
			this.t.to.scale = 1;
			this.t.to.offset = 0;
	
			if(updateList.indexOf(this) === -1)
				updateList.push(this);
		},
	
		out : function(){
			this.t.to.y = 77;
			this.t.to.scale = 1.75;
			this.t.to.offset = -250;
		}
	},

//iconGame
	game : {
		init : function(){
			this.svg = document.getElementById('svgGame');
			this.g = this.svg.getElementsByTagName('g')[0];
			this.path = this.svg.getElementsByTagName('path')[0];
			
			var self = this;
			this.svg.parentNode.addEventListener('mouseenter', function(){self.over();}, false);
			this.svg.parentNode.addEventListener('mouseleave', function(){self.out();}, false);
			
			this.svg.parentNode.addEventListener('click', function(){
				menu.hideList();
				menu.updateSelected(menu.TOP, function(){
					menu.showList(self.data);
				});
			}, false);
		},
		
		data : [
			['null','img/me200.png','some random text'],
			['null','img/iconCV.png','some random text'],
			['null','img/me200.png','some random text'],
		],
		
		currentTime : 0,
	
		update : function( delta){
			this.currentTime += delta;
			var t = this.currentTime /20;
	
			var off =[
				Math.sin(t) *5, 
				Math.sin(t +Math.PI /2) *5
			];
	
			this.path.setAttribute('d', "M -50,"+ ( -25 +off[0]) +" v20 h10 v"+ (-5-off[0]) +" h10 v40 h10 v"+ ( 15 +off[1]) +" h10 v"+ ( -15 -off[1]) +" h20 v"+ ( 15 -off[1]) +" h10 v"+ ( -15 +off[1]) +" h10 v-40 h10 v"+ ( 5 -off[0]) +" h10 v-20 h-10 v"+ ( 5 +off[0]) +" h-10 v-20 h-60 v20 h-10 v"+ ( -5 +off[0]) +" z m 27,"+ ( -off[0]) +" h17 v17 h-17 z m 30,0 h17 v17 h-17 z");
	
			if( this.t.from.r !== this.t.to.r){
				if( this.t.from.r > this.t.to.r)
					delta = -delta;
	
				this.t.from.r += delta *.12;
				
				if( delta > 0 && this.t.from.r >= this.t.to.r || delta < 0 && this.t.from.r <= this.t.to.r){
					this.t.from.r = this.t.to.r;
				
					if( delta < 0)
						updateList.splice( updateList.indexOf( this), 1);
				}
	
				this.g.setAttribute('transform', "translate(50,50) scale(.8) rotate("+ this.t.from.r +")");
			}
		},
	
		t : {
			from: {r:0},
			to: {r:0}
		},
	
		over : function(){
			this.t.to.r = 30;
		
			if(updateList.indexOf(this) === -1)
				updateList.push(this);
		},
	
		out : function(){
			this.t.to.r = 0;
		}
	}
  },

  logo : {
	init : function(){
		this.svg = document.getElementById('home');
		this.g = this.svg.getElementsByTagName('g')[0];
		this.paths = this.svg.getElementsByTagName('path');
		
		var self = this;
		this.svg.addEventListener('mouseenter', function(){self.over();}, false);
		this.svg.addEventListener('mouseleave', function(){self.out();}, false);
		
		var active = function(){
			if(menu.selected === menu.TOP)
				menu.updateSelected(menu.SHOW);
			else
				menu.updateSelected(menu.TOP);
		};
		
		this.svg.addEventListener('click', active, false);
		this.svg.addEventListener('touchend', active, false);
	},

	update : function( delta){
		if( this.t.from.scale !== this.t.to.scale){
			if( this.t.from.scale < this.t.to.scale)
				delta = -delta;

			this.t.from.scale -= delta *.0022;
			this.t.from.lx[0] += delta *.24;
			this.t.from.lx[1] += delta *.08;
			this.t.from.lx[2] -= delta *.24;

			if( delta > 0 && this.t.from.scale <= this.t.to.scale || delta < 0 && this.t.from.scale >= this.t.to.scale){
				this.t.from.scale = this.t.to.scale;
				this.t.from.lx = this.t.to.lx;

				if( delta < 0)
					updateList.splice( updateList.indexOf( this), 1);
			}

			this.g.setAttribute('transform', "translate(50,50) scale("+ this.t.from.scale +")");
			this.paths[0].setAttribute('d',"M"+ this.t.from.lx[0] +",-40 h20 v80 h-20 z");
			this.paths[1].setAttribute('d',"M"+ this.t.from.lx[1] +",-40 h60 v20 h-40 v40 h40 v20 h-60 z");
			this.paths[2].setAttribute('d',"M"+ this.t.from.lx[2] +",-40 h20 v60 h40 v20 h-60 z");
		}
	},

	t : {
		from: {y:50, scale:.9, off:0, lx:[10,-30,-30]},
		to: {y:50, scale:.9, off:0, lx:[10,-30,-30]}
	},

	over : function(){
		this.t.to.y = 70;
		this.t.to.scale = .35;
		this.t.to.off = 0;
		this.t.to.lx = [70,-10,-90];

		if(updateList.indexOf(this) === -1)
			updateList.push(this);
	},

	out : function(){
		this.t.to.y = 50;
		this.t.to.scale = .9;
		this.t.to.off = 240;
		this.t.to.lx = [10,-30,-30];
	}
  }
};

//background
var backgroundRender = {
	update : function( delta){
		CTX.clearRect(0,0, CTX.canvas.width, CTX.canvas.height);
		CTX.beginPath();

		var wD2 = CTX.canvas.width /2,
			hD2 = CTX.canvas.height /2;

		for(var i=0,s; i<this.p.length; i++){
			s = this.p[i];
			s[0] += s[1];
			CTX.lineTo( Math.cos( s[0]) *CTX.canvas.width +wD2, Math.sin( s[0]) *CTX.canvas.height +hD2);
		}

		CTX.closePath();
		CTX.fill();
	},

	initP : function(){
		this.p = [];

		var s = Math.PI/25000,
			off = Math.PI/500;

		for(var i=0; i<50; i++)
			this.p.push([Math.PI *2 /50 *(i), ( i%2 === 0 ? -1 : 1) *i *s +off]);
	},

	p : []
};

//animation updater
var lastFrame = Date.now();
var updateList = [];

function update(){
	var delta = Date.now() -lastFrame;
	lastFrame = Date.now();

	for(var i=0; i<updateList.length; i++)
		updateList[i].update(delta);

	requestAnimationFrame(update);
}

window.addEventListener('load', function(){console.log("tick");
	menu.init();

	this.CTX = document.getElementById('canvas').getContext('2d');
	resize();
	backgroundRender.initP();

	updateList.push(backgroundRender);
	update();
}, false);

function resize(){
	CTX.canvas.height = window.innerHeight /8;
	CTX.canvas.width = window.innerWidth /8;
	CTX.fillStyle = "#f9f9f9";

	menu.updateSelected();
}

window.onresize = resize;

var data = [
	['null','img/me200.png','some random text'],
	['null','img/iconCV.png','some random text'],
	['null','img/me200.png','some random text'],
	['null','img/iconCV.png','some random text'],
	['null','img/test.png','some random text'],
	['null','img/me200.png','some random text'],
	['null','img/test.png','some random text'],
	['null','img/test.png','some random text']
];

var frameManager = {
	currentFrame : "null",
	currentDoc : null,
	onload : null,
	
	load : function(url){
		if(url === this.currentFrame)
			return;
		
		if(this.currentFrame !== "null")
			this.close();
		
		this.currentFrame = url;
		
		var self = this;
		var request = new XMLHttpRequest();
		request.open( 'GET', url, true);
		request.responseType = 'document';

		request.onload = function(e){
			if(e.target.response instanceof Object){
				self.currentDoc = e.target.response;
				self.execObject();
				
			}else
				self.currentFrame = "null";
		};

		request.onerror = function(e){ self.currentFrame = "null"; console.error(e);};
		request.send();

		menu.updateSelected(menu.TOP);
	},
	
	execObject : function(){
		window.frameDoc = this.currentDoc;

		var style =  this.currentDoc.getElementById('frameStyle');
		style.id = 'frameStyle';
		document.head.appendChild(style);

		var script = document.createElement('script');
		script.innerHTML = this.currentDoc.getElementById('frameScript').innerHTML;
		script.id = 'frameScript';
		document.head.appendChild(script);

		document.getElementById('container').innerHTML = this.currentDoc.getElementById('container').innerHTML;

		if( window.onload){
			onload();
			window.onload = null;
		}
	},

	close : function(){
		if( window.clear){
			clear();
			window.clear = null;
		}

		var node = document.getElementById('frameScript');
		if(node)
			document.head.removeChild( node);

		var node = document.getElementById('frameScript');
		if(node)
			document.head.removeChild( node);

		document.getElementById('container').innerHTML = "";
	}
};




