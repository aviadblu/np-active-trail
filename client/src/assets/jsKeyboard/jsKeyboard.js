/**
 * Created by AvB on 19/07/2015.
 */
const jsKeyboard = {
    settings: {
        buttonClass: "button", // default button class
        onclick: "jsKeyboard.write();", // default onclick event for button
        keyClass: "key", // default key class used to define style of text of the button
        text: {
            close: "close"
        },
        lang: "he",
        switchBack: false
    },
    "keyboard": [], // different keyboards can be set to this variable in order to switch between keyboards easily.
    init: function (elem, keyboard) {

        //$("body").append('<div class="he" #keyboardWrapper id="LPVirtualKeyboard"></div>');

        jsKeyboard.keyboard["default"] = jsKeyboard.defaultKeyboard;
        jsKeyboard.keyboardLayout = "LPVirtualKeyboard";

        if (keyboard != null && keyboard != undefined)
            jsKeyboard.generateKeyboard(keyboard);
        else
            jsKeyboard.generateKeyboard("default");

        jsKeyboard.addKeyDownEvent();

        jsKeyboard.show();
        $(':input').not('[type="button"]').not('[type="reset"]').not('[type="submit"]').not('[type="radio"]').not('[type="checkbox"]').on('focus, click', function (e) {
            let id = $(this)[0].id;
            if(id === 'field20_textBox' && jsKeyboard.settings.lang === "he") {
                jsKeyboard.switchLang();
                jsKeyboard.switchBack = true;
            }
            else if(jsKeyboard.switchBack){
                jsKeyboard.switchLang();
                jsKeyboard.switchBack = false;
            }

            jsKeyboard.currentElement = $(this);
            jsKeyboard.currentElementCursorPosition = $(this).getCursorPosition();
            //console.log('keyboard is now focused on ' + jsKeyboard.currentElement.attr('name') + ' at pos(' + jsKeyboard.currentElementCursorPosition + ')');
        });
    },

    destroy: function() {
        $("#LPVirtualKeyboard").remove();
    },

    setSize: function(size) { //small large
        let sizes_class = {
            large: "",
            small: "sm"
        };

        if(sizes_class[size]) {
            $("#LPVirtualKeyboard").removeAttr('class');
            $("#LPVirtualKeyboard").attr('class', '');
            $('#LPVirtualKeyboard')[0].className = '';
            $("#LPVirtualKeyboard").addClass(sizes_class[size]);
        }
    },

    focus: function (t) {
        jsKeyboard.currentElement = $(t);
        jsKeyboard.show();
    },
    keyboardLayout: "", // it shows the html element where keyboard is generated
    currentKeyboard: "default", // it shows the which keyboard is used. If it's not set default keyboard is used.
    currentElement: null,
    generateKeyboard: function (keyboard) {
        let bClass = "";
        let kClass = "";
        let onclick = "";
        let text = "";
        let button_id_c = 0;

        let s = "";
        s += "<div id=\"keyboard\">";
        s += "<div id=\"keyboardHeader\">";
        // s += "<div onclick=\"jsKeyboard.hide();\"><span>" + jsKeyboard.settings.text.close + "</span><span class=\"closex\"> X</span></div>"
        s += "</div>";

        /*small letter */
        s += "<table id=\"keyboardSmallLetter\">";
        $.each(jsKeyboard.keyboard[keyboard].smallLetter, function () {
            s += "<tr class=\"jsKeyboardRow\">";
            $(this).each(function (i, key) { generate(key); });
            s += "</tr>";
        });
        s += "</table>";

        /*hebrew */
        s += "<table id=\"keyboardHebrew\">";
        $.each(jsKeyboard.keyboard[keyboard].hebrew, function () {
            s += "<tr class=\"jsKeyboardRow\">";
            $(this).each(function (i, key) { generate(key); });
            s += "</tr>";
        });
        s += "</table>";

        /*capital letter*/
        s += "<table id=\"keyboardCapitalLetter\">";
        $.each(jsKeyboard.keyboard[keyboard].capitalLetter, function () {
            s += "<tr class=\"jsKeyboardRow\">";
            $(this).each(function (i, key) { generate(key); });
            s += "</tr>";
        });
        s += "</table>";

        /*number*/
        s += "<table id=\"keyboardNumber\">";
        $.each(jsKeyboard.keyboard[keyboard].number, function () {
            s += "<tr class=\"jsKeyboardRow\">";
            $(this).each(function (i, key) { generate(key); });
            s += "</tr>";
        });
        s += "</table>";

        /*symbols*/
        s += "<table id=\"keyboardSymbols\">";
        $.each(jsKeyboard.keyboard[keyboard].symbols, function () {
            s += "<tr class=\"jsKeyboardRow\">";
            $(this).each(function (i, key) { generate(key); });
            s += "</tr>";
        });
        s += "</table>";

        function generate(key) {
            button_id_c++;
            let id = "btn_" + button_id_c;
            let show_click_fn = "jsKeyboard.showClick(" + button_id_c + ")";
            bClass = key.buttonClass == undefined ? jsKeyboard.settings.buttonClass : key.buttonClass;
            kClass = key.keyClass == undefined ? jsKeyboard.settings.keyClass : key.keyClass;
            onclick = key.onclick == undefined ? jsKeyboard.settings.onclick.replace("()", "(" + key.value + ")") + show_click_fn : key.onclick + show_click_fn;



            text = (key.isChar != undefined || key.isChar == false) ? key.value : String.fromCharCode(key.value);

            s += "<td id=\"" + id + "\" class=\"" + bClass + "\" onclick=\"" + onclick + "\"><div class=\"" + kClass + "\">" + text + "</div></td>";

            bClass = ""; kClass = ""; onclick = ""; text = "";
        }

        $("#" + jsKeyboard.keyboardLayout).html(s);
    },
    addKeyDownEvent: function () {
        $("#keyboardCapitalLetter > div.button, #keyboardSmallLetter > div.button, #keyboardHebrew > div.button, #keyboardNumber > div.button, #keyboardSymbols > div.button").
            bind('mousedown', (function () { $(this).addClass("buttonDown"); })).
            bind('mouseup', (function () { $(this).removeClass("buttonDown"); })).
            bind('mouseout', (function () { $(this).removeClass("buttonDown"); }));

        //key focus down on actual keyboard key presses
        //todo:....

    },
    changeToSmallLetter: function () {
        $("#keyboardHebrew,#keyboardCapitalLetter,#keyboardNumber,#keyboardSymbols").css("display", "none");
        $("#keyboardSmallLetter").css("display", "block");
    },
    changeToHebrew: function () {
        $("#keyboardSmallLetter,#keyboardCapitalLetter,#keyboardNumber,#keyboardSymbols").css("display", "none");
        $("#keyboardHebrew").css("display", "block");
    },
    switchLang: function() {
        if(jsKeyboard.settings.lang === "en") {
            jsKeyboard.settings.lang = "he";
            jsKeyboard.changeToHebrew();
            $(".button_lang .key").text("English");
            $(".button_lang_short .key").text("EN");
            $("#LPVirtualKeyboard").addClass("he");
        }
        else {
            jsKeyboard.settings.lang = "en";
            jsKeyboard.changeToSmallLetter();
            $(".button_lang .key").text("עברית");
            $(".button_lang_short .key").text("HE");
            $("#LPVirtualKeyboard").removeClass("he");
        }

    },
    changeToCapitalLetter: function () {
        $("#keyboardCapitalLetter").css("display", "block");
        $("#keyboardSmallLetter,#keyboardHebrew,#keyboardNumber,#keyboardSymbols").css("display", "none");
    },
    changeToNumber: function () {
        $("#keyboardNumber").css("display", "block");
        $("#keyboardSymbols,#keyboardCapitalLetter,#keyboardSmallLetter,#keyboardHebrew").css("display", "none");
    },
    changeToSymbols: function () {
        $("#keyboardCapitalLetter,#keyboardNumber,#keyboardSmallLetter,#keyboardHebrew").css("display", "none");
        $("#keyboardSymbols").css("display", "block");
    },
    updateCursor: function () {
        //input cursor focus and position during typing
        jsKeyboard.currentElement.setCursorPosition(jsKeyboard.currentElementCursorPosition);
    },
    write: function (m) {
        if(!jsKeyboard.currentElement)
            return;

        let a = jsKeyboard.currentElement.val(),
            b = String.fromCharCode(m),
            pos = jsKeyboard.currentElementCursorPosition,
            output = [a.slice(0, pos), b, a.slice(pos)].join('');
        jsKeyboard.currentElement.val(output);
        jsKeyboard.currentElementCursorPosition++; //+1 cursor
        jsKeyboard.updateCursor();
    },
    showClick: function(id) {
        $("#btn_" + id)
            .addClass("active")
            .delay(200)
            .queue(function(next) {
                $(this).removeClass("active");
                next();
            });
    },
    del: function () {

        if(!jsKeyboard.currentElement)
            return;

        let a = jsKeyboard.currentElement.val(),
            output = a.substr(0,a.length - 1);

        jsKeyboard.currentElement.val(output);
        jsKeyboard.currentElementCursorPosition--; //-1 cursor
        if (jsKeyboard.currentElementCursorPosition < 0)
            jsKeyboard.currentElementCursorPosition = 0;
        jsKeyboard.updateCursor();

        jsKeyboard.currentElement.focus();
    },
    enter: function () {
        if(!jsKeyboard.currentElement)
            return;

        let t = jsKeyboard.currentElement.val();
        jsKeyboard.currentElement.val(t + "\n");
    },
    space: function () {
        if(!jsKeyboard.currentElement)
            return;
        let a = jsKeyboard.currentElement.val(),
            b = " ",
            pos = jsKeyboard.currentElementCursorPosition,
            output = [a.slice(0, pos), b, a.slice(pos)].join('');
        jsKeyboard.currentElement.val(output);
        jsKeyboard.currentElementCursorPosition++; //+1 cursor
        jsKeyboard.updateCursor();
    },
    writeSpecial: function (m) {
        if(!jsKeyboard.currentElement)
            return;
        let a = jsKeyboard.currentElement.val(),
            b = m,
            pos = jsKeyboard.currentElementCursorPosition,
            output = [a.slice(0, pos), b, a.slice(pos)].join('');
        jsKeyboard.currentElement.val(output);
        jsKeyboard.currentElementCursorPosition += b.length; //+n cursor
        jsKeyboard.updateCursor();
    },
    show: function () {
        $("#keyboard").animate({ "bottom": "0" }, "slow", function () { });
    },
    hide: function () {
        $("#keyboard").animate({ "bottom": "-350px" }, "slow", function () { });
    },
    defaultKeyboard: {
        capitalLetter:
            [
                [
                    {value: "English", isChar: "false", buttonClass: "button button_lang", onclick: "jsKeyboard.switchLang();" },
                    {value: 49 }, { value: 50 }, { value: 51 }, { value: 52 }, { value: 53 }, { value: 54 },
                    { value: 55 }, { value: 56 }, { value: 57 }, { value: 48 },
                    {value: "&#8592;", isChar: "false", buttonClass: "button button_backspace", onclick: "jsKeyboard.del();" }],
                // 1st row
                [{value: 81 }, { value: 87 }, { value: 69 }, { value: 82 }, { value: 84 }, { value: 89 },
                    { value: 85 }, { value: 73 }, { value: 79 }, { value: 80 }, { value: 40 }, { value: 41 }, { value: 45, buttonClass: "button button_minus" }/*,
                 { value: "Delete", isChar: "false", onclick: "jsKeyboard.del()", buttonClass: "button button_del", keyClass: "key key_del" }*/],
                // 2nd row
                [{value: 65, buttonClass: "button button_a" }, { value: 83 }, { value: 68 }, { value: 70 },
                    { value: 71 }, { value: 72 }, { value: 74 }, { value: 75 }, { value: 76 }, { value: 34 }, { value: 95 }/*,
                 { value: "Enter", isChar: "false", buttonClass: "button button_enter", onclick: "jsKeyboard.enter();", keyClass: "key key_enter" }*/],
                // 3rd row
                [{value: "abc", isChar: "false", buttonClass: "button button_smallletter", onclick: "jsKeyboard.changeToSmallLetter();", keyClass: "key key_smallletter" },
                    { value: 90 }, { value: 88 }, { value: 67 }, { value: 86 }, { value: 66 }, { value: 78 },
                    { value: 77 }, { value: 44 }, { value: 46 }, { value: 63 }, { value: 33 }],
                // 4th row
                [

                    {value: "EN", isChar: "false", buttonClass: "button button_lang_short", onclick: "jsKeyboard.switchLang();" },
                    { value: 64, buttonClass: "button button_shh" },
                    { value: "Space", isChar: "false", buttonClass: "button button_space", onclick: "jsKeyboard.space();", keyClass: "key key_space" },
                    { value: "#$+", isChar: "false", buttonClass: "button button_symbolsright", onclick: "jsKeyboard.changeToSymbols();", keyClass: "key key_symbols" }]
            ],
        smallLetter: [
            [
                {value: "English", isChar: "false", buttonClass: "button button_lang", onclick: "jsKeyboard.switchLang();" },
                {value: 49 }, { value: 50 }, { value: 51 }, { value: 52 }, { value: 53 }, { value: 54 },
                { value: 55 }, { value: 56 }, { value: 57 }, { value: 48 },
                {value: "&#8592;", isChar: "false", buttonClass: "button button_backspace", onclick: "jsKeyboard.del();" }],
            // 1st row
            [{value: 113 }, { value: 119 }, { value: 101 }, { value: 114 }, { value: 116 },
                { value: 121 }, { value: 117 }, { value: 105 }, { value: 111 }, { value: 112 }, { value: 40 }, { value: 41 }, { value: 45, buttonClass: "button button_minus" }/*,
             { value: "Delete", isChar: "false", onclick: "jsKeyboard.del()", buttonClass: "button button_del", keyClass: "key key_del" }*/],
            // 2nd row
            [{value: 97, buttonClass: "button button_a" }, { value: 115 }, { value: 100 }, { value: 102 },
                { value: 103 }, { value: 104 }, { value: 106 }, { value: 107 }, { value: 108 }, { value: 34 }, { value: 95 }/*,
             { value: "Enter", isChar: "false", buttonClass: "button button_enter", onclick: "jsKeyboard.enter();", keyClass: "key key_enter" }*/],
            // 3rd row
            [{value: "ABC", isChar: "false", buttonClass: "button button_capitalletterleft", onclick: "jsKeyboard.changeToCapitalLetter();", keyClass: "key key_capitalletterleft" },
                { value: 122 }, { value: 120 }, { value: 99 }, { value: 118 }, { value: 98 },
                { value: 110 }, { value: 109 }, { value: 44 }, { value: 46 }, { value: 63 }, { value: 33 }],
            // 4th row
            [



                {value: "EN", isChar: "false", buttonClass: "button button_lang_short", onclick: "jsKeyboard.switchLang();" },
                { value: 64, buttonClass: "button button_shh" },
                // { value: 32, buttonClass: "button button_space" },
                {value: "Space", isChar: "false", buttonClass: "button button_space", onclick: "jsKeyboard.space();", keyClass: "key key_space" },

                { value: "#$+", isChar: "false", buttonClass: "button button_symbolsright", onclick: "jsKeyboard.changeToSymbols();", keyClass: "key key_symbols" }]

        ],
        hebrew: [

            [
                {value: "English", isChar: "false", buttonClass: "button button_lang", onclick: "jsKeyboard.switchLang();" },
                {value: 49 }, { value: 50 }, { value: 51 }, { value: 52 }, { value: 53 }, { value: 54 },
                { value: 55 }, { value: 56 }, { value: 57 }, { value: 48 },
                {value: "&#8592;", isChar: "false", buttonClass: "button button_backspace", onclick: "jsKeyboard.del();" }

            ],
            // 1st row
            [{value: 47 }, { value: 39 }, { value: 1511 }, { value: 1512 }, { value: 1488 },
                { value: 1496 }, { value: 1493 }, { value: 1503 }, { value: 1501 }, { value: 1508 },  { value: 41 }, { value: 40 }, { value: 45, buttonClass: "button button_minus" }/*,
             { value: "Delete", isChar: "false", onclick: "jsKeyboard.del()", buttonClass: "button button_del", keyClass: "key key_del" }*/],
            // 2nd row
            [{value: 1513, buttonClass: "button button_sh" }, { value: 1491 }, { value: 1490 }, { value: 1499 },
                { value: 1506 }, { value: 1497 }, { value: 1495 }, { value: 1500 }, { value: 1498 }, { value: 1507 }, { value: 44 }, { value: 34 }, { value: 95 }/*,
             { value: "Enter", isChar: "false", buttonClass: "button button_enter", onclick: "jsKeyboard.enter();", keyClass: "key key_enter" }*/],
            // 3rd row
            [
                { value: 1494 ,buttonClass: "button button_zh" }, { value: 1505 }, { value: 1489 }, { value: 1492 }, { value: 1504 },
                { value: 1502 }, { value: 1510 }, { value: 1514 }, { value: 1509 }, { value: 46 }, { value: 63 }, { value: 33 }],
            // 4th row
            [


                // { value: 32, buttonClass: "button button_space" },
                {value: "EN", isChar: "false", buttonClass: "button button_lang_short", onclick: "jsKeyboard.switchLang();" },
                { value: 64 ,buttonClass: "button button_shh" },

                {value: "Space", isChar: "false", buttonClass: "button button_space", onclick: "jsKeyboard.space();", keyClass: "key key_space" },
                { value: "#$+", isChar: "false", buttonClass: "button button_symbolsright", onclick: "jsKeyboard.changeToSymbols();", keyClass: "key key_symbols" }]
        ],
        number: [
            // 1st row
            [{value: 49 }, { value: 50 }, { value: 51 }, { value: 52 }, { value: 53 }, { value: 54 },
                { value: 55 }, { value: 56 }, { value: 57 }, { value: 48 }/*,
             { value: "Delete", isChar: "false", onclick: "jsKeyboard.del()", buttonClass: "button button_del", keyClass: "key key_del" }*/],
            // 2nd row
            [{value: 45, buttonClass: "button button_dash" }, { value: 47 }, { value: 58 }, { value: 59 },
                { value: 40 }, { value: 41 }, { value: 36 }, { value: 38 }, { value: 64 }/*,
             { value: "Enter", isChar: "false", buttonClass: "button button_enter", onclick: "jsKeyboard.enter();", keyClass: "key key_enter" }*/],
            //3rd row
            // { value: "ABC", isChar: "false", buttonClass: "button button_capitalletterleft", onclick: "jsKeyboard.changeToCapitalLetter()", keyClass: "key key_capitalletterleft" },
            [{value: "", isChar: "false", buttonClass: "button button_capitalletterleft", onclick: "", keyClass: "key" },
                { value: 63 }, { value: 33 }, { value: 34 }, { value: 124 }, { value: 92 }, { value: 42 }, { value: 61 }, { value: 43 }],
            // { value: "ABC", isChar: "false", buttonClass: "button button_capitalletterright", onclick: "jsKeyboard.changeToCapitalLetter();", keyClass: "key key_capitalletterright" },
            //        {value: "", isChar: "false", buttonClass: "button", onclick: "", keyClass: "key" },
            //        { value: "", isChar: "false", buttonClass: "button", onclick: "", keyClass: "key" }],

            // 4th row
            [{value: "ABC", isChar: "false", buttonClass: "button button_numberleft", onclick: "jsKeyboard.changeToCapitalLetter();", keyClass: "key key_capitalletterleft" },
                { value: "Space", isChar: "false", buttonClass: "button button_space", onclick: "jsKeyboard.space();", keyClass: "key key_space" },
                { value: "#$+", isChar: "false", buttonClass: "button button_symbolsright", onclick: "jsKeyboard.changeToSymbols();", keyClass: "key key_symbols" }]
        ],
        symbols: [
            // 1st row
            [{value: 91 }, { value: 93 }, { value: 123 }, { value: 125 }, { value: 35 }, { value: 37 },
                { value: 94 }, { value: 42 }, { value: 43 }, { value: 61 }/*,
             { value: "Delete", isChar: "false", onclick: "jsKeyboard.del()", buttonClass: "button button_del", keyClass: "key key_del" }*/],
            // 2nd row
            [{value: 95, buttonClass: "button button_underscore" }, { value: 92 }, { value: 124 }, { value: 126 },
                { value: 60 }, { value: 62 },
                { value: "&euro;", isChar: "false", onclick: "jsKeyboard.writeSpecial('&euro;');" },
                { value: 163 }, { value: 165 }/*,
             { value: "Enter", isChar: "false", buttonClass: "button button_enter", onclick: "jsKeyboard.enter();", keyClass: "key key_enter" }*/],
            // 3rd row
            // { value: "ABC", isChar: "false", buttonClass: "button button_capitalletterleft", onclick: "jsKeyboard.changeToCapitalLetter();", keyClass: "key key_capitalletterleft" },
            [{value: "", isChar: "false", buttonClass: "button button_capitalletterleft", onclick: "", keyClass: "key" },
                { value: 46 }, { value: 44 }, { value: 63 }, { value: 33 }, { value: 39 }, { value: 34 }, { value: 59 }, { value: 92 }],
            // { value: "ABC", isChar: "false", buttonClass: "button button_capitalletterright", onclick: "jsKeyboard.changeToCapitalLetter();", keyClass: "key key_capitalletterright" },
            //    {value: "", isChar: "false", buttonClass: "button", onclick: "", keyClass: "key" },
            //    { value: "", isChar: "false", buttonClass: "button", onclick: "", keyClass: "key" }],
            // 4th row
            [

                { value: "Space", isChar: "false", buttonClass: "button button_space", onclick: "jsKeyboard.space();", keyClass: "key key_space" },
                { value: "ABC", isChar: "false", buttonClass: "button button_symbolsright", onclick: "jsKeyboard.changeToCapitalLetter();", keyClass: "key key_capitalletterleft" }],
        ]
    }
};


// GET CURSOR POSITION
jQuery.fn.getCursorPosition = function(){
    if(this.lengh == 0) return -1;
    return $(this).getSelectionStart();
};

jQuery.fn.getSelectionStart = function(){
    let type = this[0].type;

    if(this.lengh == 0) return -1;
    input = this[0];

    let pos = input.value.length;

    if(type === "email"){
        return pos;
    }

    if(type === "radio"){
        return 0;
    }

    if (input.createTextRange) {
        if(document.selection) {
            let r = document.selection.createRange().duplicate();
            r.moveEnd('character', input.value.length);
            if (r.text == '')
                pos = input.value.length;
            pos = input.value.lastIndexOf(r.text);
        }

    } else if(typeof(input.selectionStart)!="undefined")
        pos = input.selectionStart;

    return pos;
};

//SET CURSOR POSITION
jQuery.fn.setCursorPosition = function(pos) {
    this.each(function(index, elem) {

        if(elem.type === "radio") {
            void(0);
        }
        else if (elem.setSelectionRange && elem.type !== "email"  && pos) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            let range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    });
    return this;
};