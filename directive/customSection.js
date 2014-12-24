(function(){
    angular
        .module('portfolioApp')
        .directive('customSection', customSectionDirective);

	customSectionDirective.$inject = ['$window','scrollService'];

//GLOBAL
	var sectionRules,
		buttonRules;

	var scrollService;


//util
	function defineAndGetCSS(){
		var sheet = document.getElementById('customSectionStyle').sheet;

		sectionRules = sheet.rules[1];
		buttonRules = sheet.rules[2];
	}



//CTRL
	function customSectionCtrl(){
		this.area = null;
		this.test = true;
	}

	customSectionCtrl.prototype = {
		link : function(area){
			this.area = area;
		},

		switchView : function(){
			if(document.body.className.length === 0){
				document.body.className = "slide";
				scrollService.lockeScroll();

			}else{
				document.body.className = "";

				setTimeout(function(){
					scrollService.unlockScroll();
				}, 1500);


			}

		}
	};

//DIRECTIVE
	function customSectionDirective($window, scrollService_){
		scrollService = scrollService_;
		defineAndGetCSS();

		function resize(e){
			sectionRules.style.height = Math.max( ( window.innerHeight - ((window.innerHeight-43)%86)+43  ), 86*4)+'px';
			buttonRules.style.right = ( window.innerWidth - 155 )+'px';
		}

		$window.addEventListener('resize', resize);
		resize();


		var customSectionLink = function(scope, element, attrs, ctrl){
			element = element[0];

			element.style.backgroundImage = 'url(../img/topHexaBorder.png), url(../img/bottomHexaBorder.png), url(../img/test.png)';

			ctrl.link( scrollService.addArea(element.offsetTop + element.parentElement.offsetTop, 400, .95) );
		};

		return {
			restrict: 'E',
			controller: customSectionCtrl,
			controllerAs: 'customsection',
			link: customSectionLink,
			scope: {
				background : '='
			},
			transclude: true,
			template: '<div ng-transclude></div> <div class="button showww" ng-click="customsection.switchView()" ng-class="{onarea: customsection.area.scrollInArea}"></div>'
		};
	}
})();