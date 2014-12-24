(function(){
    angular
        .module('portfolioApp')
        .directive('iconHeader', iconHeaderDirective);

	iconHeaderDirective.$inject = ['$window'];

//GLOBAL



//CTRL
	function iconHeaderCtrl(){
	}

	iconHeaderCtrl.prototype = {
	};

//DIRECTIVE
	function iconHeaderDirective($window){

		var iconHeaderLink = function(scope, element, attrs, ctrl){
		};

		return {
			restrict: 'E',
			controller: iconHeaderCtrl,
			controllerAs: 'ctrl',
			link: iconHeaderLink,
			template: '<div class="logo"> <div class="pulse"></div><div class="pulse"></div><div class="pulse"></div> </div> <div class="arrow"><div></div><div></div><div></div></div>'
		};
	}
})();