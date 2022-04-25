
// TODO: Check if EventTarget and HTMLElement are equivalent in a given situation

import { SimpleMathesSelectors } from "../common/types";

// export const closest = (element: EventTarget | HTMLElement | null, selector: string) => {
export const closest = (element: EventTarget | HTMLElement | null, selector: string): [HTMLElement?] => {
	const htmlElement = element as HTMLElement;
	// Added guard in case element is null
	if (element == null) return [];
	const body: HTMLElement = document.body;
	let matchesFn = '';

	if (body['matches'] && typeof body['matches'] === 'function') {
		matchesFn = 'matches';
	} else if (body['msMatchesSelector'] && typeof body['msMatchesSelector'] === 'function') {
		matchesFn = 'msMatchesSelector';
	}

	let parent;

	if (matchesFn) {
		if (htmlElement[matchesFn as SimpleMathesSelectors](selector)) {
			return [htmlElement];
		}


		parent = htmlElement.parentElement;

		while (parent) {
			if (parent[matchesFn as SimpleMathesSelectors](selector)) {
				return [parent];
			}

			parent = parent.parentElement;
		}
	}

	return [];
};
