const xmlUtils = {
	qName: function (node, doc) {
		var prefix = '';
		if (node.namespaceURI) {
			if (!doc.lookupPrefix(node.namespaceURI)) {
				for (a in (atrs = doc.documentElement.attributes)) {
					if (atrs[a].localName && atrs[a].localName != "xmlns" && atrs[a].value == node.namespaceURI) {
						prefix = atrs[a].localName;
						break;
					}
				}
			} else {
				prefix = doc.lookupPrefix(node.namespaceURI);
			}
			prefix = prefix ? prefix + ":" : '';
		}
		return prefix + node.localName;
		//return (node.namespaceURI?resultXslt.lookupPrefix(node.namespaceURI)+":":"")+node.localName;
	},
	getXPathForElement: function (el, xml) {
		var xpath = '';
		var pos, tempitem2;

		while (el !== xml.documentElement) {
			pos = 0;
			tempitem2 = el;
			while (tempitem2) {
				if (tempitem2.nodeType === 1 && tempitem2.nodeName === el.nodeName) { // If it is ELEMENT_NODE of the same name
					pos += 1;
				}
				tempitem2 = tempitem2.previousSibling;
			}

			xpath = (el.namespaceURI === null ? '' : (resultXslt.documentElement.lookupPrefix(el.namespaceURI) + ':')) + el.localName + '[' + pos + ']' + '/' + xpath;

			el = el.parentNode;
		}
		xpath = "/" + (el.namespaceURI === null ? '' : (resultXslt.documentElement.lookupPrefix(el.namespaceURI) + ':')) + xml.documentElement.localName + '/' + xpath;
		xpath = xpath.replace(/\/$/, '');
		return xpath;
	},
	getCommonAnchestor: function (a, b) {
		var commonAnchestor = null;
		var aPath = [];
		var bPath = [];
		function raiseA(a, b) {
			function raiseB(a, b) {
				if (a === b) {
					commonAnchestor = a;
					return;
				} else {
					if (b.parentNode.nodeType != 9) {
						bPath.unshift(qName(b));
						raiseB(a, b.parentNode)
					}
				}
			}
			raiseB(a, b);
			if (!commonAnchestor && a.parentNode.nodeType != 9) {
				bPath = [];
				aPath.unshift(qName(a));
				raiseA(a.parentNode, b);
			}
		}
		raiseA(a, b);
		return [commonAnchestor, aPath, bPath];
	},
	findTemplateParent: function (p) {
		if (p.nodeName == "xsl:template") {
			return p.getAttribute("match");
		} else {
			return this.findTemplateParent(p.parentNode);
		}
	},
	getTempl2bApplied: function (o, t, r, at, doc) {
		if (o.parentNode.nodeType != 9) {
			var pathEls = [];
			(function getPath(p) {
				if (p.nodeType != 9) {
					if (xmlUtils.qName(p, doc) != t) {
						pathEls.unshift(xmlUtils.qName(p, doc));
						getPath(p.parentNode);

					} else {
						if (at)
							pathEls.push("@" + at);
					}
				} else {
					pathEls.unshift(!r ? "$dataset" : "");
					if (at)
						pathEls.push("@" + at);
				}
			})(o);
			return pathEls.join("/");
		} else {
			return "$dataset/*";
		}
	}
}