/*
* (c) Copyright 2014 Theodore Kluge. Some Rights Reserved. 
* This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 License
*/

$(
	function () {
	    $(document).keydown(
			function (event) {
                if (!col.active) {
    			    keytoggle(event);
                }
                if (col.active) {
                    col.entercol(event);
                }
			}
		);
	}
);

var disDbg = false;
var checkRestart, content, prevcontent = null;
var typspeed = 35;
var canSetClr = false;

var typ = {
    text: null,
    cTimer: null,
    tID: null,
    index: 0, // current cursor position
    speed: 0.5, // speed
    file: "", //file to type
    init: function () {

        cTimer = setInterval(function () { 
            typ.updateLC(); 
        }, 500);

        setTimeout(function() {
            clearInterval(cTimer);
            tID = setInterval(function() {
                typ.addText(1);
            }, 35/*typspeed*/);
        }, 3000); //blink the cursor for 3 sec

        setTimeout(function() {
            clearInterval(checkRestart);
            checkRestart = setInterval(function() {
                checkFinish();    
            }, 7000); //check to see if content has changed
        }, 30000); //wait 30sec before starting checks since most will be more than 30sec anyway

        $.get(typ.file, function (data) {
            typ.text = data;
        });
    },

    content: function () {
        return $(".console").html(); //get content
    },

    write: function (str) { //append to content
        $(".console").append(str);
        return false;
    },

    addText: function (key) { //main function
        if (typ.text) { //if text value is set, then
            var c = typ.content(); //get the console content
            if (c.substring(c.length - 1, c.length) == "|") { //if the last char is the blinking cursor
                $(".console").html($(".console").html().substring(0, c.length - 1)); //remove it before adding the text
            }

            if (key.keyCode != 8) { // if not backspace
                typ.index += typ.speed;	// add speed
            } else {
                if (typ.index > 0)
                    typ.index -= typ.speed;// remove speed
            }

            var text = $("<div/>").text(typ.text.substring(0, typ.index)).html(); //add stuff to consolebox
            var rtn = new RegExp("\n", "g"); //newline
            var rts = new RegExp("\\s", "g"); //whitespace
            var rtt = new RegExp("\\t", "g"); //tab

            $(".console").html(text.replace(rtn, "<br/>") //replace for newline
                .replace(rtt, "&nbsp;&nbsp;&nbsp;&nbsp;") //replace for tabs
                .replace(rts, "&nbsp;"));

            window.scrollBy(0, 50); // scroll to make sure bottom is always visible
            }

        if (key.preventDefault && key.keyCode != 122) { // prevent F11(fullscreen) from being blocked
            key.preventDefault()
        };
        if (key.keyCode != 122) { // otherway prevent keys default behavior
            key.returnValue = false;
        }

        // if ($('.console').text().length > typ.text.length) {
        //     typ.stopTyper();
        // }

        $('.debug').html('HTML: ' + typ.content().length + 
            '<br>Char: ' + $('.console').text().length + 
            '<br>Length: ' + typ.text.length +
            '<br>Using: /' + typ.file + 
            '<br>Speed: ' + typspeed + 'ms delay ' + 
            '<br>ColorT: ' + col.text + 
            '<br>ColorB: ' + col.bg);
    },

    updateLC: function () { // blinking cursor
        var c = this.content(); // get console 
        if (c.substring(c.length - 1, c.length) == "|") // if last char is the cursor
            $(".console").html($(".console").html().substring(0, c.length - 1)); // remove it
        else
            this.write("|"); // else write it
    },

    stopTyper: function() {
        clearInterval(tID);
        $('.debug').css('color','#F00');
    },

    stopCursor: function() {
        clearInterval(cTimer);
    }
}

