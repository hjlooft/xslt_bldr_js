const xsltBldrApp = {};
xsltBldrApp.parser = new DOMParser();
xsltBldrApp.serializer = new XMLSerializer();


xsltBldrApp.namespaces = {
	"xslt": "http://www.w3.org/1999/XSL/Transform",
	"xmlns": "http://www.w3.org/2000/xmlns/",
	"ds": "http://testing/dataset",
	"exsl": "http://exslt.org/common"
};

//from https://sashamaps.net/docs/resources/20-colors/
// put red at the end. Color defs in css file
xsltBldrApp.contrastingColors = [
    "Green",
    "Yellow",
    "Blue",
    "Orange",
    "Purple",
    "Cyan",
    "Magenta",
    "Lime",
    "Pink",
    "Teal",
    "Lavender",
    "Brown",
    "Beige",
    "Maroon",
    "Mint",
    "Olive",
    "Apricot",
    "Navy",
    "Grey",
    "Red"    
];

xsltBldrApp.usedColors = [];