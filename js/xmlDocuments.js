xsltBldrApp.xmlDocuments = {
	docs: {},
	registerXmlDocumentFromString : function(docRole, xmlString) {
		this.docs[docRole] = xsltBldrApp.parser.parseFromString(xmlString, "text/xml");
	} 
};

xsltBldrApp.processInputReqResMessages = async function (reqStr, resStr) {
    const app = xsltBldrApp;
	app.ident.textContent = "";
	documentEls2bReplaced = []; //fake document() related
	inReq = app.parser.parseFromString(reqStr, "text/xml");
	inRes = app.parser.parseFromString(resStr, "text/xml");

	app.xmlDocuments.registerXmlDocumentFromString('req', reqStr);
	app.xmlDocuments.registerXmlDocumentFromString('res', resStr);

	app.req.innerHTML = inReq.documentElement.nodeName;
	app.res.innerHTML = inRes.documentElement.nodeName;

	xmlReqWithIds = await app.transform("addIdsToNodes", inReq, [{paramName: "filterOnOff", paramValue: (document.getElementById("allNodes").checked) ? "off" : "on"},{paramName: "doc-role", paramValue: "req"}]);

	req_div_d = await app.transform("xmlToDraggableHtml", xmlReqWithIds);
	var reqSerialized = app.serializer.serializeToString(req_div_d);
	document.getElementById("reqHolder").innerHTML = reqSerialized;

	xmlResWithIds = await app.transform("addIdsToNodes", inRes, [{paramName: "doc-role", paramValue: "res"}]);
	res_div_d = await app.transform("xmlToDraggableHtml", xmlResWithIds);
	document.getElementById("resHolder").innerHTML = app.serializer.serializeToString(res_div_d);

	document.querySelectorAll('#reqHolder .xmlNodeDiv')
			.forEach(function (xmlNodeDiv)
				{
					xmlNodeDiv.addEventListener('dragstart', app.handleDragStart, false);
					xmlNodeDiv.addEventListener('dragend', app.handleDragEnd, false);
					xmlNodeDiv.addEventListener('dblclick', app.tglCollapse, false);
				}
			);

	document.querySelectorAll('#resHolder .xmlNodeDiv')
		.forEach(function (xmlNodeDiv) {
			xmlNodeDiv.addEventListener('dragstart', app.handleDragStart, false);
			xmlNodeDiv.addEventListener('dragenter', app.handleDragEnter, false);
			xmlNodeDiv.addEventListener('dragover', app.handleDragOver, false);
			xmlNodeDiv.addEventListener('dragleave', app.handleDragLeave, false);
			xmlNodeDiv.addEventListener('drop', app.handleDrop, false);
			xmlNodeDiv.addEventListener('dragend', app.handleDragEnd, false);
			xmlNodeDiv.addEventListener('dblclick', app.tglCollapse, false);
		}
	);

	//create result XSLT document and documentElement
	app.resultXslt = document.implementation.createDocument(app.namespaces["xslt"], "xsl:stylesheet");

	app.addDeclToStylesheet(app.resultXslt);

	app.contrastingColors = app.usedColors.concat(app.contrastingColors);
	app.xmlNodeCorrespondingToDragOrigin = xmlReqWithIds.documentElement;
	this.processReqOriginDrag(xmlResWithIds.documentElement.id);
	app.displayResult();
}


xsltBldrApp.tglCollapse = function(e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the event from bubbling up.
    }
    var cns = e.target.childNodes;
    [].forEach.call(cns, function (c) {
        var cStyle = c.style;
        if (cStyle == undefined)
            return;
        if (cStyle.display == 'none') {
            cStyle.display = 'table';
        } else {
            cStyle.display = 'none';
        }
    });
}

xsltBldrApp.displayResult = async function() {

    const xmlDocIndented = await xsltBldrApp.transform('indent', xsltBldrApp.resultXslt, [{paramName: "filtered", paramValue: "true"}])

    const xmlDocIndentedTemplatesDivided = await xsltBldrApp.transform("templDivider", xmlDocIndented);

    [].forEach.call(xsltBldrApp.resultXslt.documentElement.attributes, function (atr) {
        xmlDocIndentedTemplatesDivided.documentElement.setAttributeNS(atr.namespaceURI, atr.nodeName, atr.value);
    });

    document.getElementById("out").value =
        xsltBldrApp.serializer.serializeToString(xmlDocIndentedTemplatesDivided);
    resultView = false;
}

