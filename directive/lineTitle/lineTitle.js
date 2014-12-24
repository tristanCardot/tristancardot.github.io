(function(){
    angular
        .module('portfolioApp')
        .directive('lineTitle', lineTitle);

	lineTitle.$inject = ['$timeout', 'scrollService'];

//GLOBAL
var $timeout;
var delayScale = 2.35;
//CTRL
	function lineTitleCtrl(){
	}

	lineTitleCtrl.prototype = {
		buildTitle : function(element, title){
			var inner = "";
			for(var i=0,p; i<title.length; i++)
				inner += '<p>'+ title[i] +'</p>';
			element[0].innerHTML += inner;

			var listP = element[0].getElementsByTagName('p');
			var self = this;


			$timeout(function(){
				var p = listP[listP.length-1];
				var length = p.offsetLeft + p.offsetWidth -14;
				var delay = (length*delayScale);

				element[0].style.width = length +'px';
				length /= 2;

				for(var i=0,p,time; i<listP.length; i++){
					p = listP[i];
					time = delay * Math.abs(p.offsetLeft +p.offsetWidth/2 -15 -length)/length -50;
					p.style.transitionDelay = time +'ms';
				}

				element[0].style.transitionDuration = delay + 'ms';
			},850);
		},

		defineEvent : function(element){
			this.event = function(){
				element.className += ' display';
			};
		}
	};

//DIRECTIVE
	function lineTitle($timeout_, scrollService){
		$timeout = $timeout_;

		var lineTitleLink = function(scope, element, attrs, ctrl){
			ctrl.buildTitle(element, scope.title);

			ctrl.defineEvent(element[0]);
			scrollService.addEvent(element[0], ctrl.event);
		};

		return {
			restrict: 'E',
			controller: lineTitleCtrl,
			controllerAs: 'ctrl',
			link: lineTitleLink,
			scope: {
				title : '='
			},
			template: '<div class="line right-line"></div><div class="line left-line"></div>'+
			          '<div class="static static-left"></div><div class="static static-right"></div>'
		};
	}
})();