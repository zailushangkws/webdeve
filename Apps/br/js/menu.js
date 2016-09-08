function SimpleMenu(data) {
    this.source = []; // array to preserve sort order
    var items = {};
    // build hierarchical source.
    for (i = 0; i < data.length; i++) {
        var item = data[i];
        var label = item["text"];
        var parentid = item["parentid"];
        var modifier = item["modifier"];
        
        // optional parentid
        if (typeof parentid === 'undefined') {
            parentid = '-1';
        }
        var id = item["id"];

        if (typeof id === 'undefined') {
            id = label;
        }
        if (items[parentid]) {
            var item = {
                internalid : i,
                id : id,
                parentid : parentid,
                label : label,
                item: item,
                modifier: modifier
            };
            if (!items[parentid].items) {
                items[parentid].items = [];
            }
            items[parentid].items[items[parentid].items.length] = item;
            items[id] = item;
        } else {
            items[id] = {
                internalid : i,
                id : id,
                parentid : parentid,
                label : label,
                item: item,
                modifier: modifier
            };
            this.source[i] = items[id];
        }
    }
}

SimpleMenu.prototype.buildMenuUI = function (name, divName, useHash) {
    useHash = (typeof useHash === 'undefined') ? true : useHash;
    var buildUL = function (parent, items) {
        $.each(items, function () {
            if (this.label) {
                var li;
                if (this.label === '-') {
                    li = $('<li class="menu-divider"></li>');
                } else {
                    // create LI element and append it to the parent element.
                    if (useHash) {
                        li = $('<li id="' + this.id + '"><a href="#'
                            + this.id.toString() + '">' + this.label
                            + '</a></li>');
                    } else {
                        if (this.modifier === undefined) {
                            this.modifier = '';
                        }
                        li = $('<li id="' + this.id + '"><a href="#">' + this.modifier
                            + this.label + '</a></li>');
                    }
                }

                li.appendTo(parent);
                // if there are sub items, call the buildUL function.
                if (this.items && this.items.length > 0) {
                    var ul = $("<ul></ul>");
                    ul.appendTo(li);
                    buildUL(ul, this.items);
                }
            }
        });
    };
    var ul = $('<ul id="' + name + '"></ul>');
    ul.appendTo('#' + divName);
    buildUL(ul, this.source);
};

SimpleMenu.prototype.disableMenuItem = function (menuItemId) {
    var menuItem = $("#" + menuItemId);
    menuItem.addClass("ui-state-disabled");
};

SimpleMenu.prototype.enableMenuItem = function (menuItemId) {
    var menuItem = $("#" + menuItemId);
    menuItem.removeClass("ui-state-disabled");
};