xsltBldrApp.addUuid = function(targetId) {
    //add declarations to docElement -//TODO 2brefactored
    xsltBldrApp.resultXslt.documentElement.setAttributeNS(xsltBldrApp.namespaces["xmlns"], "xmlns:java", "java");
    addPref2bExcluded("extension-element-prefixes", "java");

    //insert java function for UUID
    var correspondingResultNode = xsltBldrApp.resultXslt.getElementById(targetId);
    while (correspondingResultNode.hasChildNodes())
        correspondingResultNode.childNodes[0].remove();
    appendXsltChild(correspondingResultNode, { name: "value-of", atrs: [["select", "java:util.UUID.randomUUID()"]] });
    addPref2bExcluded("exclude-result-prefixes", "java");
    markAsDone(targetId);
}

xsltBldrApp.addNumbering = function(targetId) {
    var inFormula = prompt("Enter formula here (position() returns position among siblings)\nYou can do math like 'position()+100'", "position()");
    var correspondingResultNode = xsltBldrApp.resultXslt.getElementById(targetId);
    while (correspondingResultNode.hasChildNodes())
        correspondingResultNode.childNodes[0].remove();
    correspondingResultNode.appendChild(app.xsltTagFactory({ name: "value-of", atrs: [["select", inFormula]] }));
    app.markAsDone(targetId);
}

xsltBldrApp.addPref2bExcluded = function(atrName, prefixName) {
    if (xsltBldrApp.resultXslt.documentElement.getAttribute(atrName)) {
        if (xsltBldrApp.resultXslt.documentElement.getAttribute(atrName).indexOf(prefixName) == -1)
            xsltBldrApp.resultXslt.documentElement.setAttribute(atrName, (" " + prefixName));
    } else {
        xsltBldrApp.resultXslt.documentElement.setAttribute(atrName, prefixName);
    }
};

xsltBldrApp.setDataset = async function (set) {
    const app = this;
	const inSet = (typeof set == "object") ? set.target.value : set;
	ds_xml = this.parser.parseFromString(inSet, "text/xml");
	dsxml_id_d = await this.transform("addIdsToNodes", ds_xml, [{paramName: "doc-role", paramValue: "business-object"}]);

	app.ds.innerHTML = await this.serializer.serializeToString(await this.transform("xmlToDraggableHtml", dsxml_id_d));

	document.querySelectorAll('#datasetHolder .xmlNodeDiv')
		.forEach(function (xmlNodeDiv) {
			xmlNodeDiv.addEventListener('dragstart', app.handleDragStart, false);
			xmlNodeDiv.addEventListener('dragenter', app.handleDragEnter, false);
			xmlNodeDiv.addEventListener('dragover', app.handleDragOver, false);
			xmlNodeDiv.addEventListener('dragleave', app.handleDragLeave, false);
			xmlNodeDiv.addEventListener('drop', app.handleDropOnDS, false);
			xmlNodeDiv.addEventListener('dragend', app.handleDragEnd, false);
			xmlNodeDiv.addEventListener('dblclick', app.tglCollapse, false);
		}
	);
    
   	//add ns decl for external dataset xml
	// this.resultXslt.documentElement.setAttributeNS(this.namespaces["xmlns"], "xmlns:ds", this.namespaces["ds"]);
	// addPref2bExcluded("exclude-result-prefixes", "ds");
};

 xsltBldrApp.appendXsltChild = function(p, oXTag) {
    var xsltNode = xsltBldrApp.resultXslt.createElementNS(xsltBldrApp.namespaces["xslt"], "xsl:" + oXTag.name);
    [].forEach.call(oXTag.atrs, function (atr) {
        xsltNode.setAttribute(atr[0], atr[1]);
    });
    p.appendChild(xsltNode);
    return xsltNode;
}

xsltBldrApp.xsltTagFactory = function(oXTag) {
    var xsltNode = xsltBldrApp.resultXslt.createElementNS(xsltBldrApp.namespaces["xslt"], "xsl:" + oXTag.name);
    [].forEach.call(oXTag.atrs, function (atr) {
        xsltNode.setAttribute(atr[0], atr[1]);
    });
    return xsltNode;
}

