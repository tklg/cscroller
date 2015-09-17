var d = new Date();
var angleS, angleM, angleH = 0;
var tA = 1;
var tB = 1;
var tC = 1;
var s = d.getSeconds();
var m = d.getMinutes();
var h = d.getHours();
var winHeight = $(window).height();
var winWidth = $(window).width();
var widthSpace = 10; /*Space width in px*/
var widthFont = 10; /*font width in px*/
var doit;

getQueryString = function(name) { //duplicate funstions yay
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(window).resize(function() {
  clearTimeout(doit);
  doit = setTimeout(function() {
    winHeight = $(window).height();
    winWidth = $(window).width();
    wordClockRound.setRads(); //doesnt work
    console.log('resized');
}, 500);
});

var cFI = getQueryString('f');
var cFA = getQueryString('a');
var cBG = getQueryString('b');
var typeToLinkTo = getQueryString('type');

        if(cFI === '') {
            var colorFontInactive = '#555';
            console.log('Color for inactive font not defined');
        } else {
            var colorFontInactive = '#' + cFI;
            console.log("Set inactive color to #" + cFI);
        }
        if(cFA === '') {
            var colorFontActive = '#0F0';
            console.log('Color for active font not defined');
        } else {
            var colorFontActive = '#' + cFA;
            console.log("Set active color to #" + cFA);
        }
        if(cBG === '') {
            var colorBackground = "#000";
            $('body').css('background-color','#000');
            console.log('Color for background not defined');
        } else {
            var bgColHex = '#' + cBG;
            $('html').css('background-color',bgColHex);
            var colorBackground = '#' + cBG;
            console.log("Set background color to #" + $('html').css('background-color') + ' : ' + bgColHex);
        }

var wordClockRound = {

    init: function() {

        setCSS();

        if (h > 12) {
            h -= 12; //12 hour time
        }
		//console.log(h+':'+m+':'+s);

		$('#a1').css({
            	'-webkit-transform': 'rotate(' + (s * -6 + 6) + 'deg)',
            	'transform': 'rotate(' + (s * -6 + 6) + 'deg)'
            });
        $('#a2').css({
            	'-webkit-transform': 'rotate(' + (m * -6 + 6) + 'deg)',
            	'transform': 'rotate(' + (m * -6 + 6) + 'deg)'
            });
        $('#a3').css({
            	'-webkit-transform': 'rotate(' + (h * -30 + 30) + 'deg)',
            	'transform': 'rotate(' + (h * -30 + 30) + 'deg)'
            });

        var angle = 0;

        for (var i = 0; i <= 60; i++) { //set initial angles of seconds strings
            var div = '.sec' + (i + 1);
            var tc = colorFontInactive;

            $(div).css({
                '-webkit-transform': 'rotate(' + angle + 'deg)',
                'transform': 'rotate(' + angle + 'deg)',
                'color': tc
            })
            angle += 6;
        };

        angle = 0; //reset to 0 for the next circle

        for (var i = 0; i <= 60; i++) { //and for the minute strings
            var div = '.min' + (i + 1);
            var tc = colorFontInactive;

            $(div).css({
                '-webkit-transform': 'rotate(' + angle + 'deg)',
                'transform': 'rotate(' + angle + 'deg)',
                'color': tc
            })
            angle += 6;
        };

        angle = 0;

        for (var i = 0; i <= 12; i++) { //and the hour strings
            var div = '.hou' + (i + 1);
            var tc = colorFontInactive;

            $(div).css({
                '-webkit-transform': 'rotate(' + angle + 'deg)',
                'transform': 'rotate(' + angle + 'deg)',
                'color': tc
            })
            angle += 30;
        };

        if (s > 1) {
            $('#a6').css({
                '-webkit-transform': 'rotate(6deg)',
                'transform': 'rotate(6deg)'
                });
            $('.second').css('color',colorFontInactive);
            $('.seconds').css('color',colorFontActive);
        }

        angleS = (s * -6 + 6);
        angleM = (m * -6 + 6);
        angleH = (h * -30 + 30);
        tA = s;
        tB = m;
        tC = h;
        wordClockRound.setColors(); //set colors of things that are not time  
        colChange('sec');
        colChange('min');
        colChange('hou');

        setRadius('min');
        setRadius('and');
        setRadius('sec');
        setRadius('seclab');

        //wordClockRound.setTranSpeed.remTrans();
        setInterval(wordClockRound.inc, 1000);
        in_out.enterAnim();

    },

    setTranSpeed: {
        hasBeenEnabled: false,

        remTrans: function() {
            $('.arc').css({
                '-webkit-transition': 'all 0s ease',
                'transition': 'all 0s ease',
            });
        },

        addTrans: function(speed) {
            $('.arc').css({
                '-webkit-transition': 'all '+speed+'s ease',
                'transition': 'all '+speed+'s ease',
            });
        }
    },

    inc: function() {

        if (!wordClockRound.setTranSpeed.hasBeenEnabled) {
            wordClockRound.setTranSpeed.addTrans(0.2);
            wordClockRound.setTranSpeed.hasBeenEnabled = true;
            console.log("If this is spamming console something is wrong");
        }
            tA++;
            angleS -= 6;
            angAnimS = angleS - 0.8;
            $('#a1').css({
                	'-webkit-transform': 'rotate(' + angAnimS + 'deg)',
                	'transform': 'rotate(' + angAnimS + 'deg)'
                });
            setTimeout(function() {
            angAnimS += 0.8;
            $('#a1').css({
                	'-webkit-transform': 'rotate(' + angAnimS + 'deg)',
                	'transform': 'rotate(' + angAnimS + 'deg)'
                });
            }, 176);
            colChange('sec');

            if (tA == 60) {
            	//console.log("minute");
    			angleM -= 6;
            	$('#a2').css({
                	'-webkit-transform': 'rotate(' + angleM + 'deg)',
                	'transform': 'rotate(' + angleM + 'deg)'
                	});
            	tA = 0;
            	colChange('min');
            	tB++;
            }
            if (tB == 60) {
    			angleH -= 30;
            	$('#a3').css({
                	'-webkit-transform': 'rotate(' + angleH + 'deg)',
                	'transform': 'rotate(' + angleH + 'deg)'
                	});
            	tB = 0;
            	colChange('hou');
            	tC++;
            }
            if (tC == 12) {
            	tC = 0;
            }
        //stuff to change the angle of the second/seconds and and
        wordClockRound.setColors();   
        wordClockRound.setRads();
    },

    setRads: function() {
        //change distance between each timestring because words are different lengths
        setRadius('min');
        setRadius('and');
        setRadius('sec');
        setRadius('seclab');
    },

    setColors: function() {
        if (tA > 1) {
            $('#a6').css({
                '-webkit-transform': 'rotate(6deg)',
                'transform': 'rotate(6deg)'
                });
            $('.second').css('color',colorFontInactive);
            $('.seconds').css('color',colorFontActive);
            $('.and').css('color',colorFontActive);
        } else if (tA == 1) {
            $('#a6').css({
                '-webkit-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
                });
            $('#a5').css({
                '-webkit-transform': 'rotate(0deg)',
                'transform': 'rotate(0deg)'
            })
            $('.second').css('color',colorFontActive);
            $('.seconds').css('color',colorFontInactive);
            $('.and').css('color',colorFontActive);
        } else if (tA == 0) {
            $('#a6').css({
                '-webkit-transform': 'rotate(3deg)',
                'transform': 'rotate(3deg)'
                });
            $('#a5').css({
                '-webkit-transform': 'rotate(6deg)',
                'transform': 'rotate(6deg)'
            })
            $('.second').css('color',colorFontInactive);
            $('.seconds').css('color',colorFontInactive);
            $('.and').css('color',colorFontInactive);
        }
    }
}

getActive = function(arc) { //get active number
	if (arc == 'sec') {
		active = angleS / -6;
		if (active > 60) {
			active = active % 60;
		}
        if (active == 60) {
            return ['.sec1', '.sec' + active];
        } else {
            return ['.sec' + (active + 1), '.sec' + active];
        }
	}

	if (arc == 'min') {
		active = angleM / -6;
		if (active > 60) {
			active = active % 60;
		}
        if (active == 60) {
            return ['.min1', '.min' + active];
        } else {
		    return ['.min' + (active + 1), '.min' + active];
        }
	}

	if (arc == 'hou') {
		active = angleH / -30;
		if (active > 12) {
			active = active % 12;
		}
        if (active == 12) {
            return ['.hou1', '.hou' + active];
        } else {
		    return ['.hou' + (active + 1), '.hou' + active];
        }
	}
}

getWidth = function(arc) { //get width, in pixels, of the active number
		activeDiv = getActive(arc);
		strLen = $(activeDiv[0]).text().length;
        return strLen * widthFont;
}

setRadius = function(arc) {
    if (arc == 'min') {
//minutes dont move
    }
    if (arc == 'and') {
        r = tw.min();
        arcAnd.width = (r * 2);
        arcAnd.height = (r * 2);
        arcAnd.radius = r;
        setCSS();
    }
    if (arc == 'sec') {
        r = tw.and();
        arcSeconds.width = (r * 2);
        arcSeconds.height = (r * 2);
        arcSeconds.radius = r;
        setCSS();
    }
    if (arc == 'seclab') {
        r = tw.sec();
        arcSecondsLabel.width = (r * 2);
        arcSecondsLabel.height = (r * 2);
        arcSecondsLabel.radius = r;
        setCSS();
    }
}

var tw = { //find total width
    hou: function() {
        width = vhToPx(arcHours.radius) + getWidth('hou');
        return pxToVh(width + widthSpace);
    },

    min: function() {
        width = vhToPx(arcMinutes.radius) + getWidth('min');
        return pxToVh(width + widthSpace);
    },

    sec: function() {
        width = vhToPx(arcSeconds.radius) + getWidth('sec');
        return pxToVh(width + widthSpace);
    },

    and: function() {
        if (tA != 0) {
            width = vhToPx(arcAnd.radius) + (widthFont * 3); //"and" is 30px wide
        } else {
            width = vhToPx(arcAnd.radius) - widthSpace;
        }
        return pxToVh(width + widthSpace);
    }
}

colChange = function(arc) { //change color of stuff
    	activeDiv = getActive(arc);

    	if (activeDiv[0] == '.' + arc + '61') { //this fixes problem with it counting to 61
    		$('.' + arc + '60').css('color',colorFontInactive);
    		$('.' + arc + '1').css('color',colorFontActive);
    	}
    	if (activeDiv[0] != '.' + arc + '60') { //fixes problem with 'precisely' staying lit
    		$('.' + arc + '60').css('color',colorFontInactive);
    	}
    	if (activeDiv[0] == '.hou0') { //this fixes problem with hours at 0
    		$('.' + arc + '1').css('color',colorFontInactive);
    		$('.' + arc + '12').css('color',colorFontActive);
    	}
    	$(activeDiv[0]).css({'color':colorFontActive,'z-index':10});
    	$(activeDiv[1]).css({'color':colorFontInactive,'z-index':1});
    }

var arcSeconds = {
    width: 70,
    height: 70,
    radius: 35
}
var arcMinutes = {
    width: 36,
    height: 36,
    radius: 18
}
var arcHours = {
    width: 34,
    height: 34,
    radius: 17
}
var arcAnd = {
    width: 62,
    height: 62,
    radius: 31
}
var arcSecondsLabel = {
    width: 90,
    height: 90,
    radius: 45
}

vhToPx = function(vh) {
    px = winHeight * (vh / 100);
    return px;
}
pxToVh = function(px) {
    vh = (px / winHeight) * 100;
    return vh;
}
setCSS = function() { //makes it easier to change values of size and stuff

    $('.arc-seconds').css({
        'width':arcSeconds.width + 'vh',
        'height':arcSeconds.height + 'vh',
        'border-radius':arcSeconds.radius + 'vh'
    });
    $('.arc-minutes').css({
        'width':arcMinutes.width + 'vh',
        'height':arcMinutes.height + 'vh',
        'border-radius':arcMinutes.radius + 'vh'
    });
    $('.arc-hours').css({
        'width':arcHours.width + 'vh',
        'height':arcHours.height + 'vh',
        'border-radius':arcHours.radius + 'vh'
    });
    $('.arc-and').css({
        'width':arcAnd.width + 'vh',
        'height':arcAnd.height + 'vh',
        'border-radius':arcAnd.radius + 'vh'
    });
    $('.arc-secondslabel').css({
        'width':arcSecondsLabel.width + 'vh',
        'height':arcSecondsLabel.height + 'vh',
        'border-radius':arcSecondsLabel.radius + 'vh'
    });
    $('span.sec').css({
        '-webkit-transform-origin': '-' + arcSeconds.radius + 'vh center',
        '-moz-transform-origin': '-' + arcSeconds.radius + 'vh center',
        'transform-origin': '-' + arcSeconds.radius + 'vh center'
    });
    $('span.min').css({
        '-webkit-transform-origin': '-' + arcMinutes.radius + 'vh center',
        '-moz-transform-origin': '-' + arcMinutes.radius + 'vh center',
        'transform-origin': '-' + arcMinutes.radius + 'vh center'
    });
    $('span.hou').css({
        '-webkit-transform-origin': 'left center',
        '-moz-transform-origin': 'left center',
        'transform-origin': 'left center'
    });
    $('span.and').css({
        '-webkit-transform-origin': '-' + arcAnd.radius + 'vh center',
        '-moz-transform-origin': '-' + arcAnd.radius + 'vh center',
        'transform-origin': '-' + arcAnd.radius + 'vh center'
    });
    $('span.second').css({
        '-webkit-transform-origin': '-' + arcSecondsLabel.radius + 'vh center',
        '-moz-transform-origin': '-' + arcSecondsLabel.radius + 'vh center',
        'transform-origin': '-' + arcSecondsLabel.radius + 'vh center'
    });
    $('span.seconds').css({
        '-webkit-transform-origin': '-' + arcSecondsLabel.radius + 'vh center',
        '-moz-transform-origin': '-' + arcSecondsLabel.radius + 'vh center',
        'transform-origin': '-' + arcSecondsLabel.radius + 'vh center'
    });
}

var in_out = {
    enterAnim: function() {
        var i = 1;
        var c = 1;
        var u = 1;

        var enterAnimation = setInterval(function() {
            $('span.hou.hou' + i).fadeIn(700);
            i++;
            if (i > 13) {
                $('span.min.min' + c).fadeIn(1000);
                c++;
                if (c > 61) {
                    $('span.and').fadeIn(500);
                    $('span.sec.sec' + u).fadeIn(700);
                    u++;
                    if (u == 61) {
                        $('span.seconds, span.second').fadeIn(500);
                        clearInterval(enterAnimation);
                    }
                }
            }
        }, 20);

    },

    exitAnim: function() {
        $('.arc-seconds, .arc-secondslabel').addClass('animated bounceOutDown');
        $('a.config').removeClass('bounceInDown');
        $('a.config').addClass('bounceOutUp');
        setTimeout(function() {
            $('.arc-minutes, .arc-and').addClass('animated bounceOutLeft');
            setTimeout(function() {
            $('.arc-hours').addClass('animated bounceOutRight');
            }, 300);
        }, 300);
        setTimeout(function() {
            document.location = ($('a.config').attr('linky'));
        }, 1200);
    }
}