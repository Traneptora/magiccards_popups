//* TITLE magiccards.info Popups **//
//* VERSION 0.1.2 **//
//* DESCRIPTION    Creates visual popups for links to cards on http://magiccards.info/. This will currently only create pop-ups for direct cards, not searches, and it only runs on official tumblr pages.**//
//* DEVELOPER thebombzen **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.magiccards_popups = new Object({

	addPopup: function($atag, image_source) {
		var $img = $("<img>");
		$img.prop("src", image_source);
		$img.css({
			"padding": "0px",
			"border":  "0px",
			"width": "312px",
			"height": "445px",
			"position": "fixed",
			"visibility": "hidden",
			"z-index": "300"
		});
		$atag.addClass("magiccards_popups-tooltip");
		$atag.hover(function() {
			$(this).children("img").last().css("visibility", "visible");
		}, function() {
			$(this).children("img").last().css("visibility", "hidden");
		});
		$atag.append($img);
		$atag.on("mousemove.magiccards_popups", function(event) {
			var x = event.clientX, y = event.clientY;
			if (y > window.innerHeight / 2) {
				y -= 485;
			}
			$(this).children("img").last().css({
				"top": (y + 20) + 'px',
				"left": (x + 20) + 'px'
			});
		});
	},

	addPopupsIfNecessary: function() {
		if (XKit.interface.is_tumblr_page() !== true) {
			return;
		}
		$("a").each(function() {
			var $atag = $(this);
			if ($atag.hasClass("magiccards_popups-tooltip")) {
				return;
			}
			var old_href = $atag.prop("href"), theMatch, image_source, replaced;
			if (old_href) {
				if (old_href.match(/^.*?\/\/magiccards.info\/.*?\/.*?\/.*?\.html$/)) {
					theMatch = /^.*?\/\/magiccards.info\/(.*?)\/(.*?)\/(.*?)\.html$/.exec(old_href);
					image_source = "http://magiccards.info/scans/" + theMatch[2] + "/" + theMatch[1] + "/" + theMatch[3] + ".jpg";
					XKit.extensions.magiccards_popups.addPopup($atag, image_source);
				} else if (old_href.match(/^http:\/\/t.umblr.com\/redirect\?z=http%3A%2F%2Fmagiccards\.info%2F.*?%2F.*?%2F.*?\.html(&.*)*$/)) {
					replaced = /^http:\/\/t.umblr.com\/redirect\?z=(http%3A%2F%2Fmagiccards\.info%2F.*?%2F.*?%2F.*?\.html)(&.*)*$/.exec(old_href);
					theMatch = /^.*?\/\/magiccards.info\/(.*?)\/(.*?)\/(.*?)\.html$/.exec(decodeURIComponent(replaced[1]));
					image_source = "http://magiccards.info/scans/" + theMatch[2] + "/" + theMatch[1] + "/" + theMatch[3] + ".jpg";
					XKit.extensions.magiccards_popups.addPopup($atag, image_source);
				}
			}
		});
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
		XKit.extensions.magiccards_popups.addPopupsIfNecessary();
		XKit.post_listener.add("magiccards_popups", XKit.extensions.magiccards_popups.addPopupsIfNecessary);
	},

	destroy: function() {
		this.running = false;
		XKit.extensions.magiccards_popups.removePopups();
		XKit.post_listener.remove("magiccards_popups");
	}

});
