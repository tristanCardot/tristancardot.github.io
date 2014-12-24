angular.module('portfolioApp', [

]);


function loadStyleSheet(url){
	var style = document.createElement('style');

	var xmlhttp;

	if (window.XMLHttpRequest)
	  xmlhttp = new XMLHttpRequest();
	else
	  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");

	xmlhttp.onloadend = function(data){
		style.innerHTML = data.target.responseText;
		style.convert();
		document.head.appendChild(style);

};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}


(['css/style.css','directive/hexagon/hexagon.css','directive/hexagon/hexagon.css','directive/lineTitle/lineTitle.css','directive/iconHeader/iconHeader.css'])
.forEach(function(url){
	loadStyleSheet(url);
});