xsltBldrApp.freeIndex = function(doc){
    var freeIndex = 1;
    while (doc.documentElement.lookupNamespaceURI("ns" + freeIndex)) { freeIndex++ };
    return freeIndex;
}

xsltBldrApp.addDeclToStylesheet = function(doc){
    //add all namespace declarations from the res
    app = this;
    [].forEach.call(inRes.documentElement.attributes, function (atr) {
        doc.documentElement.setAttributeNS(atr.namespaceURI, atr.nodeName, atr.value);
    });
    //add ns declarations to xslt for default ns from req
    if ((reqDefNS = inReq.documentElement.lookupNamespaceURI(null)) != null) {
        var altNS;
        if (!inRes.documentElement.lookupPrefix(reqDefNS)) {
            altNS = "xmlns:ns" + this.freeIndex(doc);
        } else {
            altNS = "xmlns:" + inRes.documentElement.lookupPrefix(reqDefNS);
        }
        doc.documentElement.setAttributeNS(this.namespaces["xmlns"], altNS, reqDefNS);
    };
    //add ns declaration to xslt only in req
    [].forEach.call(inReq.documentElement.attributes, function (atr) {

        if (!doc.documentElement.lookupPrefix(atr.value)) {
            altNS = "";
            altNS = "xmlns:ns" + app.freeIndex(doc);
            doc.documentElement.setAttributeNS(app.namespaces["xmlns"], altNS, atr.value);
        };
    });
    doc.documentElement.setAttribute("version", "1.0");
    doc.documentElement.setAttributeNS(this.namespaces["xmlns"], "xmlns:ds", this.namespaces["ds"]);
    this.addPref2bExcluded("exclude-result-prefixes", "ds");
}

xsltBldrApp.handleDragStart = function(e) {

	if (e.stopPropagation) {
		e.stopPropagation(); // stops the event from bubbling up.
	}
	e.dataTransfer.effectAllowed = 'move';
//		e.dataTransfer.setData('text/plain', this.id);

    const [nodeId, _ ] = app.xmlNodeCorrespondingToDragOrigin.id.split("@");

    const reqDocDragOrigin = xmlReqWithIds.getElementById(nodeId);

    if (reqDocDragOrigin){
        xsltBldrApp.xmlNodeCorrespondingToDragOrigin = reqDocDragOrigin;
        return;
    }
    
    const businessDataDragOrigin = xmlReqWithIds.getElementById(nodeId);

    if (businessDataDragOrigin){
        xsltBldrApp.xmlNodeCorrespondingToDragOrigin = businessDataDragOrigin;
        this.processBusinessDataOriginDrag();
        return;
    }

    throw new Error('Origin node of drag could not be determined.'); 

}

xsltBldrApp.handleDragOver = function(e) {
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}
	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}
	e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

	return false;
}

xsltBldrApp.handleDragEnter = function(e) {
	// this / e.target is the current hover target.
	this.classList.add('over');
}

xsltBldrApp.handleDragLeave = function(e) {
	this.classList.remove('over');  // this / e.target is previous target element.
}

xsltBldrApp.handleDrop = function(e) {

	if (e.preventDefault)
		e.preventDefault();
	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}
    xsltBldrApp.processReqOriginDrag(e.target.id);
	return false;
}

xsltBldrApp.handleDropOnDS = function(e) {

	if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	}
	if (e.preventDefault)
		e.preventDefault();
	lookupMode = true;
	console.log("lookupMode " + lookupMode);
	lookupValReq = xsltBldrApp.xmlNodeCorrespondingToDragOrigin;
	lookupValDS = e.target.id;
	console.log(xsltBldrApp.xmlNodeCorrespondingToDragOrigin.id, e.target.id);
	return false;
}


xsltBldrApp.handleDragEnd =function (e) {
	// this/e.target is the source node.

	var cols = document.querySelectorAll('.reqBox');
	[].forEach.call(cols, function (col) {
		col.classList.remove('over');
	});
	var cols = document.querySelectorAll('.tagBox');
	[].forEach.call(cols, function (col) {
		col.classList.remove('over');
	});
}


