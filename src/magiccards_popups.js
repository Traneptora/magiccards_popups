//* TITLE magiccards.info Popups **//
//* VERSION 0.1.3 **//
//* DESCRIPTION    Creates visual popups for links to cards on http://magiccards.info/. This will currently only create pop-ups for direct cards, not searches, and it only runs on official tumblr pages.**//
//* DEVELOPER thebombzen **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.magiccards_popups = new Object({

	addPopup: function($atag, image_source) {
		var $img = $("<img>");
		$img.prop("src", image_source);
		$atag.addClass("magiccards_popups-tooltip");
		$atag.hover(function() {
			$(this).children("img").last().css("visibility", "visible");
		}, function() {
			$(this).children("img").last().css("visibility", "hidden");
		});
		$atag.append($img);
		$atag.on("mousemove.magiccards_popups", moveToMouse($img));
	},

	moveToMouse: function($img) {
		return function(event) {
			var x = event.clientX, y = event.clientY;
			if (y > window.innerHeight / 2) {
				y -= 485;
			}
			$img.css({
				"top": (y + 20) + 'px',
				"left": (x + 20) + 'px'
			});
		}
	},

	magiccards_regex: new RegExp("//magiccards.info/([^/]+)/([^/]+)/([^.]+).html"),

	addPopupsIfNecessary: function() {
		$("a").each(function() {
			var $atag = $(this);
			if ($atag.hasClass("magiccards_popups-tooltip")) {
				return;
			}
			var href = XKit.extensions.magiccards_popups.replace_tumblr_redirects($atag.href);
			var match = href.match(XKit.extensions.magiccards_popups.magiccards_regex);
			if (match){
				var image_source = "http://magiccards.info/scans/" + match[2] + "/" + match[1] + "/" + match[3] + ".jpg";
				XKit.extensions.magiccards_popups.addPopup($atag, image_source);
			}
		});
	},

	tumblr_redirect_regexp: new RegExp("https?://t.umblr.com/redirect\\?z=([^&]+)"),

	replace_tumblr_redirects: function(href){
		var match = href.match(XKit.extensions.magiccards_popups.tumblr_redirect_regexp);
		if (match){
			return decodeURIComponent(match[1]);
		} else {
			return href;
		}
	},

	removePopup: function($atag) {
		$atag.children("img").last().remove();
		$atag.off("mousemove.magiccards_popups");
		$atag.removeClass("magiccards_popups-tooltip");
	},

	removePopups: function() {
		$(".magiccards_popups-tooltip").each(function() {
			XKit.extensions.magiccards_popups.removePopup($(this));
		});
	},

	running: false,

	run: function() {
		this.running = true;
		if (XKit.interface.is_tumblr_page() === true) {
			XKit.extensions.magiccards_popups.addPopupsIfNecessary();
		}
		XKit.post_listener.add("magiccards_popups", XKit.extensions.magiccards_popups.addPopupsIfNecessary);
	},

	destroy: function() {
		this.running = false;
		XKit.extensions.magiccards_popups.removePopups();
		XKit.post_listener.remove("magiccards_popups");
	}

});
