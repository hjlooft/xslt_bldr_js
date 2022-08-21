xsltBldrApp.transformers = 

(function(){
	const xsltStrs = {};

	xsltStrs.highlightXmlTransf =
	`<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml"/>
    <xsl:strip-space elements="*"/>
      
    <xsl:template match="*">
        <div class="tag">
            <span class="bracket">&lt;</span><xsl:value-of select="name()"/>
            <!-- <xsl:for-each select="namespace::node()">
                 <xsl:text> </xsl:text>
                 <xsl:value-of select="name(current())" />
                 <xsl:text> </xsl:text>
                 </xsl:for-each> -->
            <xsl:for-each select="namespace::*[not(. = ../ancestor::*/namespace::node())]">
                <xsl:value-of select="concat(' ',name(), '=&quot;', ., '&quot;')"/>
            </xsl:for-each>
            
            <xsl:apply-templates select="@*"/>
            <span class="bracket">&gt;</span>
            <xsl:apply-templates select="node()"/>
            <span class="bracket">&lt;</span>/<xsl:value-of select="name()"/><span class="bracket">&gt;</span>
        </div>
    </xsl:template>
    
    <xsl:template match="text()"><span class="textContent"><xsl:value-of select="."/></span></xsl:template>
    
    <xsl:template match="comment()">
        <div><span class="comment">&lt;!--<xsl:value-of select="."/>--&gt;</span></div>
    </xsl:template>
    
    <xsl:template match="@*">
        <xsl:text> </xsl:text><span class="attrName"><xsl:value-of select="name()"/></span><span class="attrVal">="<xsl:value-of select="."/>"</span>     
    </xsl:template>
    
</xsl:stylesheet>`;
	
	xsltStrs.xmlToDraggableHtmlTransf =
	`<?xml version="1.0"?>
	<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
		<xsl:output method="html"/>
		<xsl:param name="doc-role"></xsl:param>
		<xsl:template match="/">
			<xsl:copy>
				<xsl:apply-templates select="*"/>
			</xsl:copy>
		</xsl:template>
		<xsl:template match="node()">
			<xsl:if test="name()">
				<div class="xmlNodeDiv" draggable="true">
					<xsl:if test="not(*)">
						<xsl:attribute name="title">
							<xsl:value-of select="."/>
						</xsl:attribute>
					</xsl:if>
					<xsl:copy-of select="@id"/>
					<xsl:value-of select="name()"/>
					<xsl:apply-templates select="@*[name()!='id']"/>
					<xsl:apply-templates select="node()"/>
				</div>
			</xsl:if>
		</xsl:template>
		<xsl:template match="@*[name()!='id']">
			<div class="atr" id="{concat(../@id,'@',name())}" draggable="true">
				<xsl:if test="not(*)">
					<xsl:attribute name="title">
						<xsl:value-of select="."/>
					</xsl:attribute>
				</xsl:if>
				<xsl:text>@</xsl:text><xsl:value-of select="name()"/>
			</div>
		</xsl:template>
	</xsl:stylesheet>`;
	
	xsltStrs.addIdsToNodesTransf = '<?xml version="1.0"?>\
	<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">\
		<xsl:strip-space elements="*"/>\
		<xsl:param name="filterOnOff" select="\'on\'"/>\
		<xsl:template match="/">\
			<xsl:copy>\
				<xsl:apply-templates select="node()|@*"/>\
			</xsl:copy>\
		</xsl:template>\
		<xsl:template match="node()">\
			<xsl:if test="(name(.) and not(preceding-sibling::*[name()=name(current())])) or $filterOnOff=\'off\'">\
				<xsl:copy>\
					<xsl:attribute name="id">\
						<xsl:value-of select="generate-id()"/>\
					</xsl:attribute>\
					<xsl:if test="$filterOnOff=\'on\'">\
					<xsl:value-of select="text()"/>\
					</xsl:if>\
					<xsl:apply-templates select="node()|@*"/>\
				</xsl:copy>\
			</xsl:if>\
		</xsl:template>\
		<xsl:template match="@*">\
			<xsl:copy>\
				<xsl:apply-templates select="node()|@*"/>\
			</xsl:copy>\
		</xsl:template>\
	</xsl:stylesheet>';
	
	
	xsltStrs.templDividerTransf = '<?xml version="1.0"?><xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml"/><xsl:template match="node()|@*"><xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy></xsl:template><xsl:template match="xsl:template"><xsl:text>&#10;  </xsl:text><xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy>	</xsl:template></xsl:stylesheet>';
	
	xsltStrs.indentTransf = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml" indent="yes"/><xsl:strip-space elements="*"/><xsl:param name="noFilter"/><xsl:template match="node()|@*"><xsl:copy><xsl:apply-templates select="node()|@*"/></xsl:copy></xsl:template><xsl:template match="@id|@fakeDocFn|@gl_param"><xsl:if test="$noFilter=\'true\'"><xsl:copy-of select="."/></xsl:if></xsl:template></xsl:stylesheet>';
	if(navigator.userAgent.indexOf("Firefox")>=-1){
		xsltStrs.indentTransf = '<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"><xsl:output method="xml" indent="yes"/><xsl:param name="noFilter"/><xsl:param name="indent-increment" select="\'   \'" /><xsl:template match="*"><xsl:param name="indent" select="\'&#xA;\'"/><xsl:value-of select="$indent"/><xsl:copy><xsl:choose><xsl:when test="$noFilter=\'false\'"><xsl:copy-of select="@*[name()!=\'id\' and name()!=\'fakeDocFn\' and name()!=\'gl_param\']" /></xsl:when><xsl:when test="$noFilter=\'true\'"><xsl:copy-of select="@*"/></xsl:when></xsl:choose><xsl:apply-templates><xsl:with-param name="indent" select="concat($indent, $indent-increment)"/></xsl:apply-templates><xsl:if test="*"><xsl:value-of select="$indent"/></xsl:if></xsl:copy></xsl:template><xsl:template match="comment()|processing-instruction()"><xsl:copy /></xsl:template><!-- WARNING: this is dangerous. Handle with care --><xsl:template match="text()[normalize-space(.)=\'\']"/></xsl:stylesheet>';
	}

	const transformers = {};

	Object.keys(xsltStrs).forEach((key) => {
		let xmlDoc = xsltBldrApp.parser.parseFromString(xsltStrs[key],"text/xml");
		const proc = new XSLTProcessor();
		proc.importStylesheet(xmlDoc);
		transformers[key] = proc;		
	});

	return transformers;
})(); 
