var debug = false,
	button_active = true,
	column_1 = [],
	column_2 = [],
	column_3 = [],
	column_4 = [],
	column_5 = [],
	delay = 10,
	count = 0,
	bg_audio;
	
fill_columns(5, 59);

$(document).ready(function(){
	sound_init();
	
	$(".date_input").dateDropdowns({
    	required: true,
    	daySuffixes: false,
    	monthFormat: "numeric",
    	monthSuffixes: false,
    	dropdownClass: "drop_down_list",
    	submitFieldName: "form_target",
    	defaultDateFormat: "dd/mm/yyyy",
    	maxAge: 100
 	});
 	
 	$(".date_form").submit(function( event ) {
	 	event.preventDefault();
	 	if(button_active) {
		 	button_active = false;
			
			var date_value = $('.date_form :input[name=form_target]').val();
			var gender_value = $('.date_form :input[name=gender]').val();
			
			if(gender_value == "M") {
				var gender = "male";
			} else {
				var gender = "female";
			}
			
			var date_to_send = new Date(date_value);
			
			$.post("/date_path", {date: date_to_send, gender: gender}, function( data ) {				
				var meals_left_int = pad(parseInt(data.meals_left), 5);
				var meals_left_string_split = meals_left_int.toString();
				var digits_array = [];
				
				for (var i = 0, len = meals_left_string_split.length; i < len; i += 1) {
				    digits_array.push(+meals_left_string_split.charAt(i));
				}
				
				for(i=1; i < 5+1; i++) {
					var column_name = eval("column_" + i);
					
					column_name.push(digits_array[i-1]);
				}
				
				ticker();
			});
		}
	});
	
	$('.button__refresh').on("click", function(){
		for(i=1; i < 5+1; i++) {
			$('.' + "counter__item_" + i).empty().html('<img class="food_item" src="../imgs/food/food_' + i + '.png">');	
		}
		
		$('.date_form').trigger("reset");
		
		count = 0;
		delay = 10;
		column_1 = [];
		column_2 = [];
		column_3 = [];
		column_4 = [];
		column_5 = [];
		fill_columns(5, 59);
		button_active = true;
		
		$('.endline').fadeOut(300, function(){
		    $('.input').fadeIn(400, function() {
			    $('.second_part').css('opacity', 0);
			    $('.button__refresh').css('opacity', 0);
		    });
	    });
	});
});

function sound_init(){
	soundManager.setup({
		url: "/js/swf/",
		useHTML5Audio: true,
		preferFlash: false,
		flashVersion: 9,
		useHighPerformance: true,
		debugMode: false,
		debugFlash: false,
		flashLoadTimeout: 1000
	});
	
	soundManager.ontimeout(function(status) {
		soundManager.flashLoadTimeout = 0;
  		soundManager.onerror = {};
    	soundManager.reboot(); 
	});

	soundManager.onready(function() {
		preload();
	});
	
	function preload(){
		if(Modernizr.audio.mp3) {
			var audio_format_key = ".mp3";
		} else if(Modernizr.audio.ogg) {
			var audio_format_key = ".ogg";
		}
		
		bg_audio = soundManager.createSound({
			id: 'bg_audio_track',
			url: '/audio/cream_I_feel_free' + audio_format_key,
			volume: 10,
			autoLoad: true,
			autoPlay: true,
			loops: 6
		});
	}
}

function ticker() {
    count += 1;
    
    for(i=1; i < 5+1; i++) {
	    var column_name = eval("column_" + i);
	    
	    $('.' + "counter__item_" + i).empty().html(column_name[count-1]);
    }
    
    if (count > 30) {
        delay += 10;
    }
    if (count < 60) {
        setTimeout(ticker, delay);
    }
    
    if (count == 60) {
	    $('.input').delay(1000).fadeOut(300, function(){
		    $('.endline').fadeIn(500, function(){
			    $('.second_part').delay(600).fadeTo(300, 1, function() {
				    $('.button__refresh').delay(1500).fadeTo(300, 1);
			    });
		    });
	    });
    }
}

