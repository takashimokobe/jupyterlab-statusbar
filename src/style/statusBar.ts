import { style } from 'typestyle/lib';
import vars from './variables';
import { rightToLeft, leftToRight, centeredFlex } from './layout';

const itemPadding = {
    paddingLeft: vars.itemPadding,
    paddingRight: vars.itemPadding
};

const interactiveHover = {
    $nest: {
        '&:hover': {
            backgroundColor: vars.hoverColor
        }
    }
};

const clicked = {
    backgroundColor: `${vars.clickColor}`
};

export const statusBar = style(
    {
        background: vars.backgroundColor,
        minHeight: vars.height,
        justifyContent: 'space-between',
        paddingLeft: vars.statusBarPadding,
        paddingRight: vars.statusBarPadding
    },
    centeredFlex
);

export const side = style(centeredFlex);

export const leftSide = style(leftToRight);

export const rightSide = style(rightToLeft);

export const item = style(
    {
        maxHeight: vars.height,
        marginLeft: vars.itemMargin,
        marginRight: vars.itemMargin
    },
    itemPadding
);

export const clickedItem = style(clicked);
export const interactiveItem = style(interactiveHover);
