xsltBldrApp.setReqResInputPanels = async function(e) {
    const selectedOptionVal = e.target.value;
    if (selectedOptionVal == ''){
        reqTa.value = '';
        resTa.value = '';
        return;
    }

    const fetchedReqData = await fetch(`./sampleMessages/${selectedOptionVal}/req.xml`);
    const strReqMessage = await fetchedReqData.text();
    reqTa.value = strReqMessage;
    
    const fetchedResData = await fetch(`./sampleMessages/${selectedOptionVal}/res.xml`);
    const strResMessage = await fetchedResData.text();
    resTa.value = strResMessage;

    //processInputReqResMessages(xsltBldrApp.reqResSamples[curOpStr]['req'], xsltBldrApp.reqResSamples[curOpStr]['res']);
}

xsltBldrApp.initUi = function(){

	return (function(app){

		app.req = document.getElementById("reqHolder");
		app.res = document.getElementById("resHolder");
		app.ds = document.getElementById("datasetHolder");

		var divInputReqResXml = document.getElementById("inputReqResXml");
		var reqTa = document.getElementById("reqTa");
		reqTa.value = '';
		var resTa = document.getElementById("resTa");
		resTa.value = '';

		var divInputDatasetXml = document.getElementById("inputDatasetXml");
		var java_vtn = document.getElementById("java_val_to_node");
		var inputXML = document.getElementById("inputReq_Res");
		var inputDataset = document.getElementById("inputDataset");
		
		
		var selReqResSample = document.getElementById("selOp");
        selReqResSample.addEventListener("change", app.setReqResInputPanels);

		
		
		var btnInputReqResXml = document.getElementById("btnInputReqResXml");
		btnInputReqResXml.addEventListener("click", function () {
			inputXML.classList.remove("depressed");
			divInputReqResXml.style.display = "none";
			if ((reqTrimmed = reqTa.value.replace(/^\s+/, "")) != "" && (resTrimmed = resTa.value.replace(/^\s+/, "")) != "")
			xsltBldrApp.processInputReqResMessages(reqTrimmed, resTrimmed);
		});

		
		var btnInputDatasetXml = document.getElementById("btnInputDatasetXml");
	btnInputDatasetXml.addEventListener("click", function () {
		inputDataset.classList.remove("depressed");
		divInputDatasetXml.style.display = "none";
	});


		app.outPanel = document.getElementById("out");
		outPanel = app.outPanel;
		outPanel.textContent = xsltBldrApp.serializer.serializeToString(app.resultXslt);
		outPanel.addEventListener("dblclick", app.displayTransResult);

		
		app.datasetTa = document.getElementById("datasetTa");
				
		fetch(`./businessObjects/AN${"49_2777_40_7MA3"}.xml`)
		.then(businessObjectData => businessObjectData.text())
		.then(businessObjectDataText => app.setDataset(businessObjectDataText));
		
		app.datasetTa.addEventListener("change", app.setDataset);


		app.ident = document.getElementById("identifier");
			
		app.ident.addEventListener("dragover", app.handleDragOver);
		app.ident.addEventListener("drop", app.handleIdentDiv);
		app.ident.addEventListener("dblclick", app.editFilenameFormula);


        //wire buttons
        document.querySelectorAll('.btn')
        .forEach(function (btn) {
            btn.addEventListener('dragstart', app.handleDragStart, false);
            btn.addEventListener('dragend', app.handleDragEnd, false);
        });


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

		document.getElementById("editXslt").addEventListener("click", function () {
		if (this.className.indexOf("depressed") == -1) {
			this.classList.add("depressed");
			xsltBldrApp.transformers.indentTransf.setParameter(null, "noFilter", "true");
			var pretty = xsltBldrApp.transformers.indentTransf.transformToDocument(xsltBldrApp.resultXslt);
			addDeclToStylesheet(pretty);
			outPanel.value = xsltBldrApp.serializer.serializeToString(pretty);
		} else {
			//displayResult();
			var newResultXslt = xsltBldrApp.parser.parseFromString(outPanel.value, "text/xml");
			if (!newResultXslt) {
				alert("You are edited xslt does not seem to be well-formed xml.");
				return;
			}
			xsltBldrApp.resultXslt = newResultXslt;
			this.classList.remove("depressed");
			resultView = false;
			displayTransResult();
			/*xsltBldrApp.transformers.indentTransf.setParameter(null,"noFilter","false");
			document.getElementById("out").value =
			xsltBldrApp.serializer.serializeToString(xsltBldrApp.transformers.templDividerTransf.transformToDocument(xsltBldrApp.transformers.indentTransf.transformToDocument(xsltBldrApp.resultXslt)));
			resultView = false;*/
		}
	});

	})(xsltBldrApp);
};


window.onload = function () {

	xsltBldrApp.initUi();

	/*document.getElementById("param").addEventListener("click",function(){
		var paramName = prompt("What name do you want to give that parameter?\n\n[A-Za-z_]\w*");
		var defVal = prompt("Do you want to set a default value?");
		var atrs = [["name",paramName],["gl_param","true"]];
		if(defVal)
			atrs.push(["select",defVal]);
		xsltBldrApp.resultXslt.documentElement.appendChild(xsltTagFactory({name:"param",atrs:atrs}));
		var divTag = document.createElement("div");
		divTag.appendChild(document.createTextNode("$"+paramName));
		divTag.className = "btn param";
		divTag.title = "Drag this where you want to insert $" + paramName;
		divTag.setAttribute("draggable","true");
		document.getElementById("btn_bar").appendChild(divTag);

		displayResult();
	});*/

	// for (str in xsltBldrApp.reqResSamples) {
	// 	var opt = document.createElement("option");
	// 	opt.appendChild(document.createTextNode(str));
	// 	sel.appendChild(opt);
	// }
}