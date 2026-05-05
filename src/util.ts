import { ref, type Ref, toValue, watchEffect, computed, watch } from 'vue';

export function useFocus(targetElements: Ref<Array<Element | null>>) {
    const focusState = ref<boolean[]>([]);
    useEventListener(targetElements, ['focusin', 'focusout'], () => {
        focusState.value = targetElements.value.map((el) =>
            el ? el.contains(document.activeElement) : false
        );
    });
    return focusState;
}

export function useEventListener(
    targetElements: Ref<Array<Element | null>>,
    eventNames: string[],
    listener: (event: Event) => void
) {
    // the elements from the last iteration of `watchEffect()`
    let oldElements = [] as Element[];

    watchEffect(() => {
        // add listeners to new elements
        for (const newElement of toValue(targetElements) ?? []) {
            if (!newElement || oldElements.includes(newElement)) {
                continue;
            }
            // update `oldElements`
            oldElements.push(newElement);
            // add listener
            for (const eventName of eventNames) {
                newElement?.addEventListener(eventName, listener);
            }
        }

        // remove listeners from elements that are not part of `targetElements` anymore
        for (const oldElement of oldElements) {
            if (toValue(targetElements)?.includes(oldElement)) {
                continue;
            }
            // update `oldElements`
            oldElements.splice(oldElements.indexOf(oldElement), 1);
            // remove listener
            for (const eventName of eventNames) {
                oldElement.removeEventListener(eventName, listener);
            }
        }
    });
}