var col = {
    text: '#0F0',
    bg: '#000',
    active: false,
    allowC1: false,
    allowC2: false,

    openPicker: function() {
        $('.colorpicker').toggle(500);
        this.allowC1 = true;
        this.active = true;
        setTimeout(function() {
        canSetClr = true;
        }, 100);
    },

    setColor: function(hex) {

        if (canSetClr) {
            if (this.allowC1) {
                $('#clr-b').css('background', hex);
                this.bg = hex;
                this.allowC2 = true;
                this.allowC1 = false;
            } else if (this.allowC2) {
                $('#clr-t').css('background', hex);
                this.text = hex;
                this.allowC2 = false;
                this.active = false;
                canSetClr = false;
                $('.colorpicker').toggle(500);
                this.set(this.bg, this.text);
            }
        }
    },

    set: function(bg, text) {
        $('body').css('background', bg);
        $('.console').css('color', text);
    },

    entercol: function(id) {
        if (id.keyCode == 48) {this.setColor('#000');} //black
        if (id.keyCode == 49) {this.setColor('#008'); } //blue
        if (id.keyCode == 50) {this.setColor('#080'); } //green
        if (id.keyCode == 51) {this.setColor('#00ffff'); } //aqua
        if (id.keyCode == 52) {this.setColor('#F00'); } //red
        if (id.keyCode == 53) {this.setColor('#85144B'); } //purple
        if (id.keyCode == 54) {this.setColor('#FF851B'); } //gold
        if (id.keyCode == 55) {this.setColor('#AAA'); } //lightgray
        if (id.keyCode == 56) {this.setColor('#888'); } //darkgray 
        if (id.keyCode == 57) {this.setColor('#0074D9'); } //lightblue 
        if (id.keyCode == 65) {this.setColor('#0F0'); } //lightgreen 
        if (id.keyCode == 66) {this.setColor('#7FDBFF'); } //lightaqua 
        if (id.keyCode == 67) {this.setColor('#FF4136'); } //lightred 
        if (id.keyCode == 68) {this.setColor('#F012BE'); } //lightpurple 
        if (id.keyCode == 69) {this.setColor('#FFDC00'); } //lightyellow 
        if (id.keyCode == 70) {this.setColor('#FFF'); } //white
    },

    entercolpre: function(b, t) {
        if (b == 0) {this.setBackground('#000');} //black
        if (b == 1) {this.setBackground('#008'); } //blue
        if (b == 2) {this.setBackground('#080'); } //green
        if (b == 3) {this.setBackground('#00ffff'); } //aqua
        if (b == 4) {this.setBackground('#F00'); } //red
        if (b == 5) {this.setBackground('#85144B'); } //purple
        if (b == 6) {this.setBackground('#FF851B'); } //gold
        if (b == 7) {this.setBackground('#AAA'); } //lightgray
        if (b == 8) {this.setBackground('#888'); } //darkgray 
        if (b == 9) {this.setBackground('#0074D9'); } //lightblue 
        if (b == 'a') {this.setBackground('#0F0'); } //lightgreen 
        if (b == 'b') {this.setBackground('#7FDBFF'); } //lightaqua 
        if (b == 'c') {this.setBackground('#FF4136'); } //lightred 
        if (b == 'd') {this.setBackground('#F012BE'); } //lightpurple 
        if (b == 'e') {this.setBackground('#FFDC00'); } //lightyellow 
        if (b == 'f') {this.setBackground('#FFF'); } //white

        /*switch (b) { //alternate way
            case 0: this.setBackground('#111'); break;
        }*/

        if (t == 0) {this.setTextC('#000');} //black
        if (t == 1) {this.setTextC('#008'); } //blue
        if (t == 2) {this.setTextC('#080'); } //green
        if (t == 3) {this.setTextC('#00ffff'); } //aqua
        if (t == 4) {this.setTextC('#F00'); } //red
        if (t == 5) {this.setTextC('#85144B'); } //purple
        if (t == 6) {this.setTextC('#FF851B'); } //gold
        if (t == 7) {this.setTextC('#AAA'); } //lightgray
        if (t == 8) {this.setTextC('#888'); } //darkgray 
        if (t == 9) {this.setTextC('#0074D9'); } //lightblue 
        if (t == 'a') {this.setTextC('#0F0'); } //lightgreen 
        if (t == 'b') {this.setTextC('#7FDBFF'); } //lightaqua 
        if (t == 'c') {this.setTextC('#FF4136'); } //lightred 
        if (t == 'd') {this.setTextC('#F012BE'); } //lightpurple 
        if (t == 'e') {this.setTextC('#FFDC00'); } //lightyellow 
        if (t == 'f') {this.setTextC('#FFF'); } //white
    },
    setBackground: function(hex) {
        console.log('setbg ' + hex);
        this.bg = hex;
        $('body').css('background', hex);
    },
    setTextC: function(hex) {
        console.log('settextc ' + hex);
        this.text = hex;
        $('.console').css('color', hex);
    }
}

keytoggle = function (id) {
    if (id.keyCode == 68) {
        $('.debug').toggle(500);
    }
    if (id.keyCode == 82) {
        $('.readme').toggle(500);
    }
    if (id.keyCode == 67) {
        if (!col.active) {
            col.openPicker();
            
        }
    }
}

checkFinish = function() {

    prevcontent = content;
    content = typ.content();

    if (content == prevcontent) {

        $('.console').empty();

        typ.text = null;
        typ.cTimer = null;
        typ.tID = null;
        typ.index = 0;
        typ.file = '';

        var fileToUse = ['/cscroller/js/main.js',
            'css/style.css',
            'index.html',
            'texts/colormath.js',
            'texts/login.notaphpfile',
            'texts/foxy.txt',
            'texts/villa7.txt',
            'texts/readme.txt'];

        var rand = Math.floor(Math.random() * fileToUse.length);

        typ.file = fileToUse[rand];
        console.log('Using random: ' + rand);
        console.log('Using file "' + typ.file + '"');

        typ.init();
    }

}

getParamByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

console.log(getParamByName('b'), getParamByName('t'));