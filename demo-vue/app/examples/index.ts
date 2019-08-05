import ActivityIndicators, { title as activityIndicatorsTitle } from './ActivityIndicators.vue';
import Buttons, { title as buttonsTitle } from './Buttons.vue';
import CardViews, { title as cardViewsTitle } from './CardViews.vue';
import Dialogs, { title as dialogsTitle } from './Dialogs.vue';
import ProgressBars, { title as progressBarsTitle } from './ProgressBars.vue';
import Ripples, { title as ripplesTitle } from './Ripples.vue';
import Sliders, { title as slidersTitle } from './Sliders.vue';
import SnackBar, { title as snackTitle } from './SnackBar.vue';
import TextFields, { title as textFieldsTitle } from './TextFields.vue';
import ButtonIssue, { title as buttonIssueTitle } from './ButtonIssue.vue';

export const getExamples = () => {
    return [
        {
            title: buttonsTitle,
            component: Buttons
        },
        {
            title: buttonIssueTitle,
            component: ButtonIssue
        },
        {
            title: cardViewsTitle,
            component: CardViews
        },
        {
            title: activityIndicatorsTitle,
            component: ActivityIndicators
        },
        {
            title: textFieldsTitle,
            component: TextFields
        },
        {
            title: progressBarsTitle,
            component: ProgressBars
        },
        {
            title: slidersTitle,
            component: Sliders
        },
        {
            title: ripplesTitle,
            component: Ripples
        },
        {
            title: dialogsTitle,
            component: Dialogs
        },
        {
            title: snackTitle,
            component: SnackBar
        },
        {
            title: snackTitle,
            component: SnackBar
        }
    ];
};
