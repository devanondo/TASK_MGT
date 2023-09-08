import React from 'react'

interface IFlex {
    style?: React.CSSProperties
    width?: number | string
    gap?: number | string
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse'
    align?: string
    justify?: string
    wrap?: string
    padding?: string
    margin?: string
    children: React.ReactNode
}

const Flex: React.FC<IFlex> = ({
    style,
    width,
    gap,
    justify,
    align,
    children,
    direction,
    padding,
    margin,
}) => {
    const styles: React.CSSProperties = {
        display: 'flex',
        width: width || '100%',
        gap: gap || 0,
        justifyContent: justify || 'flex-start',
        alignItems: align || 'flex-start',
        padding: padding || '10px',
        margin: margin || '0px',
        flexDirection: direction || 'row',
        ...style,
    }

    return <div style={styles}>{children}</div>
}

export default Flex
