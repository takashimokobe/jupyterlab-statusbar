import { style } from 'typestyle/lib';

export const hoverItem = style({
    background: '#F2F2F2',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
});

export const lineFormSearch = style({
    padding: '4px 12px',
    backgroundColor: 'var(--jp-layout-color2)',
    boxShadow: 'var(--jp-toolbar-box-shadow)',
    zIndex: 2,
    fontSize: 'var(--jp-ui-font-size1)'
});

export const lineFormCaption = style({
    fontSize: 'var(--jp-ui-font-size0)',
    lineHeight: 'var(--jp-ui-font-size1)',
    marginTop: '4px'
});

export const lineFormButton = style({
    color: 'white',
    border: 'none',
    borderRadius: '0px',
    backgroundColor: 'var(--jp-brand-color1)',
    position: 'absolute',
    top: '4px',
    right: '8px',
    height: '24px',
    width: '12px',
    padding: '0px 12px',
    backgroundSize: '16px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    outline: 'none'
});

export const lineFormWrapper = style({
    overflow: 'hidden',
    padding: '0px 8px',
    border: '1px solid var(--jp-border-color0)',
    backgroundColor: 'var(--jp-input-active-background)',
    height: '22px'
});

export const lineFormWrapperFocusWithin = style({
    border: 'var(--jp-border-width) solid var(--md-blue-500)',
    boxShadow: 'inset 0 0 4px var(--md-blue-300)'
});

export const lineFormInput = style({
    background: 'transparent',
    width: '200px',
    height: '100%',
    border: 'none',
    outline: 'none',
    color: 'var(--jp-ui-font-color0)',
    lineHeight: '28px'
});
