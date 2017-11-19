/**
 * context.js 右键菜单插件
 * Created by cjh1 on 2016/11/12.
 */
UI.$curContextElem = null;

function context($elem, e) {
    var $overlay = $('#ui-context-overlay');
    if (!$overlay.length) {
        $overlay = $('<div id="ui-context-overlay" class=""></div>');
        $overlay.css({
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 10000000,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            opacity: .05,
        });
        $(document.body).append($overlay);
        $elem.on('contextmenu', function () {
            return false;
        });

        $overlay.on('contextmenu', function (e) {
            pot($elem, e);
            return false;
        })
    }
    $elem.css('zIndex', 10000001);

    function pot($elem, e) {
        var height = $elem.outerHeight();
        var winHeight = $(window).height();
        if (e.clientY < winHeight - height) {
            $elem.css({
                'left': e.clientX,
                'top': e.clientY
            });
        } else if (e.clientY > height) {
            $elem.css({
                'left': e.clientX,
                'top': e.clientY - height
            });
        } else {
            $elem.css({
                'left': e.clientX,
                'top': winHeight - height
            });
        }
    }

    pot($elem, e);

    $overlay.hide();
    //$overlay.show();
    $elem.show();
    $elem.addClass('context-active');

    UI.$curContextElem = $elem;

    $overlay.on('click', function () {
        $overlay.hide();
        $elem.hide();
    });
}

function contextHide($elem) {
    $elem.hide();
    //$('#ui-context-overlay').hide();
}

$(document).on('click contextmenu', function (e) {
    if ($(e.target).parents(".context-active").length == 0) {
        if (UI.$curContextElem) {
            UI.$curContextElem.hide();
            UI.$curContextElem.removeClass('context-active');
            UI.$curContextElem = null;
        }
    }
});