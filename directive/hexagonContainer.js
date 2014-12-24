(function(){
    angular
        .module('portfolioApp')
        .directive('hexagonContainer', hexagonContainer);

	hexagonContainer.$inject = ['$timeout','scrollService'];

//GLOBAL
var $timeout;

//CTRL
	function hexagonContainerCtrl(){
		this.event = function(){};
	}

	hexagonContainerCtrl.prototype = {
		defineEvent : function(element){

			this.event = function(){
				var list = element.getElementsByTagName('hexagon');

				for(var i=0; i<list.length; i++)
					list[i].className = 'display';
			};
		}
	};

//DIRECTIVE
	function hexagonContainer($timeout_, scrollService){
		$timeout = $timeout_;

		var hexagonContainerLink = function(scope, element, attrs, ctrl){
			ctrl.defineEvent(element[0]);
			scrollService.addEvent(element[0], ctrl.event);
		};

		return {
			restrict: 'E',
			controller: hexagonContainerCtrl,
			controllerAs: 'ctrl',
			link: hexagonContainerLink
		};
	}
})();
