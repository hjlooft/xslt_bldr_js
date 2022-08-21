//cache for XSLT transformers
xsltBldrApp.transformers = {};

xsltBldrApp.transform = async (styleSheetName, srcDoc, params) => {

	if(styleSheetName === "indent" && navigator.userAgent.indexOf("Firefox")!=-1){
		styleSheetName = 'indentFF';
	}

	console.log(!!xsltBldrApp.transformers[styleSheetName], styleSheetName);

	if (!xsltBldrApp.transformers[styleSheetName]) {
		console.log(`caching ${styleSheetName}`);
		const data = await fetch(`./xslt/${styleSheetName}.xsl`);
		const xsltTxt = await data.text();
		let xmlDoc = xsltBldrApp.parser.parseFromString(xsltTxt, "text/xml");
		const proc = new XSLTProcessor();
		proc.importStylesheet(xmlDoc);
		xsltBldrApp.transformers[styleSheetName] = proc;
	}

	if(params){
		params.forEach(param => xsltBldrApp.transformers[styleSheetName].setParameter(null, param.paramName, param.paramValue));
	}

	const transformResultDoc = /*await*/ xsltBldrApp.transformers[styleSheetName].transformToDocument(srcDoc);
	return transformResultDoc;
};

// xsltBldrApp.transformTest = ()=> {
// 	const configureRequest_req = xsltBldrApp.parser.parseFromString(xsltBldrApp.reqResSamples.configureRequest.req, "text/xml");
// 	//console.log(xsltBldrApp.transform("xmlToDraggableHtml", configureRequest_req));
// 	console.log('start');
// 	xsltBldrApp.transform("xmlToDraggableHtml", configureRequest_req).then((html) => console.log(html));	
// 	console.log('end');
// };