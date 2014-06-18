/*
* (c) Copyright 2014 Theodore Kluge. Some Rights Reserved. 
* This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 License
*/

$(
	function () {
	    $(document).keydown(
			function (event) {
			    keytoggle(event);
			}
		);
	}
);

var disDbg = false;

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

        if (typ.file == 'texts/foxy.txt') {
            var typspeed = 10;
        } else {
            var typspeed = 35;
        }

        setTimeout(function() {
            clearInterval(cTimer);
            tID = setInterval(function() {
                typ.addText(1);
            }, typspeed);
        }, 3000);

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

        $('.debug').html('HTML: ' + typ.content().length + '<br>Char: ' + $('.console').text().length + '<br>Length: ' + typ.text.length);
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

keytoggle = function (id) {
    if (id == 68) {
        if (!disDbg) {
            $('.debug').css('display','block');
        } else {
            $('.debug').css('display','none');
        }
    }
}