xsltBldrApp.handleIdentDiv = function (e) {
    if (e.stopPropagation) {
        e.stopPropagation(); // stops the browser from redirecting.
    }
    if (e.preventDefault)
        e.preventDefault();
    const xmlNodeCorrespondingToDragOriginCorrespondingReqXmlElement = xmlReqWithIds.getElementById(xsltBldrApp.xmlNodeCorrespondingToDragOrigin.id);
    // if (!el) {
    // 	console.log("not valid el");
    // 	return;
    // }
    if (!xsltBldrApp.resultXslt.getElementById("dataset"))
        xsltBldrApp.resultXslt.documentElement.insertBefore(
            xsltTagFactory({ name: "variable", atrs: [["name", "dataset"], ["id", "dataset"], ["select", "document($filename)"]] }),
            xsltBldrApp.resultXslt.documentElement.childNodes[0]);
    if (!xsltBldrApp.resultXslt.getElementById("filename"))
        xsltBldrApp.resultXslt.documentElement.insertBefore(
            xsltTagFactory({ name: "variable", atrs: [["name", "filename"], ["id", "filename"], ["select", "concat(translate($identNode,'/','_'),'.xml')"]] }),
            xsltBldrApp.resultXslt.documentElement.childNodes[0]);
    if (!xsltBldrApp.resultXslt.getElementById("identNode")) {
        xsltBldrApp.resultXslt.documentElement.insertBefore(
            xsltTagFactory({ name: "variable", atrs: [["name", "identNode"], ["id", "identNode"], ["select", xmlUtils.getXPathForElement(xmlNodeCorrespondingToDragOriginCorrespondingReqXmlElement, xmlReqWithIds)]] }),
            xsltBldrApp.resultXslt.documentElement.childNodes[0]);
    } else {
        xsltBldrApp.resultXslt.getElementById("identNode").setAttribute("select", xmlUtils.getXPathForElement(xmlNodeCorrespondingToDragOriginCorrespondingReqXmlElement, xmlReqWithIds));
    }

    xsltBldrApp.evalFilenameFormula();

    displayResult();
    return false;
}

xsltBldrApp.evalFilenameFormula =function() {//assemble xslt for live preview of external filename		
    var xslt_live_prev_xml = document.implementation.createDocument(xsltBldrApp.namespaces["xslt"], "xsl:stylesheet");

    [].forEach.call(xsltBldrApp.resultXslt.documentElement.attributes, function (atr) {
        xslt_live_prev_xml.documentElement.setAttributeNS(atr.namespaceURI, atr.nodeName, atr.value);
    });

    xslt_live_prev_xml.documentElement.appendChild(xsltTagFactory({ name: "output", atrs: [["method", "xml"]] }));

    //xslt_live_prev_xml.documentElement.appendChild(xsltBldrApp.resultXslt.getElementById("identNode").cloneNode());
    xslt_live_prev_xml.documentElement.appendChild(xsltTagFactory({ name: "variable", atrs: [["name", "identNode"], ["select", xsltBldrApp.resultXslt.getElementById("identNode").getAttribute("select")]] }));

    var preview_template = xsltTagFactory({ name: "template", atrs: [["match", "/"]] });
    var dummyNode = xslt_live_prev_xml.createElement("dummy");

    preview_template.appendChild(dummyNode);
    dummyNode.appendChild(xsltTagFactory(
        {
            name: "value-of",
            atrs: [["select", xsltBldrApp.resultXslt.getElementById("filename").getAttribute("select")]]
        }
    ));
    xslt_live_prev_xml.documentElement.appendChild(preview_template);
    var proc_prev = new XSLTProcessor();
    proc_prev.importStylesheet(xslt_live_prev_xml);
    if (evalRes = proc_prev.transformToDocument(inReq)) {
        ident.textContent = evalRes.documentElement.textContent;
    } else {
        ident.textContent = "Failed in evaluating your formula";
    }
}

xsltBldrApp.editFilenameFormula = function() {

    if (!(fnNode = xsltBldrApp.resultXslt.getElementById("filename"))) {
        return;
    }
    var edited = prompt(
        "Use (nested) functions to get the desired filename\n\
    e.g.\n\
    translate($filname,'123','xxx')\n\
    substring-before($filename,'.')\n\
    concat('AN_',$filename,'.xml')",
        fnNode.getAttribute("select"));
    if (edited) {
        fnNode.setAttribute("select", edited);
        evalFilenameFormula();
        displayResult();
    }
}