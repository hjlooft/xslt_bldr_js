<?xml version="1.0"?>
	<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
		<xsl:strip-space elements="*"/>
		<xsl:param name="filterOnOff" select="'on'"/>
		<xsl:template match="/">
			<xsl:copy>
				<xsl:apply-templates select="node()|@*"/>
			</xsl:copy>
		</xsl:template>
		<xsl:template match="node()">
			<xsl:if test="(name(.) and not(preceding-sibling::*[name()=name(current())])) or $filterOnOff='off'">
				<xsl:copy>
					<xsl:attribute name="id">
						<xsl:value-of select="generate-id()"/>
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