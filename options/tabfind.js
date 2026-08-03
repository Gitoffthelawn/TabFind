function restrictNumberInputs() {
	const numberInputs = document.querySelectorAll('input[type="number"]');

	numberInputs.forEach(input => {
    	input.addEventListener('input', (e) => {
    		const val = parseInt(e.target.value);
    		const min = parseInt(input.min);
    		const max = parseInt(input.max);
        
        	if (val > max) {
        		e.target.value = max;
    		}
			console.log(val, typeof val)
			if (val < min || isNaN(val)) {
        		e.target.value = min;
			}
   		});

    	input.addEventListener('keydown', (e) => {
			const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    		if (allowedKeys.includes(e.key)) return;

			const isNum = /[0-9]/.test(e.key);
    		if (isNum) return;

			e.preventDefault();
    	});
  	});
}

function retrieveOptions() {
	// get textSize
	browser.storage.local.get("textSize").then((result) => {
		let options = document.getElementsByName("textSize");
		let selectedOption = result.textSize ?? "small";
		for (let opt of options) {
			if (opt.value === selectedOption) {
				opt.checked = true;
			}
		}
	});

	// get badgeColor
	browser.storage.local.get("badgeColor").then((result) => {
		let opt = document.getElementById("badgeColor");
		opt.value = result.badgeColor ?? '#8a2be2';
	});

	// get badgeCount
	browser.storage.local.get("badgeCount").then((result) => {
		let options = document.getElementsByName("badgeCount");
		let selectedOption = result.badgeCount ?? "current";
		for (let opt of options) {
			if (opt.value === selectedOption) {
				opt.checked = true;
			}
		}
	});
	
	// get findDups
	browser.storage.local.get("findDups").then((result) => {
		let options = document.getElementsByName("findDups");
		let selectedOption = result.findDups ?? 'both';
		for (let opt of options) {
			if (opt.value === selectedOption) {
				opt.checked = true;
			}
		}
	});

	// get searchBy
	browser.storage.local.get("searchBy").then((result) => {
		let options = document.getElementsByName("searchBy");
		let selectedOption = result.searchBy ?? 'both';
		for (let opt of options) {
			if (opt.value === selectedOption) {
				opt.checked = true;
			}
		}
	});

	// get popupWidth
	browser.storage.local.get("popupWidth").then((result) => {
		let options = document.getElementsByName("popupWidth");
		let selectedOption = result.popupWidth ?? "normal";
		for (let opt of options) {
			if (opt.value === selectedOption) {
				opt.checked = true;
			}
		}
	});

	// get allWindows
	browser.storage.local.get("allWindows").then((result) => {
		let options = document.getElementsByName("allWindows");
		let selectedOption = result.allWindows ?? "false";
		for (let opt of options) {
			if (opt.value === selectedOption) {
				opt.checked = true;
			}
		}
	});

	// get closeBatchSize
	browser.storage.local.get("closeBatchSize").then((result) => {
		let opt = document.getElementById("closeBatchSize");
		if (result.closeBatchSize && result.closeBatchSize !== '') {
			opt.value = result.closeBatchSize;
		}
		else {
			opt.value = '20';
		}

	});

	// get closeDelay
	browser.storage.local.get("closeDelay").then((result) => {
		let opt = document.getElementById("closeDelay");
		if (result.closeDelay && result.closeDelay !== '') {
			opt.value = result.closeDelay;
		}
		else {
			opt.value = '100';
		}
	});
}

function saveRadioButtons(optionName, defaultValue) {
	let options = document.getElementsByName(optionName);
	let selectedOption = defaultValue;
	for (let opt of options) {
		if (opt.checked) {
			selectedOption = opt.value;
		}
	}
	browser.storage.local.set({ [optionName]: selectedOption });
}

function saveTextSize(e) {
	e.preventDefault();
	saveRadioButtons("textSize", "small");
}

function saveBadgeColor(e) {
	e.preventDefault();

	let selectedOption = document.getElementById("badgeColor").value;
	browser.storage.local.set({ badgeColor: selectedOption });
}

function saveBadgeCount(e) {
	e.preventDefault();
	saveRadioButtons("badgeCount", "current");
}

function saveFindDups(e) {
	e.preventDefault();
	saveRadioButtons("findDups", "both");
}

function saveSearchBy(e) {
	e.preventDefault();
	saveRadioButtons("searchBy", "both");
}

function savePopupWidth(e) {
	e.preventDefault();
	saveRadioButtons("popupWidth", "normal");
}

function saveAllWindows(e) {
	e.preventDefault();
	saveRadioButtons("allWindows", "false");
}

function saveCloseBatchSize(e) {
	e.preventDefault();

	let selectedOption = document.getElementById("closeBatchSize").value;
	browser.storage.local.set({ closeBatchSize: selectedOption });
}

function saveCloseDelay(e) {
	e.preventDefault();

	let selectedOption = document.getElementById("closeDelay").value;
	browser.storage.local.set({ closeDelay: selectedOption });
}

function init() {
	let options;
	
	document.addEventListener("DOMContentLoaded", restrictNumberInputs);
	document.addEventListener("DOMContentLoaded", retrieveOptions);
	
	// event listeners for textSize
	options = document.getElementsByName("textSize");
	for (let opt of options) {
		opt.addEventListener("change", saveTextSize);
	}

	// event listeners for badgeColor
	document.getElementById("badgeColor").addEventListener("input", saveBadgeColor);

	// event listeners for badgeCount
	options = document.getElementsByName("badgeCount");
	for (let opt of options) {
		opt.addEventListener("change", saveBadgeCount);
	}

	// event listeners for findDups
	options = document.getElementsByName("findDups");
	for (let opt of options) {
		opt.addEventListener("change", saveFindDups);
	}

	// event listeners for searchBy
	options = document.getElementsByName("searchBy");
	for (let opt of options) {
		opt.addEventListener("change", saveSearchBy);
	}

	// event listeners for popupWidth
	options = document.getElementsByName("popupWidth");
	for (let opt of options) {
		opt.addEventListener("change", savePopupWidth);
	}

	// event listeners for allWindows
	options = document.getElementsByName("allWindows");
	for (let opt of options) {
		opt.addEventListener("change", saveAllWindows);
	}
	
	// event listeners for closeBatchSize
	document.getElementById("closeBatchSize").addEventListener("input", saveCloseBatchSize);

	// event listeners for closeDelay
	document.getElementById("closeDelay").addEventListener("input", saveCloseDelay);
}

init();