/**
 * @param {number} milliseconds
 * @returns {string} HH:MM:SS
 */
export function formatTime(milliseconds) {
	console.log({ milliseconds });
	const seconds = Math.floor((milliseconds / 1000) % 60);
	const minutes = Math.floor((milliseconds / 1000 / 60) % 60);
	const hours = Math.floor((milliseconds / 1000 / 60 / 60) % 24);

	return [
		hours.toString().padStart(2, '0'),
		minutes.toString().padStart(2, '0'),
		seconds.toString().padStart(2, '0')
	].join(':');
}
