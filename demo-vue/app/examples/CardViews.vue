<template>
    <Page>
        <ActionBar :title="title">
            <NavigationButton text="Back" android.systemIcon="ic_menu_back" @tap="onNavigationButtonTap"></NavigationButton>
        </ActionBar>
        <StackLayout class="bg-green">
            <ScrollView>
                <StackLayout horizontalAlignment="center">
                    <MDButton text="button" rippleColor="red" color="black" width="200" variant="outline" />
                    <MDRipple backgroundColor="white" rippleColor="red" width="100" height="100" borderRadius="10"/>
                    <GridLayout columns="auto" rows="auto" backgroundColor='lightgray'>
                        <MDCardView margin="10" width="200" height="100" rippleColor="red" borderRadius="30">
                            <StackLayout>
                                <Label text="Hello world" class="title"></Label>
                            </StackLayout>
                        </MDCardView>
                    </GridLayout>
                    <MDCardView margin="10" width="200" height="100">
                        <StackLayout>
                            <Label text="Hello world2" class="title"></Label>
                        </StackLayout>
                    </MDCardView>
                </StackLayout>

            </ScrollView>
        </StackLayout>
    </Page>
</template>

<script lang="ts">
import * as frameModule from 'tns-core-modules/ui/frame';
import Vue from 'vue';
export const title = 'CardViews sample';

export default Vue.extend({
    name: 'CardView',
    data() {
        return {
            name: 'CardView',
            title: title
        };
    },
    methods: {
        onNavigationButtonTap() {
            frameModule.topmost().goBack();
        }
    }
});
</script>
