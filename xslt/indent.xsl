<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
    <xsl:strip-space elements="*"/>
    <xsl:param name="noFilter"/>
    <xsl:template match="node()|@*">
        <xsl:copy>
            <xsl:apply-templates select="node()|@*"/>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="@id|@fakeDocFn|@gl_param">
        <xsl:if test="$noFilter='true'">
            <xsl:copy-of select="."/>
        </xsl:if>
    </xsl:template>
</xsl:stylesheet>