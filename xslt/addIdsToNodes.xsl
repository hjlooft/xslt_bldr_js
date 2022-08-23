<?xml version="1.0"?>
	<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:hjl="https://github.com/hjlooft/xsltBldr2015">
		<xsl:strip-space elements="*"/>
		<xsl:param name="filterOnOff" select="'on'"/>
		<xsl:param name="doc-role"></xsl:param>
		<xsl:template match="/">
			<xsl:copy>
				<xsl:apply-templates select="node()|@*"/>
			</xsl:copy>
		</xsl:template>
		<xsl:template match="node()">
			<xsl:if test="(name(.) and not(preceding-sibling::*[name()=name(current())])) or $filterOnOff='off'">
				<xsl:copy>
					<xsl:attribute name="hjl:id">
						<xsl:value-of select="concat($doc-role,'_',generate-id())"/>
					</xsl:attribute>
					<xsl:if test="$filterOnOff='on'">
					<xsl:value-of select="text()"/>
					</xsl:if>
					<xsl:apply-templates select="node()|@*"/>
				</xsl:copy>
			</xsl:if>
		</xsl:template>
		<xsl:template match="@*">
			<xsl:copy>
				<xsl:apply-templates select="node()|@*"/>
			</xsl:copy>
		</xsl:template>
	</xsl:stylesheet>