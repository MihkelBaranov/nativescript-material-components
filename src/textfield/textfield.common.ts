import { TextField as NTextField } from 'tns-core-modules/ui/text-field/text-field';
import { Color } from 'tns-core-modules/color';
import { CSSType } from 'tns-core-modules/ui/core/view/view';
import { cssProperty } from 'nativescript-material-core/cssproperties';

@CSSType('MDTextField')
export abstract class TextFieldBase extends NTextField {
    constructor() {
        super();
    }
    abstract requestFocus();
    abstract clearFocus();

    @cssProperty helper: string;
    @cssProperty maxLength: number;
    @cssProperty errorColor: Color;
    @cssProperty floating: boolean;
    @cssProperty placeholderColor: Color;
    @cssProperty variant: string = 'filled';
    @cssProperty error: string;
    @cssProperty strokeColor: Color;
    @cssProperty floatingColor: Color;
}
