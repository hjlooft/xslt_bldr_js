<?xml version="1.0"?>
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
	</xsl:stylesheet>