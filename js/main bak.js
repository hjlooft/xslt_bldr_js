var resultXslt;

xsltBldrApp.dragOrigin = null;

xsltBldrApp.xmlDocuments = {
	docs: {},
	registerXmlDocumentFromString : function(docRole, xmlString) {
		this.docs[docRole] = xsltBldrApp.parser.parseFromString(xmlString, "text/xml");
	} 
};

window.onload = function () {

	var ns = {
		"xslt": "http://www.w3.org/1999/XSL/Transform",
		"xmlns": "http://www.w3.org/2000/xmlns/",
		"ds": "http://testing/dataset",
		"exsl": "http://exslt.org/common"
	}

	var inReq;
	var ds_xml;
	var inRes;
	var req_id_d;
	var res_id_d;
	var req_div_d;
	var res_div_d;
	var dsxml_id_d;

	const ds_xml_str = `<AN>
	<FXP_AN>
		<SEP>/</SEP>
		<EndSZ>
			<LK>49</LK>
			<NKZ>2777</NKZ>
			<VPZ>40</VPZ>
			<FachSZ>7MA3</FachSZ>
		</EndSZ>
		<Standorttyp>Inhouse</Standorttyp>
		<Betriebsstatus>inBetrieb</Betriebsstatus>
		<Nutzungsstatus>provisionierungstauglich</Nutzungsstatus>
		<Equipment_nr>100000000001</Equipment_nr>
		<Materialnummer>10000001</Materialnummer>
		<Beschaltete_Ports>115</Beschaltete_Ports>
		<Datenmaster>FXP</Datenmaster>
		<Mischbestueckung>false</Mischbestueckung>
		<Enthaelt_Sdsl_Karte>false</Enthaelt_Sdsl_Karte>
		<Netzumschaltungen_von/>
		<Netzumschaltungen_bis/>
		<Flexprod_Kennung>19880122000000000000000000000000000001.MSAN</Flexprod_Kennung>
		<Anzahl_offene_Auftraege>0</Anzahl_offene_Auftraege>
		<Anzahl_Linecards>1</Anzahl_Linecards>
		<Anzahl_Ports>2</Anzahl_Ports>
		<Anzahl_geparkte_Produkte>0</Anzahl_geparkte_Produkte>
	</FXP_AN>
	<ROLLOUT_PLAN>
		<SEP>_</SEP>
		<EndszAN>
			<!-- /AN/FXP_AN/ENDSZ -->
		</EndszAN>
		<EndszBNG>
			<LK>49</LK>
			<NKZ>221</NKZ>
			<VPZ>1</VPZ>
			<FachSZ>7001</FachSZ>
		</EndszBNG>
		<HostnameBNG>HOST01</HostnameBNG>
		<Migrationsszenario>DualHomed</Migrationsszenario>
		<Solltermin>31.12.2015</Solltermin>
		<Z900Standort>
			<!-- ../EndszBNG/z900 -->
		</Z900Standort>
		<Region>West</Region>
		<PTI>PTI21</PTI>
		<Leitungsbezeichnung>
			<!-- /AN/RMK_UPLINK/LSZ_0000000001-/AN/FXP_AN/ENDSZ-/AN/ROLLOUT_PLAN/EndszBNG  -->
		</Leitungsbezeichnung>
		<EndszAGS1>
			<LK>49</LK>
			<NKZ>221</NKZ>
			<VPZ>12</VPZ>
			<FachSZ>7JY0</FachSZ>
		</EndszAGS1>
		<WmstiBaFa>wmstiBaFa000001</WmstiBaFa>
		<OnlineOffline>Offline</OnlineOffline>
	</ROLLOUT_PLAN>
	<SW_BNG>
		<Hostname>
			<!-- /AN/ROLLOUT_PLAN/HostnameBNG -->
		</Hostname>
		<Softwarestand>r4.7.005</Softwarestand>
	</SW_BNG>
	<SW_AN>
		<SEP>/</SEP>
		<Endsz>
			<!-- /AN/FXP_AN/ENDSZ -->
		</Endsz>
		<Softwarestand>r4.7.005</Softwarestand>
	</SW_AN>
	<BNG>
		<SEP>/</SEP>
		<ENDSZ>
			<!-- ROLLOUT_PLAN/EndszBNG -->
		</ENDSZ>
		<LOGICAL_STATUS>In Service</LOGICAL_STATUS>
		<PHYSICAL_STATUS>Installed</PHYSICAL_STATUS>
	</BNG>
	<RMK_UPLINK>
		<SEP>_</SEP>
		<LBZ>
			<!-- RMK_UPLINK/LSZ_0000000001-EndszAn-EndszBng-->
		</LBZ>
		<LSZ>4C1</LSZ>
		<ANCP_SESSION_STATE/>
		<LOGICAL_STATUS>In Service</LOGICAL_STATUS>
		<UPLINK_PORT>
			<rack>1</rack>
			<shelf>1</shelf>
			<slot>5</slot>
			<sub_slot>0</sub_slot>
			<port>1</port>
		</UPLINK_PORT>
	</RMK_UPLINK>
	<CRM_T>
		<CONTRACT_NR>
			<PRE>VERTRAG-</PRE>
			<IND>1234</IND>
		</CONTRACT_NR>
		<BMP>
			<CLIENT_NR>
				<PRE>KDNR-</PRE>
				<IND>1234567890</IND>
			</CLIENT_NR>
			<TNBA_ID>
				<PRE>TNBA-</PRE>
				<IND>1234567890</IND>
			</TNBA_ID>
			<TO_NR>123456789012</TO_NR>
			<BKTO>
				<PRE>BKTO-9876</PRE>
				<IND>52243210</IND>
			</BKTO>
			<ROOTID_EXCHANGE>
				<PRE>ROOT_AS-</PRE>
				<IND>1234</IND>
			</ROOTID_EXCHANGE>
			<!--<CONTRACT_EXCHANGE>VERTRAG-1234</CONTRACT_EXCHANGE>--><MATERIAL_NUMBER_EXCHANGE>89733977</MATERIAL_NUMBER_EXCHANGE>
			<ROOTID_ISP>
				<PRE>ROOT_ISP-</PRE>
				<IND>1234</IND>
			</ROOTID_ISP>
			<CONTRACT_ISP>
				<PRE>VERTR-ISP-</PRE>
				<IND>1234</IND>
			</CONTRACT_ISP>
			<ISP_MATERIAL_NR>89743066</ISP_MATERIAL_NR>
			<KLS_ID>
				<PRE>KLS-</PRE>
				<IND>1234</IND>
			</KLS_ID>
			<STREET>Hauptstrasse</STREET>
			<LOCATION>Köln</LOCATION>
			<POSTAL_CODE>50825</POSTAL_CODE>
			<COUNTRY_CODE>DE</COUNTRY_CODE>
			<ONKZ>221</ONKZ>
			<PHONE_NR>123456</PHONE_NR>
			<HOUSE_NR>5</HOUSE_NR>
			<ADDITIONAL>a</ADDITIONAL>
			<UPDATE_STATUS>A</UPDATE_STATUS>
		</BMP>
		<ZMP>
			<ROOT_ID>
				<PRE>ROOT_AS-</PRE>
				<IND>1234</IND>
			</ROOT_ID>
			<PARENT_ID>
				<PRE>PARENT-</PRE>
				<IND>123</IND>
			</PARENT_ID>
			<DATASET_ID>
				<PRE>SATZ-</PRE>
				<IND>123</IND>
			</DATASET_ID>
			<TYPE>T-DSL</TYPE>
			<SUBTYPE>Consumer</SUBTYPE>
			<MATERIAL_NR>89752961</MATERIAL_NR>
			<PRODUCT_NAME>DSL 16 TV ohne Splitter</PRODUCT_NAME>
			<!--<CONTRACT_NR>VERTRAG-1234</CONTRACT_NR>--><UPDATE_STATUS>A</UPDATE_STATUS>
		</ZMP>
	</CRM_T>
	<FXP_INV>
		<SEP>/</SEP>

	</FXP_INV>
	<PSL>
		<SEP>_</SEP>
		<ID>99</ID>
		<PARTNER>BNG_MIGTOOL</PARTNER>
		<ANFO_KEN>ID_Consumer_2</ANFO_KEN>

		<STAR_ID>1234</STAR_ID>
		<ADR_ID>1234567</ADR_ID>
		<GEBA>3</GEBA>
		<RAUM>4</RAUM>
		<REIHE>5</REIHE>
		<PLATZ>1</PLATZ>
		<ASB>t</ASB>
		<KVZ>t</KVZ>
		<S_PKT>t</S_PKT>
		<IWERK>t</IWERK>
		<INGRP>t</INGRP>
		<FLTYP>t</FLTYP>
		<AUFNR>t</AUFNR>
		<KTEXT_SM>t</KTEXT_SM>
	</PSL>
	<FXP_PROD>
		<SEP>/</SEP>
		<produktinstanzID>
			<IND>1234567890</IND>
			<SUF>.IP_Service_Plattform</SUF>
		</produktinstanzID>
	</FXP_PROD>
	<LCS>
		<ELC MATERIAL_NUMBER="40247125" EQUIPMENT_NR="23655654"/>
		<LC MATERIAL_NUMBER="402471251" EQUIPMENT_NR="236556541">
			<PORT tnba="TNBA-5584-52e"></PORT>
			<PORT tnba="TNBA-5584-53e"></PORT>
			<PORT tnba="TNBA-5584-54e"></PORT>
			<PORT tnba="TNBA-5584-55e"></PORT>
			<PORT tnba="TNBA-5584-56e"></PORT>
			<PORT tnba="TNBA-5584-57e"></PORT>
			<PORT tnba="TNBA-5584-58e"></PORT>
		</LC>
		<LC MATERIAL_NUMBER="402471252" EQUIPMENT_NR="236556542">
			<PORT tnba="TNBA-5584-59e"></PORT>
			<PORT tnba="TNBA-5584-60e"></PORT>
			<PORT tnba="TNBA-5584-61e"></PORT>
			<PORT tnba="TNBA-5584-62e"></PORT>
			<PORT tnba="TNBA-5584-63e"></PORT>
		</LC>
	</LCS>
</AN>`;

	var sel = document.getElementById("selOp");
	var req = document.getElementById("reqHolder");
	var res = document.getElementById("resHolder");
	var ds = document.getElementById("datasetHolder");
	var ident = document.getElementById("identifier");
	var divInputReqResXml = document.getElementById("inputReqResXml");
	var reqTa = document.getElementById("reqTa");
	var resTa = document.getElementById("resTa");
	var datasetTa = document.getElementById("datasetTa");
	var divInputDatasetXml = document.getElementById("inputDatasetXml");
	var java_vtn = document.getElementById("java_val_to_node");
	var inputXML = document.getElementById("inputReq_Res");
	var inputDataset = document.getElementById("inputDataset");
	var outPanel;
	var btnInputReqResXml = document.getElementById("btnInputReqResXml");
	var btnInputDatasetXml = document.getElementById("btnInputDatasetXml");
	var lookupMode = false;
	var resultView = false;
	var lookupValReq;
	var lookupValDS;
	var i = 0;

		
	resultXslt = document.implementation.createDocument(ns["xslt"], "xsl:stylesheet");
	//setDataset(anxml_str);

	outPanel = document.getElementById("out");
	outPanel.textContent = xsltBldrApp.serializer.serializeToString(resultXslt);
	outPanel.addEventListener("dblclick", displayTransResult);

	//ds_xml = xsltBldrApp.parser.parseFromString(ds_xml_str, "text/xml");
	setDataset(ds_xml_str);


	//set drophandler on identifier div

	datasetTa.addEventListener("change", setDataset);

	function setDataset(set) {
		var inSet = (typeof set == "object") ? set.target.value : set;
		ds_xml = xsltBldrApp.parser.parseFromString(inSet, "text/xml");
		dsxml_id_d = xsltBldrApp.transformers.addIdsToNodesTransf.transformToDocument(ds_xml);
		xsltBldrApp.transformers.xmlToDraggableHtmlTransf.setParameter(null, "doc-role", "business-object");
		ds.innerHTML = xsltBldrApp.serializer.serializeToString(xsltBldrApp.transformers.xmlToDraggableHtmlTransf.transformToDocument(dsxml_id_d));

		var cols = document.querySelectorAll('#datasetHolder .xmlNodeDiv');
		[].forEach.call(cols, function (col) {
			col.addEventListener('dragstart', handleDragStart, false);
			col.addEventListener('dragenter', handleDragEnter, false);
			col.addEventListener('dragover', handleDragOver, false);
			col.addEventListener('dragleave', handleDragLeave, false);
			col.addEventListener('drop', handleDropOnDS, false);
			col.addEventListener('dragend', handleDragEnd, false);
			col.addEventListener('dblclick', tglCollapse, false);
		}
		);
		//add ns decl for external dataset xml
		resultXslt.documentElement.setAttributeNS(ns["xmlns"], "xmlns:ds", ns["ds"]);
		addPref2bExcluded("exclude-result-prefixes", "ds");
	};

	var cols = document.querySelectorAll('.btn');
	[].forEach.call(cols, function (col) {
		col.addEventListener('dragstart', handleDragStart, false);
		col.addEventListener('dragend', handleDragEnd, false);
	}
	);

	ident.addEventListener("dragover", handleDragOver);
	ident.addEventListener("drop", handleIdentDiv);
	ident.addEventListener("dblclick", editFilenameFormula);

	function updateTAs(e) {
		var curOpStr = e.target.value;
		if (curOpStr == '')
			return;

		reqTa.value = xsltBldrApp.reqResSamples[curOpStr]['req'];
		resTa.value = xsltBldrApp.reqResSamples[curOpStr]['res'];

		submitListener(xsltBldrApp.reqResSamples[curOpStr]['req'], xsltBldrApp.reqResSamples[curOpStr]['res']);
	}

	function submitListener(reqStr, resStr) {
		ident.textContent = "";
		documentEls2bReplaced = []; //fake document() related
		inReq = xsltBldrApp.parser.parseFromString(reqStr, "text/xml");
		inRes = xsltBldrApp.parser.parseFromString(resStr, "text/xml");

		xsltBldrApp.xmlDocuments.registerXmlDocumentFromString('req', reqStr);
		xsltBldrApp.xmlDocuments.registerXmlDocumentFromString('res', resStr);

		req.innerHTML = inReq.documentElement.nodeName;
		res.innerHTML = inRes.documentElement.nodeName;
		xsltBldrApp.transformers.addIdsToNodesTransf.setParameter(null, "filterOnOff", (document.getElementById("allNodes").checked) ? "off" : "on");
		req_id_d = xsltBldrApp.transformers.addIdsToNodesTransf.transformToDocument(inReq);
		xsltBldrApp.transformers.xmlToDraggableHtmlTransf.setParameter(null, "doc-role", "req");
		req_div_d = xsltBldrApp.transformers.xmlToDraggableHtmlTransf.transformToDocument(req_id_d);
		var reqSerialized = xsltBldrApp.serializer.serializeToString(req_div_d);
		document.getElementById("reqHolder").innerHTML = reqSerialized;

		xsltBldrApp.transformers.xmlToDraggableHtmlTransf.setParameter(null, "doc-role", "res");
		res_id_d = xsltBldrApp.transformers.addIdsToNodesTransf.transformToDocument(inRes);
		res_div_d = xsltBldrApp.transformers.xmlToDraggableHtmlTransf.transformToDocument(res_id_d);
		document.getElementById("resHolder").innerHTML = xsltBldrApp.serializer.serializeToString(res_div_d);

		var cols = document.querySelectorAll('#reqHolder .xmlNodeDiv');
		[].forEach.call(cols, function (col) {
			col.addEventListener('dragstart', handleDragStart, false);
			col.addEventListener('dragend', handleDragEnd, false);
			col.addEventListener('dblclick', tglCollapse, false);
		}
		);

		var cols = document.querySelectorAll('#resHolder .xmlNodeDiv');
		[].forEach.call(cols, function (col) {
			col.addEventListener('dragstart', handleDragStart, false);
			col.addEventListener('dragenter', handleDragEnter, false);
			col.addEventListener('dragover', handleDragOver, false);
			col.addEventListener('dragleave', handleDragLeave, false);
			col.addEventListener('drop', handleDrop, false);
			col.addEventListener('dragend', handleDragEnd, false);
			col.addEventListener('dblclick', tglCollapse, false);
		}
		);

		//create result XSLT document and documentElement
		resultXslt = document.implementation.createDocument(ns["xslt"], "xsl:stylesheet");

		addDeclToStylesheet(resultXslt);

		xsltBldrApp.contrastingColors = xsltBldrApp.usedColors.concat(xsltBldrApp.contrastingColors);
		xsltBldrApp.dragOrigin = req_id_d.documentElement;
		processDrag(res_id_d.documentElement.id);
		displayResult();
	}

	function tglCollapse(e) {
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

	function displayResult() {
		xsltBldrApp.transformers.indentTransf.setParameter(null, "noFilter", "false");
		var prettyPretty = xsltBldrApp.transformers.templDividerTransf.transformToDocument(xsltBldrApp.transformers.indentTransf.transformToDocument(resultXslt));

		[].forEach.call(resultXslt.documentElement.attributes, function (atr) {
			prettyPretty.documentElement.setAttributeNS(atr.namespaceURI, atr.nodeName, atr.value);
		});

		document.getElementById("out").value =
			xsltBldrApp.serializer.serializeToString(prettyPretty);
		resultView = false;
	}

	function markAsDone(tar, src) {

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

	function processDrag(targetId) {

		var targetNode = res_id_d.getElementById(targetId);
		var explodedSrcId = xsltBldrApp.dragOrigin.id.split("@");
		var origin = (r = req_id_d.getElementById(explodedSrcId[0])) || (dsxml_id_d && (d = dsxml_id_d.getElementById(explodedSrcId[0]))) || null;

		if (r)
			lookupMode = false;

		if (!targetNode)
			return;

		if (lookupMode) {
			processLookup(srcId, targetId);
			return;
		}

		const srcId = xsltBldrApp.dragOrigin.id;

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

			var templ = xsltTagFactory(
				{
					name: "template",
					atrs: [["match", xmlUtils.qName(origin)]]
				}
			);

			if (origin.parentNode.nodeType == 9 && r) {
				var clonedDocEl = res_id_d.documentElement.cloneNode(true);
				templ.appendChild(clonedDocEl);
				resultXslt.documentElement.appendChild(templ);
			}

			var correspondingResultNode = resultXslt.getElementById(targetId);

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
					var prefix = freeIndex(resultXslt);

					resultXslt.documentElement.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:ns" + prefix, pkg);
					addPref2bExcluded("extension-element-prefixes", "ns" + prefix);

					var aplTempl = xsltTagFactory(
						{
							name: "apply-templates",
							atrs: [["select", templ2bApplied]]
						});
					correspondingResultNode.parentNode.insertBefore(aplTempl,
						correspondingResultNode);

					templ.appendChild(xsltTagFactory({ name: "copy-of", atrs: [["select", prefix + ":" + methName + "(.)"]] }));
					resultXslt.documentElement.appendChild(templ);
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
					resultXslt.documentElement.appendChild(templ);
				} // target is not a node container, but a value container
				else {
					var correspondingResultNode = resultXslt.getElementById(targetId);
					while (correspondingResultNode.hasChildNodes())
						correspondingResultNode.childNodes[0].remove();
					var atrs = [["select", templ2bApplied]];
					correspondingResultNode.appendChild(xsltTagFactory({ name: "value-of", atrs }));
				}
			}
			markAsDone(targetId, srcId);

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
						appendXsltChild(t_c, { name: "value-of", atrs: [["select", (x + "/" + xmlUtils.qName(t_c)).replace(/^\//, "")]] });
						markAsDone(t_c.id, match.id);
					}
					if (match && match.childNodes[0] && match.childNodes[0].nodeType == 1 && t_c.childNodes[0] && t_c.childNodes[0].nodeType == 1) {
						addXPaths(match, t_c, x + "/" + xmlUtils.qName(t_c));
						//markAsDone(t_c.id,match.id);
					}
				})
			}
			addXPaths(origin, correspondingResultNode, "");
		}
		displayResult(resultXslt);
		//console.log(targetNode);
	}

	function handleDragStart(e) {

		if (e.stopPropagation) {
			e.stopPropagation(); // stops the event from bubbling up.
		}
		e.dataTransfer.effectAllowed = 'move';
//		e.dataTransfer.setData('text/plain', this.id);
		xsltBldrApp.dragOrigin = this;
	}

	function handleDragOver(e) {
		if (e.preventDefault) {
			e.preventDefault(); // Necessary. Allows us to drop.
		}
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

		return false;
	}

	function handleDragEnter(e) {
		// this / e.target is the current hover target.
		this.classList.add('over');
	}

	function handleDragLeave(e) {
		this.classList.remove('over');  // this / e.target is previous target element.
	}

	function handleDrop(e) {

		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		processDrag(e.target.id);
		return false;
	}

	function handleDropOnDS(e) {

		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		if (e.preventDefault)
			e.preventDefault();
		lookupMode = true;
		console.log("lookupMode " + lookupMode);
		lookupValReq = xsltBldrApp.dragOrigin;
		lookupValDS = e.target.id;
		console.log(xsltBldrApp.dragOrigin.id, e.target.id);
		return false;
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
			xmlUtils.findTemplateParent(resultXslt.getElementById(t)), true, null);
		//console.log(xmlUtils.getTempl2bApplied(commonAnchestor[0],"foo",false,null)+"["+a+"=current()/"+templ2bApplied+"]/"+b);
		var target = resultXslt.getElementById(t);
		while (target.hasChildNodes())
			target.childNodes[0].remove();
		target.appendChild(xsltTagFactory({ name: "value-of", atrs: [["select", xmlUtils.getTempl2bApplied(commonAnchestor[0], "foo", false, null) + "[" + a + "=current()/" + templ2bApplied + "]/" + b]] }));
		lookupMode = false;
		markAsDone(t);
		displayResult();
	}

	function handleDragEnd(e) {
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

	xsltBldrApp.sendTransformRequest = async () => {

		const transformRequestDocument = document.implementation.createDocument(null, "transform_data");

		const root = transformRequestDocument.documentElement;

		// create request Node of transform request document
		const requestNode = transformRequestDocument.createElementNS(null, "request");

		requestNode.appendChild(transformRequestDocument.importNode(inReq.documentElement, true));

		// create stylesheet Node of transform request document

		const clonedStylesheet = document.implementation.createDocument(null, null);
		clonedStylesheet.appendChild(resultXslt.documentElement.cloneNode(true));

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
			})
			
			;


	};

	function displayTransResult() {
		if (resultView) {
			displayResult();
			return;
		}

		xsltBldrApp.sendTransformRequest();

		return;

		var Xslt2bEvaluated = document.implementation.createDocument(null, null);
		Xslt2bEvaluated.appendChild(resultXslt.documentElement.cloneNode(true));

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

			Xslt2bEvaluated.documentElement.setAttributeNS(ns["xmlns"],"xmlns:exsl",ns["exsl"]);*/

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

	function handleIdentDiv(e) {
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		if (e.preventDefault)
			e.preventDefault();
		const dragOriginCorrespondingReqXmlElement = req_id_d.getElementById(xsltBldrApp.dragOrigin.id);
		// if (!el) {
		// 	console.log("not valid el");
		// 	return;
		// }
		if (!resultXslt.getElementById("dataset"))
			resultXslt.documentElement.insertBefore(
				xsltTagFactory({ name: "variable", atrs: [["name", "dataset"], ["id", "dataset"], ["select", "document($filename)"]] }),
				resultXslt.documentElement.childNodes[0]);
		if (!resultXslt.getElementById("filename"))
			resultXslt.documentElement.insertBefore(
				xsltTagFactory({ name: "variable", atrs: [["name", "filename"], ["id", "filename"], ["select", "concat(translate($identNode,'/','_'),'.xml')"]] }),
				resultXslt.documentElement.childNodes[0]);
		if (!resultXslt.getElementById("identNode")) {
			resultXslt.documentElement.insertBefore(
				xsltTagFactory({ name: "variable", atrs: [["name", "identNode"], ["id", "identNode"], ["select", xmlUtils.getXPathForElement(dragOriginCorrespondingReqXmlElement, req_id_d)]] }),
				resultXslt.documentElement.childNodes[0]);
		} else {
			resultXslt.getElementById("identNode").setAttribute("select", xmlUtils.getXPathForElement(dragOriginCorrespondingReqXmlElement, req_id_d));
		}

		evalFilenameFormula();

		displayResult();
		return false;
	}

	function evalFilenameFormula() {//assemble xslt for live preview of external filename		
		var xslt_live_prev_xml = document.implementation.createDocument(ns["xslt"], "xsl:stylesheet");

		[].forEach.call(resultXslt.documentElement.attributes, function (atr) {
			xslt_live_prev_xml.documentElement.setAttributeNS(atr.namespaceURI, atr.nodeName, atr.value);
		});

		xslt_live_prev_xml.documentElement.appendChild(xsltTagFactory({ name: "output", atrs: [["method", "xml"]] }));

		//xslt_live_prev_xml.documentElement.appendChild(resultXslt.getElementById("identNode").cloneNode());
		xslt_live_prev_xml.documentElement.appendChild(xsltTagFactory({ name: "variable", atrs: [["name", "identNode"], ["select", resultXslt.getElementById("identNode").getAttribute("select")]] }));

		var preview_template = xsltTagFactory({ name: "template", atrs: [["match", "/"]] });
		var dummyNode = xslt_live_prev_xml.createElement("dummy");

		preview_template.appendChild(dummyNode);
		dummyNode.appendChild(xsltTagFactory(
			{
				name: "value-of",
				atrs: [["select", resultXslt.getElementById("filename").getAttribute("select")]]
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

	function editFilenameFormula() {

		if (!(fnNode = resultXslt.getElementById("filename"))) {
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

	[].forEach.call([java_vtn, inputXML, inputDataset], function (el) {
		el.addEventListener("click", function () {

			this.classList.add("depressed");
			if (el === inputXML) {
				divInputReqResXml.style.display = "block";
			} else if (el === inputDataset) {
				divInputDatasetXml.style.display = "block";
			} else if (el === inputDataset) {
				datasetTa.style.display = "none";
				if ((trimmed = datasetTa.value.replace(/^\s+/, "")) != "")
					setDataset(trimmed);
			}
			// }else{
			// 	this.classList.remove("depressed");
			// 	if(el===inputXML){
			// reqTa.style.display = "none";
			// resTa.style.display = "none";
			// }
		});
	});

	btnInputReqResXml.addEventListener("click", function () {
		inputXML.classList.remove("depressed");
		divInputReqResXml.style.display = "none";
		if ((reqTrimmed = reqTa.value.replace(/^\s+/, "")) != "" && (resTrimmed = resTa.value.replace(/^\s+/, "")) != "")
			submitListener(reqTrimmed, resTrimmed);
	});

	btnInputDatasetXml.addEventListener("click", function () {
		inputDataset.classList.remove("depressed");
		divInputDatasetXml.style.display = "none";
	});


	function addUuid(targetId) {
		//add declarations to docElement -//TODO 2brefactored
		resultXslt.documentElement.setAttributeNS(ns["xmlns"], "xmlns:java", "java");
		addPref2bExcluded("extension-element-prefixes", "java");

		//insert java function for UUID
		var correspondingResultNode = resultXslt.getElementById(targetId);
		while (correspondingResultNode.hasChildNodes())
			correspondingResultNode.childNodes[0].remove();
		appendXsltChild(correspondingResultNode, { name: "value-of", atrs: [["select", "java:util.UUID.randomUUID()"]] });
		addPref2bExcluded("exclude-result-prefixes", "java");
		markAsDone(targetId);
	}

	function addNumbering(targetId) {
		var inFormula = prompt("Enter formula here (position() returns position among siblings)\nYou can do math like 'position()+100'", "position()");
		var correspondingResultNode = resultXslt.getElementById(targetId);
		while (correspondingResultNode.hasChildNodes())
			correspondingResultNode.childNodes[0].remove();
		correspondingResultNode.appendChild(xsltTagFactory({ name: "value-of", atrs: [["select", inFormula]] }));
		markAsDone(targetId);
	}

	/*document.getElementById("param").addEventListener("click",function(){
		var paramName = prompt("What name do you want to give that parameter?\n\n[A-Za-z_]\w*");
		var defVal = prompt("Do you want to set a default value?");
		var atrs = [["name",paramName],["gl_param","true"]];
		if(defVal)
			atrs.push(["select",defVal]);
		resultXslt.documentElement.appendChild(xsltTagFactory({name:"param",atrs:atrs}));
		var divTag = document.createElement("div");
		divTag.appendChild(document.createTextNode("$"+paramName));
		divTag.className = "btn param";
		divTag.title = "Drag this where you want to insert $" + paramName;
		divTag.setAttribute("draggable","true");
		document.getElementById("btn_bar").appendChild(divTag);

		displayResult();
	});*/

	for (str in xsltBldrApp.reqResSamples) {
		var opt = document.createElement("option");
		opt.appendChild(document.createTextNode(str));
		sel.appendChild(opt);
	}
	sel.addEventListener("change", updateTAs);


	document.getElementById("editXslt").addEventListener("click", function () {
		if (this.className.indexOf("depressed") == -1) {
			this.classList.add("depressed");
			xsltBldrApp.transformers.indentTransf.setParameter(null, "noFilter", "true");
			var pretty = xsltBldrApp.transformers.indentTransf.transformToDocument(resultXslt);
			addDeclToStylesheet(pretty);
			outPanel.value = xsltBldrApp.serializer.serializeToString(pretty);
		} else {
			//displayResult();
			var newResultXslt = xsltBldrApp.parser.parseFromString(outPanel.value, "text/xml");
			if (!newResultXslt) {
				alert("You are edited xslt does not seem to be well-formed xml.");
				return;
			}
			resultXslt = newResultXslt;
			this.classList.remove("depressed");
			resultView = false;
			displayTransResult();
			/*xsltBldrApp.transformers.indentTransf.setParameter(null,"noFilter","false");
			document.getElementById("out").value =
			xsltBldrApp.serializer.serializeToString(xsltBldrApp.transformers.templDividerTransf.transformToDocument(xsltBldrApp.transformers.indentTransf.transformToDocument(resultXslt)));
			resultView = false;*/
		}
	});

	function appendXsltChild(p, oXTag) {
		var xsltNode = resultXslt.createElementNS(ns["xslt"], "xsl:" + oXTag.name);
		[].forEach.call(oXTag.atrs, function (atr) {
			xsltNode.setAttribute(atr[0], atr[1]);
		});
		p.appendChild(xsltNode);
		return xsltNode;
	}

	function xsltTagFactory(oXTag) {
		var xsltNode = resultXslt.createElementNS(ns["xslt"], "xsl:" + oXTag.name);
		[].forEach.call(oXTag.atrs, function (atr) {
			xsltNode.setAttribute(atr[0], atr[1]);
		});
		return xsltNode;
	}

	function addPref2bExcluded(atrName, prefixName) {
		if (resultXslt.documentElement.getAttribute(atrName)) {
			if (resultXslt.documentElement.getAttribute(atrName).indexOf(prefixName) == -1)
				resultXslt.documentElement.setAttribute(atrName, (" " + prefixName));
		} else {
			resultXslt.documentElement.setAttribute(atrName, prefixName);
		}
	}

	function freeIndex(doc) {
		var freeIndex = 1;
		while (doc.documentElement.lookupNamespaceURI("ns" + freeIndex)) { freeIndex++ };
		return freeIndex;
	}

	function addDeclToStylesheet(doc) {
		//add all namespace declarations from the res
		[].forEach.call(inRes.documentElement.attributes, function (atr) {
			doc.documentElement.setAttributeNS(atr.namespaceURI, atr.nodeName, atr.value);
		});
		//add ns declarations to xslt for default ns from req
		if ((reqDefNS = inReq.documentElement.lookupNamespaceURI(null)) != null) {
			var altNS;
			if (!inRes.documentElement.lookupPrefix(reqDefNS)) {
				altNS = "xmlns:ns" + freeIndex(doc);
			} else {
				altNS = "xmlns:" + inRes.documentElement.lookupPrefix(reqDefNS);
			}
			doc.documentElement.setAttributeNS(ns["xmlns"], altNS, reqDefNS);
		};
		//add ns declaration to xslt only in req
		[].forEach.call(inReq.documentElement.attributes, function (atr) {
			if (!doc.documentElement.lookupPrefix(atr.value)) {
				altNS = "";
				altNS = "xmlns:ns" + freeIndex(doc);
				doc.documentElement.setAttributeNS(ns["xmlns"], altNS, atr.value);
			};
		});
		doc.documentElement.setAttribute("version", "1.0");
		doc.documentElement.setAttributeNS(ns["xmlns"], "xmlns:ds", ns["ds"]);
		addPref2bExcluded("exclude-result-prefixes", "ds");
	}
}