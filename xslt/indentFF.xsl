<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>
    <xsl:param name="noFilter"/>
    <xsl:param name="indent-increment" select="'   '" />
    <xsl:template match="*">
        <xsl:param name="indent" select="'&#xA;'"/>
        <xsl:value-of select="$indent"/>
        <xsl:copy>
            <xsl:choose>
                <xsl:when test="$noFilter='false'">
                    <xsl:copy-of select="@*[name()!='id' and name()!='fakeDocFn' and name()!='gl_param']" />
                </xsl:when>
                <xsl:when test="$noFilter='true'">
                    <xsl:copy-of select="@*"/>
                </xsl:when>
            </xsl:choose>
            <xsl:apply-templates>
                <xsl:with-param name="indent" select="concat($indent, $indent-increment)"/>
            </xsl:apply-templates>
            <xsl:if test="*">
                <xsl:value-of select="$indent"/>
            </xsl:if>
        </xsl:copy>
    </xsl:template>
    <xsl:template match="comment()|processing-instruction()">
        <xsl:copy />
    </xsl:template><!-- WARNING: this is dangerous. Handle with care -->
    <xsl:template match="text()[normalize-space(.)='']"/>
</xsl:stylesheet>