function fill_columns(number_of_columns, number_to_fill) {
	for(i=1; i < number_of_columns + 1; i++) {
		for(j=0; j < number_to_fill; j++) {
			var column_array = eval("column_" + i);
			
			var heads_or_tails = Math.random() < 0.5 ? -1 : 1;
			
			if(heads_or_tails < 0.5) {
				//tails
				column_array[j] = '<img class="food_item" src="../imgs/food/food_' + getRandomInt(1, 5) + '.png">';
			} else {
				//heads
				column_array[j] = getRandomInt(0, 9);
			}
		}
	}
}

//FIXING FOREACH IN IE8
if (typeof Array.prototype.forEach != 'function') {
    Array.prototype.forEach = function(callback){
      for (var i = 0; i < this.length; i++){
        callback.apply(this, [this[i], i, this]);
      }
    };
}

//PAD WITH ZEROS
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

//RANDOM NUMBER IN RANGE
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

//MOBILE DETECTION
!function(a){var b=/iPhone/i,c=/iPod/i,d=/iPad/i,e=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,f=/Android/i,g=/(?=.*\bAndroid\b)(?=.*\bSD4930UR\b)/i,h=/(?=.*\bAndroid\b)(?=.*\b(?:KFOT|KFTT|KFJWI|KFJWA|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|KFARWI|KFASWI|KFSAWI|KFSAWA)\b)/i,i=/Windows Phone/i,j=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,k=/BlackBerry/i,l=/BB10/i,m=/Opera Mini/i,n=/(CriOS|Chrome)(?=.*\bMobile\b)/i,o=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),q=function(a,b){return a.test(b)},r=function(a){var r=a||navigator.userAgent,s=r.split("[FBAN");if("undefined"!=typeof s[1]&&(r=s[0]),s=r.split("Twitter"),"undefined"!=typeof s[1]&&(r=s[0]),this.apple={phone:q(b,r),ipod:q(c,r),tablet:!q(b,r)&&q(d,r),device:q(b,r)||q(c,r)||q(d,r)},this.amazon={phone:q(g,r),tablet:!q(g,r)&&q(h,r),device:q(g,r)||q(h,r)},this.android={phone:q(g,r)||q(e,r),tablet:!q(g,r)&&!q(e,r)&&(q(h,r)||q(f,r)),device:q(g,r)||q(h,r)||q(e,r)||q(f,r)},this.windows={phone:q(i,r),tablet:q(j,r),device:q(i,r)||q(j,r)},this.other={blackberry:q(k,r),blackberry10:q(l,r),opera:q(m,r),firefox:q(o,r),chrome:q(n,r),device:q(k,r)||q(l,r)||q(m,r)||q(o,r)||q(n,r)},this.seven_inch=q(p,r),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window)return this},s=function(){var a=new r;return a.Class=r,a};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=r:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=s():"function"==typeof define&&define.amd?define("isMobile",[],a.isMobile=s()):a.isMobile=s()}(this);

//DATE DROP DOWN
/*
 *  jQuery Date Dropdowns - v1.0.0
 *  A simple, customisable date select plugin
 *
 *  Made by Chris Brown
 *  Under MIT License
 */
