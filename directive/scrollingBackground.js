(function(){
    angular
        .module('portfolioApp')
        .directive('scrollingBackground', scrollingBackground);

	scrollingBackground.$inject = ['scrollService'];


//DIRECTIVE
	function scrollingBackground(scrollService){

		var scrollingBackgroundLink = function(scope, element){
			element[0].style.backgroundImage = 'url('+ scope.background +')';
			scrollService.addBackground(element[0], scope.ratio);
		};

		return {
			restrict: 'AC',
			scope: {
				background : '=',
				ratio : '='
			},
			link: scrollingBackgroundLink
		};
	}
})();
