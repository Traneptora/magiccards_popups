//* TITLE MagicCards Popups **//
//* VERSION 0.1.0 **//
//* DESCRIPTION    Creates visual popups for links to cards on magiccards.info **//
//* DEVELOPER thebombzen **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.MagicCards_Popups = new Object({

    addPopup: function(atag, newHref){
        var img = document.createElement("img");
        img.src = newHref;
        img.style.padding = "0px";
        img.style.border =  "0px";
        img.style.width = "312px";
        img.style.height = "445px";
        img.style.position = "fixed";
        img.style.visibility = "hidden";
        img.style.zIndex = "300";
        $(atag).addClass("magiccards_popups-tooltip");
        atag.appendChild(img);
        $(atag).hover(function(){
            $(this.lastElementChild).css("visibility", "visible");
        }, function(){
            $(this.lastElementChild).css("visibility", "hidden");
        })
        $(atag).on("mousemove.magiccards_popups", function(event){
            var x = event.clientX, y = event.clientY;
            if (y > window.innerHeight / 2){
                y -= 485;
            }
            this.lastElementChild.style.top = (y + 20) + 'px';
            this.lastElementChild.style.left = (x + 20) + 'px';
        });
    },

    addPopupsIfNecessary: function (){
        if (XKit.interface.is_tumblr_page() !== true){
            return;
        }
        $("a").each(function(){
            var atag = this;
            if ($(atag).hasClass("magiccards_popups-tooltip")){
                return;
            }
            if (atag.href){
                if (atag.href.match(/^.*?\/\/magiccards.info\/.*?\/.*?\/.*?\.html$/)){
                    var theMatch = /^.*?\/\/magiccards.info\/(.*?)\/(.*?)\/(.*?)\.html$/.exec(atag.href);
                    var newHref = "http://magiccards.info/scans/" + theMatch[2] + "/" + theMatch[1] + "/" + theMatch[3] + ".jpg";
                    XKit.extensions.MagicCards_Popups.addPopup(atag, newHref);
                } else if (atag.href.match(/^http:\/\/t.umblr.com\/redirect\?z=http%3A%2F%2Fmagiccards\.info%2F.*?%2F.*?%2F.*?\.html(&.*)*$/)){
                    var replaced = /^http:\/\/t.umblr.com\/redirect\?z=(http%3A%2F%2Fmagiccards\.info%2F.*?%2F.*?%2F.*?\.html)(&.*)*$/.exec(atag.href);
                    var theMatch = /^.*?\/\/magiccards.info\/(.*?)\/(.*?)\/(.*?)\.html$/.exec(decodeURIComponent(replaced[1]));
                    var newHref = "http://magiccards.info/scans/" + theMatch[2] + "/" + theMatch[1] + "/" + theMatch[3] + ".jpg";
                    XKit.extensions.MagicCards_Popups.addPopup(atag, newHref);
                }
            }
        });
    },

    removePopup: function(atag){
        atag.removeChild(atag.lastElementChild);
        $(atag).off("mousemove.magiccards_popups");
        $(atag).removeClass("magiccards_popups-tooltip");
    },

    removePopups: function(){
        $(".magiccards_popups-tooltip").each(function () {
             XKit.extensions.MagicCards_Popups.removePopup(this);
        });
    },

    running: false,

    run: function() {
        this.running = true;
        XKit.extensions.MagicCards_Popups.addPopupsIfNecessary();
        XKit.post_listener.add("MagicCards_Popups", XKit.extensions.MagicCards_Popups.addPopupsIfNecessary);
    },

    destroy: function() {
        this.running = false;
        XKit.extensions.MagicCards_Popups.removePopups();
        XKit.post_listener.remove("MagicCards_Popups");
    }

});

