let startX, startWidth;
const handle = document.getElementById('resize-handle');

if (handle) {
	handle.addEventListener('mousedown', initResize);

	function initResize(e) {
		e.preventDefault();
		startX = e.screenX;
		startWidth = document.body.clientWidth;

		window.addEventListener('mousemove', startResize);
		window.addEventListener('mouseup', stopResize);
	}

	function startResize(e) {
		const newWidth = startWidth + (startX - e.screenX);
		document.body.style.width = `${newWidth}px`;
	}

	function stopResize() {
		window.removeEventListener('mousemove', startResize);
		window.removeEventListener('mouseup', stopResize);
	}
}
