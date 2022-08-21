<?xml version="1.0"?>
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
    
</xsl:stylesheet>