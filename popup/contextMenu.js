const menu = document.getElementById("context-menu");
let selectedTabId;

/**
 * Open context menu when a tab is right clicked
 */
document.addEventListener("contextmenu", (e) => {
	e.preventDefault();

	const highlighted = document.querySelectorAll('li.highlight');
	highlighted.forEach(li => {
		li.classList.remove('highlight');
	});

	if (e.target.classList.contains('switch-tabs')) {
		var tabId = +e.target.getAttribute('href');
		selectedTabId = tabId;

		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const posX = Math.min(windowWidth, e.clientX + 200) - 200;
		const posY = Math.min(windowHeight, e.clientY + 98) - 98;

		menu.style.left = `${posX}px`;
		menu.style.top = `${posY}px`;
		menu.classList.remove('hidden');

		const li = e.target.closest('li');
		if (li) {
			li.classList.add('highlight');
		}
	}
	else {
		menu.classList.add('hidden');
	}
});

/**
 * Duplicate selected tab next to active tab in focused window
 */
async function duplicateTabNextToFocused(tabId) {
	const activeTabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
	if (activeTabs.length === 0) return;
	const activeTab = activeTabs[0];

	// Duplicate tab (it initially spawns in its original window) and then move it
	const duplicatedTab = await browser.tabs.duplicate(tabId);
	await browser.tabs.move(duplicatedTab.id, {
		windowId: activeTab.windowId,
		index: activeTab.index + 1
	});
}

/**
 * Move selected tab next to active tab in focused window
 */
async function moveTabNextToFocused(tabId) {
	const activeTabs = await browser.tabs.query({ active: true, lastFocusedWindow: true });
	if (activeTabs.length === 0) return;
	const activeTab = activeTabs[0];

	// Prevent moving a tab to its own position
	if (tabId === activeTab.id) return;

	await browser.tabs.move(tabId, {
		windowId: activeTab.windowId,
		index: activeTab.index + 1
	});
}

async function unloadTab(tabId) {
	let tab = await browser.tabs.get(tabId);
	if (tab.discarded) return;

	// Cannot unload an active tab, so shift focus to another tab
	if (tab.active) {
		// Find all other tabs in the same window that are loaded
		const otherTabs = await browser.tabs.query({ windowId: tab.windowId, active: false, discarded: false });

		if (otherTabs.length > 0) {
			// Find a neighbor tab (closest index match) to hand focus over to
			const neighborTab = otherTabs.reduce((prev, curr) => 
				Math.abs(curr.index - tab.index) < Math.abs(prev.index - tab.index) ? curr : prev
			);
			await browser.tabs.update(neighborTab.id, { active: true });
		}
		else {
			// If it is the only tab loaded in the window, it cannot be discarded
			return;
		}
	}

	await browser.tabs.discard(tab.id);
}



document.addEventListener("click", async (e) => {
	e.preventDefault();

	// Duplicate next to active tab
	if (e.target.id === "menu-opt-1") {
		await duplicateTabNextToFocused(selectedTabId);
		reloadTabList();
	}
	
	// Move next to active tab
	else if (e.target.id === "menu-opt-2") {
		await moveTabNextToFocused(selectedTabId);
		reloadTabList();
	}

	// Unload tab
	else if (e.target.id === "menu-opt-3") {
		await unloadTab(selectedTabId);
		reloadTabList();
	}

	menu.classList.add('hidden');

	const highlighted = document.querySelectorAll('li.highlight');
	highlighted.forEach(li => {
		li.classList.remove('highlight');
	});
});