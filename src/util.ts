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

export function formatDate(dateValue: number) {
    const date = new Date(dateValue);
    const month = (new Intl.DateTimeFormat(undefined, { month: 'long' })).format(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${date.getDate()}. ${month} ${date.getFullYear()} - ${hours}:${minutes} h`;
}

export function range(from: number, to: number) {
    let rangeArray = [];
    for (let start = from; start < to+1; start++) {
        rangeArray.push(start);
    }
    return rangeArray;
}

export function mathMod(number: number, basis: number): number {
    return ((number % basis) + basis) % basis;
}