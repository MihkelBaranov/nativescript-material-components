import { Slider } from '../slider';

let installed = false;
const SliderPlugin = {
    install(Vue) {
        if (!installed) {
            installed = true;
            Vue.registerElement('MDSlider', () => Slider, {
                model: {
                    prop: 'value',
                    event: 'valueChange'
                }
            });
        }
    }
};

export default SliderPlugin;
