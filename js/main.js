xsltBldrApp.resultXslt = document.implementation.createDocument(xsltBldrApp.namespaces["xslt"], "xsl:stylesheet");

xsltBldrApp.dragOrigin = null;


xsltBldrApp.sendTransformRequest = async () => {

	const transformRequestDocument = document.implementation.createDocument(null, "transform_data");

	const root = transformRequestDocument.documentElement;

	// create request Node of transform request document
	const requestNode = transformRequestDocument.createElementNS(null, "request");

	requestNode.appendChild(transformRequestDocument.importNode(inReq.documentElement, true));

	// create stylesheet Node of transform request document

	const clonedStylesheet = document.implementation.createDocument(null, null);
	clonedStylesheet.appendChild(xsltBldrApp.resultXslt.documentElement.cloneNode(true));

	var id_ds = clonedStylesheet.querySelectorAll("*[id]");
	[].forEach.call(id_ds, function (id_d) {
		id_d.removeAttribute("id");
	});

	const stylesheetNode = transformRequestDocument.createElementNS(null, "stylesheet");

	stylesheetNode.appendChild(transformRequestDocument.importNode(clonedStylesheet.documentElement, true));

	//create business data object node of transform request document

	if (ds_xml) {
		const businessObjectDataNode = transformRequestDocument.createElementNS(null, "business_object_data");

		businessObjectDataNode.appendChild(transformRequestDocument.importNode(ds_xml.documentElement, true));

		root.appendChild(businessObjectDataNode);
	}


	root.appendChild(requestNode);
	root.appendChild(stylesheetNode);

	const postBody = xsltBldrApp.serializer.serializeToString(transformRequestDocument);

	// console.log(postBody);

	fetch('http://127.0.0.1:8080/api/transform',
		{
			method: 'POST',
			headers: {
				'Accept': 'application/xml',
				'Content-Type': 'application/xml; charset=UTF-8'
			},
			body: postBody
		}).then((res) => {
			console.log(res);
			return res.text();
		}).then((xmlData) => {
			console.log(xmlData);
		});
};

xsltBldrApp.displayTransResult = function () {
	if (resultView) {
		displayResult();
		return;
	}

	xsltBldrApp.sendTransformRequest();

	return;

	var Xslt2bEvaluated = document.implementation.createDocument(null, null);
	Xslt2bEvaluated.appendChild(xsltBldrApp.resultXslt.documentElement.cloneNode(true));

	var arrDsRef = Xslt2bEvaluated.querySelectorAll("*[fakeDocFn]");
	var dsVar = Xslt2bEvaluated.getElementById("dataset");
	if (arrDsRef.length > 0 && !dsVar) {
		alert("You seem to be querying data from the external dataset file.\nPlease set the filename first.\n\
			(Drag the appropriate node from the request into the blue box below it.)");
		return;
	}

	var id_ds = Xslt2bEvaluated.querySelectorAll("*[id]");
	[].forEach.call(id_ds, function (id_d) {
		id_d.removeAttribute("id");
	});
	if (dsVar) {
		dsVar.removeAttribute("select");
		dsVar.appendChild(ds_xml.documentElement.cloneNode(true));


		/*if(Xslt2bEvaluated.documentElement.getAttribute("extension-element-prefixes")){
			if(Xslt2bEvaluated.documentElement.getAttribute("extension-element-prefixes").indexOf("exsl")==-1)
				Xslt2bEvaluated.documentElement.setAttribute("extension-element-prefixes",(" "+"exsl"));
		} else {
			Xslt2bEvaluated.documentElement.setAttribute("extension-element-prefixes","exsl");							
		}

		Xslt2bEvaluated.documentElement.setAttributeNS(xsltBldrApp.namespaces["xmlns"],"xmlns:exsl",xsltBldrApp.namespaces["exsl"]);*/

	}

	//Xslt2bEvaluated = xsltBldrApp.transformers.indentTransf.transformToDocument(Xslt2bEvaluated);		
	var proc_trans_preview = new XSLTProcessor();

	addDeclToStylesheet(Xslt2bEvaluated);

	proc_trans_preview.importStylesheet(Xslt2bEvaluated);

	//send to server

	var request = new XMLHttpRequest();
	request.onload = function () {
		console.log("got something back!");

		xsltBldrApp.transformers.indentTransf.setParameter(null, "noFilter", "false");

		outPanel.value = xsltBldrApp.serializer.serializeToString(
			xsltBldrApp.transformers.indentTransf.transformToDocument(
				xsltBldrApp.parser.parseFromString(this.responseText, 'text/xml')
			)
		);
		resultView = true;
	}
	request.open('POST', 'http://127.0.0.1:8080/api/transform', true);
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send(postData);
}

