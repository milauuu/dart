import { ref, type Ref, toValue, watchEffect, computed, watch } from 'vue';
import { useEventListener } from "@vueuse/core";

export function useFocus(targetElements: Ref<Array<Element | null>>) {
    // reactive state (to be returned by this composable)
    const focusState = ref<boolean[]>([]);

    const targetElementsFiltered = computed(() => targetElements.value.filter(el => el !== null));

    useEventListener(targetElementsFiltered, ['focusin', 'focusout'], () => {
        focusState.value = targetElements.value.map((el) => {
            if (el === null) {
                return false;
            }
            return el.contains(document.activeElement);
        });
    });

    return focusState;
}
