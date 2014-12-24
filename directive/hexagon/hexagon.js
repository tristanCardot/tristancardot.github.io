(function(){
    angular
        .module('portfolioApp')
        .directive('hexagon', hexagon);

	hexagon.$inject = ['$timeout', 'scrollService'];

//GLOBAL

//CTRL
	function hexagonCtrl(){
	}

	hexagonCtrl.prototype = {
		defineActive : function(element){
			this.active = (function(){

				function close(e){
					if( !element.contains( e.toElement ) ){
						window.removeEventListener('click', close, true);
						element.className = 'display';
					}
				}

				return function(e){
					if(element.className==='display'){
						element.className = 'display active';
						window.addEventListener('click', close, true);
					}
				};
			})();
		}
	};

//DIRECTIVE
	function hexagon($timeout, scrollService){
		var div = document.createElement('div');
		div.className = "replacedSVG";

		var hexagonLink = function(scope, element, attrs, ctrl){
			ctrl.defineActive(element[0]);
		};

		return {
			restrict: 'E',
			controller: hexagonCtrl,
			controllerAs: 'ctrl',
			link: hexagonLink,
			scope: {
				color : '=',
				icon : '=',
				level : '=',
				bubble : '='
			},
			transclude: true,
			template:	'<svg>'+
						'	<polygon points="80,177 4.655789870753836,133.5 4.655789870753836,46.50000000000002 79.99999999999999,3 155.34421012924614,46.499999999999964 155.3442101292462,133.49999999999994" stroke="#757575" stroke-width="3px"></polygon>'+
						'	<polygon class="skill-level-{{level}}" points="80,177 4.655789870753836,133.5 4.655789870753836,46.50000000000002 79.99999999999999,3 155.34421012924614,46.499999999999964 155.3442101292462,133.49999999999994" stroke="#2196F3" stroke-width="6px"></polygon>'+
						'</svg>'+
						'<a ng-click="ctrl.active();" ng-style="{\'background-color\':\'{{color}}\'}"> <span class="bubble">{{bubble}}</span>'+
						'	<span></span><span class="hexLeft"></span><span class="hexRight"></span> <span class="hex"></span>'+
						'	<div class="content" ng-transclude></div> <div class="icon" ng-style="{\'background-position\':\'{{icon}}\'}"></div>'+
						'</a>'
		};
	}
})();