var lookupMode = false;
var resultView = false;
var lookupValReq;
var lookupValDS;
var i = 0;

var inReq;
var ds_xml;
var inRes;
var req_id_d;
var res_id_d;
var req_div_d;
var res_div_d;
var dsxml_id_d;

const ds_xml_str = ``;


xsltBldrApp.markAsDone = function(tar, src) {

	if (xsltBldrApp.contrastingColors.length == 0) {
		xsltBldrApp.contrastingColors = xsltBldrApp.usedColors.concat(xsltBldrApp.contrastingColors);
	}
	const colorForThisPair = xsltBldrApp.contrastingColors.shift();
	xsltBldrApp.usedColors.push(colorForThisPair);

	document.getElementById("resHolder").querySelector("div[id='" + tar + "']").classList.add("tagstyle" + colorForThisPair);
	if (src) {
		try {
			document.getElementById("reqHolder").querySelector("div[id='" + src + "']").classList.add("tagstyle" + colorForThisPair);
		} catch (e) { };
	}
}

xsltBldrApp.processDrag = function(targetId) {

	const app = this; 
	const targetNode = res_id_d.getElementById(targetId);
	const explodedSrcId = app.dragOrigin.id.split("@");
	const origin = (r = req_id_d.getElementById(explodedSrcId[0])) || (dsxml_id_d && (d = dsxml_id_d.getElementById(explodedSrcId[0]))) || null;

	if (r)
		lookupMode = false;

	if (!targetNode)
		return;

	if (lookupMode) {
		processLookup(srcId, targetId);
		return;
	}

	const srcId = app.dragOrigin.id;

	if (srcId == "uuid") {
		addUuid(targetId);
	} else if (srcId == "number") {
		addNumbering(targetId);
	} else if (srcId == "lookup") {
		var exploded2pMapped = tbMapped.split("@");
		origin = (r = req_id_d.getElementById(explodedSrcId[0])) || (d = dsxml_id_d.getElementById(explodedSrcId[0]));
		var prop2bMapped = exploded2pMapped[1] || origin.nodeName;
		if (exploded2pMapped[1])
			prop2bMapped = "@" + prop2bMapped;

		mappingData = prompt("Input the mapping values for property " + prop2bMapped + ":\n");
		if (!mappingData)
			return;

	}
	else {

		var templ = app.xsltTagFactory(
			{
				name: "template",
				atrs: [["match", xmlUtils.qName(origin, app.resultXslt)]]
			}
		);

		if (origin.parentNode.nodeType == 9 && r) {
			var clonedDocEl = res_id_d.documentElement.cloneNode(true);
			templ.appendChild(clonedDocEl);
			xsltBldrApp.resultXslt.documentElement.appendChild(templ);
		}

		var correspondingResultNode = app.resultXslt.getElementById(targetId);

		if (origin.parentNode.nodeType != 9 || !r) {
			var parTemplMatch = xmlUtils.findTemplateParent(correspondingResultNode.parentNode, "");

			var templ2bApplied = xmlUtils.getTempl2bApplied(origin, parTemplMatch, (r != null), explodedSrcId[1] ? explodedSrcId[1] : null);


			java_vtn_mode = java_vtn.className.indexOf("depressed") != -1;

			//java value to node mode
			if (java_vtn_mode) {
				var pkg = prompt("What is the fully qualified name of your static class? (e.g. 'com.bng_mig.interfaces.Pool'))");
				if (!pkg) return;
				var methName = prompt("What is the name of your method?");
				if (!methName) return;
				var prefix = freeIndex(xsltBldrApp.resultXslt);

				app.resultXslt.documentElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:ns" + prefix, pkg);
				app.addPref2bExcluded("extension-element-prefixes", "ns" + prefix);

				var aplTempl = xsltTagFactory(
					{
						name: "apply-templates",
						atrs: [["select", templ2bApplied]]
					});
				correspondingResultNode.parentNode.insertBefore(aplTempl,
					correspondingResultNode);

				templ.appendChild(app.xsltTagFactory({ name: "copy-of", atrs: [["select", prefix + ":" + methName + "(.)"]] }));
				app.resultXslt.documentElement.appendChild(templ);
				correspondingResultNode.remove();
				// target is a node container
			} else if (targetNode.childNodes[0].nodeType == 1) {
				var aplTempl = xsltTagFactory(
					{
						name: "apply-templates",
						atrs: [["select", templ2bApplied]]
					});
				correspondingResultNode.parentNode.insertBefore(aplTempl,
					correspondingResultNode);

				templ.appendChild(correspondingResultNode);
				app.resultXslt.documentElement.appendChild(templ);
			} // target is not a node container, but a value container
			else {
				var correspondingResultNode = xsltBldrApp.resultXslt.getElementById(targetId);
				while (correspondingResultNode.hasChildNodes())
					correspondingResultNode.childNodes[0].remove();
				var atrs = [["select", templ2bApplied]];
				correspondingResultNode.appendChild(xsltTagFactory({ name: "value-of", atrs }));
			}
		}
		app.markAsDone(targetId, srcId);

		function addXPaths(o, t, x) {
			[].forEach.call(t.childNodes, function (t_c) {
				var match = null;
				[].forEach.call(o.childNodes, function (o_c) {
					if (o_c.localName == t_c.localName)
						match = o_c;
				});
				if (match && t_c.childNodes[0] && (t_c.childNodes[0].nodeType == 3 || t_c.childNodes[0].nodeName == "xsl:value-of")) {
					while (t_c.hasChildNodes())
						t_c.childNodes[0].remove();
					app.appendXsltChild(t_c, { name: "value-of", atrs: [["select", (x + "/" + xmlUtils.qName(t_c, app.resultXslt)).replace(/^\//, "")]] });
					app.markAsDone(t_c.id, match.id);
				}
				if (match && match.childNodes[0] && match.childNodes[0].nodeType == 1 && t_c.childNodes[0] && t_c.childNodes[0].nodeType == 1) {
					addXPaths(match, t_c, x + "/" + xmlUtils.qName(t_c, app.resultXslt));
					//app.markAsDone(t_c.id,match.id);
				}
			})
		}
		addXPaths(origin, correspondingResultNode, "");
	}
	app.displayResult(xsltBldrApp.resultXslt);
	//console.log(targetNode);
}

function processLookup(lookedupValDS, t) {
	var lookupValDSParts = lookupValDS.split("@");
	var lookedupValDSParts = lookedupValDS.split("@");
	var commonAnchestor = xmlUtils.getCommonAnc(dsxml_id_d.getElementById(lookupValDSParts[0]), dsxml_id_d.getElementById(lookedupValDSParts[0]));
	if (part = lookupValDSParts[1])
		commonAnchestor[1].push("@" + part);
	if (part = lookedupValDSParts[1])
		commonAnchestor[2].push("@" + part);
	var a = commonAnchestor[1].join("/");
	var b = commonAnchestor[2].join("/");

	var templ2bApplied = xmlUtils.getTempl2bApplied(req_id_d.getElementById(lookupValReq),
		xmlUtils.findTemplateParent(xsltBldrApp.resultXslt.getElementById(t)), true, null);
	//console.log(xmlUtils.getTempl2bApplied(commonAnchestor[0],"foo",false,null)+"["+a+"=current()/"+templ2bApplied+"]/"+b);
	var target = xsltBldrApp.resultXslt.getElementById(t);
	while (target.hasChildNodes())
		target.childNodes[0].remove();
	target.appendChild(xsltTagFactory({ name: "value-of", atrs: [["select", xmlUtils.getTempl2bApplied(commonAnchestor[0], "foo", false, null) + "[" + a + "=current()/" + templ2bApplied + "]/" + b]] }));
	lookupMode = false;
	this.markAsDone(t);
	displayResult();
}