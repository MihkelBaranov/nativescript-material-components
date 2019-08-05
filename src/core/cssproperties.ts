import { Color } from 'tns-core-modules/color';
import { CssProperty, InheritedCssProperty, makeParser, makeValidator } from 'tns-core-modules/ui/core/properties';
import { Style } from 'tns-core-modules/ui/styling/style';
import { Length } from 'tns-core-modules/ui/styling/style-properties';
import { VerticalTextAlignment } from 'nativescript-material-core';

function createGetter(key) {
    return function() {
        return this.style[key];
    };
}
function createSetter(key) {
    return function(newVal) {
        this.style[key] = newVal;
    };
}

export const cssProperty = (target: Object, key: string | symbol) => {
    Object.defineProperty(target, key, {
        get: createGetter(key),
        set: createSetter(key),
        enumerable: true,
        configurable: true
    });
};

export const rippleColorProperty = new CssProperty<Style, Color>({
    name: 'rippleColor',
    cssName: 'ripple-color',
    equalityComparer: Color.equals,
    valueConverter: v => new Color(v)
});
rippleColorProperty.register(Style);
export const elevationProperty = new CssProperty<Style, Length>({
    name: 'elevation',
    cssName: 'elevation',

    valueConverter: parseFloat
});
elevationProperty.register(Style);
export const dynamicElevationOffsetProperty = new CssProperty<Style, Length>({
    name: 'dynamicElevationOffset',
    cssName: 'dynamic-elevation-offset',

    valueConverter: parseFloat
});
dynamicElevationOffsetProperty.register(Style);

export const variantProperty = new CssProperty<Style, string>({
    name: 'variant',
    cssName: 'variant'
});
variantProperty.register(Style);

const textAlignmentConverter = makeParser<VerticalTextAlignment>(makeValidator<VerticalTextAlignment>('initial', 'top', 'middle', 'bottom'));
export const verticalTextAlignmentProperty = new InheritedCssProperty<Style, VerticalTextAlignment>({
    name: 'verticalTextAlignment',
    cssName: 'vertical-text-align',
    defaultValue: 'initial',
    valueConverter: textAlignmentConverter
});
verticalTextAlignmentProperty.register(Style);