!function(a,b,c){"use strict";function d(b,c){return this.element=b,this.$element=a(b),this.config=a.extend({},f,c),this.internals={objectRefs:{}},this.init(),this}var e="dateDropdowns",f={defaultDate:null,defaultDateFormat:"yyyy-mm-dd",displayFormat:"dmy",submitFormat:"yyyy-mm-dd",minAge:0,maxAge:120,minYear:null,maxYear:null,submitFieldName:"date",wrapperClass:"date-dropdowns",dropdownClass:null,daySuffixes:!0,monthSuffixes:!0,monthFormat:"long",required:!1};d.message={day:"DD",month:"MM",year:"YYYY"},a.extend(d.prototype,{init:function(){this.checkForDuplicateElement(),this.setInternalVariables(),this.setupMarkup(),this.buildDropdowns(),this.attachDropdowns(),this.bindChangeEvent(),this.config.defaultDate&&this.populateDefaultDate()},checkForDuplicateElement:function(){return a('input[name="'+this.config.submitFieldName+'"]').length?(a.error("Duplicate element found"),!1):!0},setInternalVariables:function(){var a=new Date;this.internals.currentDay=a.getDate(),this.internals.currentMonth=a.getMonth()+1,this.internals.currentYear=a.getFullYear(),this.internals.monthShort=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],this.internals.monthLong=["January","February","March","April","May","June","July","August","September","October","November","December"]},setupMarkup:function(){var b,c;if("input"===this.element.tagName.toLowerCase()){this.config.defaultDate||(this.config.defaultDate=this.element.value),c=this.$element.attr("type","hidden").wrap('<div class="'+this.config.wrapperClass+'"></div>');var d=this.config.submitFieldName!==f.submitFieldName,e=this.element.hasAttribute("name");e||d?d&&this.$element.attr("name",this.config.submitFieldName):this.$element.attr("name",f.submitFieldName),b=this.$element.parent()}else c=a("<input/>",{type:"hidden",name:this.config.submitFieldName}),this.$element.append(c).addClass(this.config.wrapperClass),b=this.$element;return this.internals.objectRefs.pluginWrapper=b,this.internals.objectRefs.hiddenField=c,!0},buildDropdowns:function(){var a,b,c;return a=this.buildDayDropdown(),this.internals.objectRefs.dayDropdown=a,b=this.buildMonthDropdown(),this.internals.objectRefs.monthDropdown=b,c=this.buildYearDropdown(),this.internals.objectRefs.yearDropdown=c,!0},attachDropdowns:function(){var a=this.internals.objectRefs.pluginWrapper,b=this.internals.objectRefs.dayDropdown,c=this.internals.objectRefs.monthDropdown,d=this.internals.objectRefs.yearDropdown;switch(this.config.displayFormat){case"mdy":a.append(c,b,d);break;case"ymd":a.append(d,c,b);break;case"dmy":default:a.append(b,c,d)}return!0},bindChangeEvent:function(){var a=this.internals.objectRefs.dayDropdown,b=this.internals.objectRefs.monthDropdown,c=this.internals.objectRefs.yearDropdown,d=this,e=this.internals.objectRefs;e.pluginWrapper.on("change","select",function(){var f,g,h=a.val(),i=b.val(),j=c.val();return(f=d.checkDate(h,i,j))?(e.dayDropdown.addClass("invalid"),!1):("00"!==e.dayDropdown.val()&&e.dayDropdown.removeClass("invalid"),e.hiddenField.val(""),f||h*i*j===0||(g=d.formatSubmitDate(h,i,j),e.hiddenField.val(g)),void e.hiddenField.change())})},populateDefaultDate:function(){var a=this.config.defaultDate,b=[],c="",d="",e="";switch(this.config.defaultDateFormat){case"yyyy-mm-dd":default:b=a.split("-"),c=b[2],d=b[1],e=b[0];break;case"dd/mm/yyyy":b=a.split("/"),c=b[0],d=b[1],e=b[2];break;case"mm/dd/yyyy":b=a.split("/"),c=b[1],d=b[0],e=b[2];break;case"unix":b=new Date,b.setTime(1e3*a),c=b.getDate()+"",d=b.getMonth()+1+"",e=b.getFullYear(),c.length<2&&(c="0"+c),d.length<2&&(d="0"+d)}return this.internals.objectRefs.dayDropdown.val(c),this.internals.objectRefs.monthDropdown.val(d),this.internals.objectRefs.yearDropdown.val(e),this.internals.objectRefs.hiddenField.val(a),!0===this.checkDate(c,d,e)&&this.internals.objectRefs.dayDropdown.addClass("invalid"),!0},buildBaseDropdown:function(b){var c=b;return this.config.dropdownClass&&(c+=" "+this.config.dropdownClass),a("<select></select>",{"class":c,name:this.config.submitFieldName+"_["+b+"]",required:this.config.required})},buildDayDropdown:function(){var a,b=this.buildBaseDropdown("day"),e=c.createElement("option");e.setAttribute("value",""),e.appendChild(c.createTextNode(d.message.day)),b.append(e);for(var f=1;10>f;f++)a=this.config.daySuffixes?f+this.getSuffix(f):"0"+f,e=c.createElement("option"),e.setAttribute("value","0"+f),e.appendChild(c.createTextNode(a)),b.append(e);for(var g=10;31>=g;g++)a=g,this.config.daySuffixes&&(a=g+this.getSuffix(g)),e=c.createElement("option"),e.setAttribute("value",g),e.appendChild(c.createTextNode(a)),b.append(e);return b},buildMonthDropdown:function(){var a=this.buildBaseDropdown("month"),b=c.createElement("option");b.setAttribute("value",""),b.appendChild(c.createTextNode(d.message.month)),a.append(b);for(var e=1;12>=e;e++){var f;switch(this.config.monthFormat){case"short":f=this.internals.monthShort[e-1];break;case"long":f=this.internals.monthLong[e-1];break;case"numeric":f=e,this.config.monthSuffixes&&(f+=this.getSuffix(e))}10>e&&(e="0"+e),b=c.createElement("option"),b.setAttribute("value",e),b.appendChild(c.createTextNode(f)),a.append(b)}return a},buildYearDropdown:function(){var a=this.config.minYear,b=this.config.maxYear,e=this.buildBaseDropdown("year"),f=c.createElement("option");f.setAttribute("value",""),f.appendChild(c.createTextNode(d.message.year)),e.append(f),a||(a=this.internals.currentYear-(this.config.maxAge+1)),b||(b=this.internals.currentYear-this.config.minAge);for(var g=b;g>=a;g--)f=c.createElement("option"),f.setAttribute("value",g),f.appendChild(c.createTextNode(g)),e.append(f);return e},getSuffix:function(a){var b="";switch(a%10){case 1:b=a%100===11?"th":"st";break;case 2:b=a%100===12?"th":"nd";break;case 3:b=a%100===13?"th":"rd";break;default:b="th"}return b},checkDate:function(a,b,c){var d;if("00"!==b){var e=new Date(c,b,0).getDate(),f=parseInt(a,10);d=this.updateDayOptions(e,f),d&&this.internals.objectRefs.hiddenField.val("")}return d},updateDayOptions:function(a,b){var d=parseInt(this.internals.objectRefs.dayDropdown.children(":last").val(),10),e="",f="",g=!1;if(d>a){for(;d>a;)this.internals.objectRefs.dayDropdown.children(":last").remove(),d--;b>a&&(g=!0)}else if(a>d)for(;a>d;){e=++d,f=e,this.config.daySuffixes&&(f+=this.getSuffix(d));var h=c.createElement("option");h.setAttribute("value",e),h.appendChild(c.createTextNode(f)),this.internals.objectRefs.dayDropdown.append(h)}return g},formatSubmitDate:function(a,b,c){var d,e;switch(this.config.submitFormat){case"unix":e=new Date,e.setDate(a),e.setMonth(b-1),e.setYear(c),d=Math.round(e.getTime()/1e3);break;default:d=this.config.submitFormat.replace("dd",a).replace("mm",b).replace("yyyy",c)}return d},destroy:function(){var a=this.config.wrapperClass;if(this.$element.hasClass(a))this.$element.empty();else{var b=this.$element.parent(),c=b.find("select");this.$element.unwrap(),c.remove()}}}),a.fn[e]=function(b){return this.each(function(){if("string"==typeof b){var c=Array.prototype.slice.call(arguments,1),f=a.data(this,"plugin_"+e);if("undefined"==typeof f)return a.error("Please initialize the plugin before calling this method."),!1;f[b].apply(f,c)}else a.data(this,"plugin_"+e)||a.data(this,"plugin_"+e,new d(this,b))}),this}}(jQuery,window,document);