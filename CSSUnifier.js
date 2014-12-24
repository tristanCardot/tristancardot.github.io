/* * * * * * * * * * * * * * * * * * * * * * * * * * *\
 *    ____ ____ ____  _   _       _  __ _            *
 *   / ___/ ___/ ___|| | | |_ __ (_)/ _(_) ___ _ __  *
 *  | |   \___ \___ \| | | | '_ \| | |_| |/ _ \ '__| *
 *  | |___ ___) |__) | |_| | | | | |  _| |  __/ |    *
 *   \____|____/____/ \___/|_| |_|_|_| |_|\___|_|    *
 *                                                   *
\* * * * * * * * * * * * * * * * * * * * * * * * * * */

(function(){
	/** liste des propriétées à tester
	  * @type Array.<string> */
	var properties = ['transform', 'transformOrigin', 'transformStyle', 
	                  'animation', 'animation-delay', 
	                  'transition', 'transition-property', 'transition-timing-function', 'transition-duration', 'transition-delay'];

	/** valeurs particuliéres
	  * @type Object.<property, Array.<string>> */
	var values = {//property : [ type    , une implementation valide ]
		'linear-gradient' : ['background','linear-gradient(top,red,red)']
	};

	var CSSP = CSSStyleDeclaration.prototype;
	var tester = document.createElement('div').style;

	//le préfix utilisé par le navigateur [chrome, safari, opera, firefox, ie]
	window.NAV = (function(){
		var NAV, agent = navigator.userAgent.toLowerCase();

		if(/webkit/.test(agent) || /safari/.test(agent))
			NAV = 'webkit';
		else if(/opera/.test(agent))
			NAV = 'o';
		else if(/\) gecko/.test(agent))
			NAV = 'Moz';
		else
			NAV = 'ms';

		return NAV;
	})();

	for(key in values){
		tester[ values[key][0] ] = "";
		tester[ values[key][0] ] = values[key][1];

		if(tester[ values[key][0] ] === undefined){
			values[key] = '-'+ NAV.toLowerCase() +'-'+ key;

			if(NAV === 'o' && (tester[ values[key][0] ] = values[key][1]) === "")
				target = '-webkit-' + values[key].slice(1);

		}else
			values[key] = key;
	}

//get keyFrames
	var tab = (function(){
		var sheet,
			value = ['keyframes'],
			style = document.createElement('style');
		document.head.appendChild(style);
		sheet = style.sheet;

		try{
			sheet.insertRule('@keyframes{0%{top:0;}}', 0);
			value.push('keyframes');
		}catch(e){
			value.push('-'+ NAV +'-keyframes');
		}

		document.head.removeChild(style);

		return value;
	})();

	if(tab[0] !== tab[1])
		values[tab[0]] = tab[1];
//end keyFrames

	for(var i=0, property, target; i<properties.length; i++){
		property = properties[i];

		if(tester[property] !== undefined)
			continue;

		target = NAV + property.slice(0,1).toUpperCase() + property.slice(1);
		if(NAV === 'o' && tester[target] === undefined)
			target = 'webkit' + target.slice(1);

		if(tester[target] === undefined)
			continue;

		Object.defineProperty(CSSP, property, {
			get : new Function("return this."+ target +";"),
			set : new Function('v', "this."+ target +"=v;")
		});

		property = property.replace(/[A-Z]/g, function(v){return '-'+v.toLowerCase()});
		values[property] = '-'+ NAV.toLowerCase() +'-'+ property;
	}

	/** methode pour modifier plusieurs valeurs d'un CSSStyleDeclaration 
	  * @param {Object.<property, newValue>} properties */
	CSSP.setProperties = function(properties){
		for(key in properties)
			this[key] = properties[key];
	};

	/** methode pour récupérer plusieurs valeurs d'un CSSStyleDeclaration 
	  * @param {Array.<property>} properties 
	  * @type Object.<property, value> */
	CSSP.getProperties = function(properties){
		var list = {};

		for(var i=0, key; i<properties.length; i++){
			key = properties[i];
			list[key] = this[key];
		}

		return list;
	};

	var string = "(;| |@|	|:|,)(keyframes|";
	for(key in values)
		string += key +"|";
	string = string.slice(0,string.length-1) +")";

	/** le regexp utilisé pour la convertion d'un HTMLStyleElement 
	  * @type RegExp */
	HTMLStyleElement.prototype.REGEXP = new RegExp(string, 'g');

	/** convertis le contenu de l'élément pour l'adapter au navigateur */
	HTMLStyleElement.prototype.convert = function(){
		this.innerHTML = this.innerHTML.replace(this.REGEXP, function(v){
			return v.slice(0,1) + (values[v.slice(1)] || v.slice(1));
		});
	};

	/** retourne la propriété adapté au navigateur
	  * @param {string} name
	  * @type string */
	window.cssValue = function(name){
		if(values[name])
			return values[name];
		else
			return name;
	};
})();