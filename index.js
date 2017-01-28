(function () {
	const CHECK_INTERVAL = 5000;

	// @todo abstract
	function scrapeForUnreadObjects(itemSelector, propsToSelectors) {
		const reminderNodes = Array
			.from(document.querySelectorAll(itemSelector));


		return reminderNodes
			.map(x => Object.keys(propsToSelectors)
				.reduce((data, prop) => {
					data[prop] = x.querySelector(propsToSelectors[prop]).textContent;
                    return data;
				}, {}))
			.map(value => ({
				hash : JSON.stringify(value),
				value
			}));
	}


	function getUnreadEmailsCount(){
		return parseInt(document
			.querySelector('[title="Inbox"]')
			.parentElement
			.querySelector("[id*='ucount']")
			.textContent
			.replace(/[^0-9]/g, ''), 10);
	}


	// @todo name should be key so there cannot be dupes
	const notifiers = [
		{
			name             : 'Unread Emails',
			icon             : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAD9GAAA/RgHkW2BAAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAWhQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAHAAAGBgAGBgAGBQAFBQAFBQAFBQAFBQAFBQAFBQAFBAAEBAAEBAAEBAAEBAAEBAAEBAAEAwADAwADAwADAwADAwADAwADAwADAwADAwADAgAFAgAFAgAFAgAFAgAFAgAFAgAFAgAEAgAEAgAEBAIEBAIEBAIEBAIEBAIEBAIEBAIEBAIEAwIDAwIDAwIDAwIDAwIDAwIFAwIFAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAgEEAgEEAgEEAgEEBAEEBAEEBAEEAwEFAwEFAwEFAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEESwxGowAAAHd0Uk5TAAECAwUHCAoLDA0OERITFxgZGhsdISMqLC0vMDEyNDY3OTw9QUZHSElKS0xNUFNdXmhpamtsbW5zdX2EiYyNjo+QkZKTlJuepamur7CxsrO0tru9w8TGyMrLzM3Oz9LX2Nrg4eLj5OXo6+zv8fLz9PX3+fv8/f5WTl8iAAACjElEQVRYw+2X6VcScRSGHwbUcSdQDMjKJQPMLdRcK82NSsw9E1woxSVRcfT++30ggmEZGPIj76e5c859zpn3vb9loKqqHkd9K9GjihRd8QO81KRiad0Ab64r7U/0p77h2Wll/adegBHAGa2kP+oERpAZC9R/M9+/Vg+WGUEkVAvWT2b75xWoDYkgItstwLt7U/aPAy3bkgLIsQvoT5iwPwC4jiUNkPMuwHtqyv6uc8kA5HbQRBgRJzB4K9kAeZgA6tfKsl8FJh5EDxBZtIJ1vjz7rYv/ygxAwiowXmJlaGOAGpZCANmzA4FESfvte1IYILGOEmGceICOmBQDyGUv4IwUtd8B9F5KcYAkh3I+MVthFRhKihFAZApQCoYxpwBTuW/zALJsA8a0gvbblqU0QDYaC4SR8AONG1IOQA7aAM9Jnv1tB1IeQOJewJEVxr4D8MalXIDsWHRhhFXAsiNlA9YbAFDmsuyHhvVyAQtW8AUBRjURbRQg6APrQlkAbQwIajJrAfyJhB+wzIoWLJhuPuDKB8pHEZFQDeDxADUhEZEPCviuSgFiblBXU89bzamDp3krVX+tA3fMGLDbCo79dHXYDtB+mK5/PIHWXSNAqFY/QWfP4flZpv7lTh0GxQDTFvDrZvg6ENAdvVevwTJdBJAc/hucLpPc+i0wnCwEuOjJjI6R3ivQc5EPOHIV30n0+lIHrqNcwGaTfvkYac8OTZt6wJItdwEb6acbbEtZgPvJkvu5Xr/7gMn7NOBmoPCYG+huBBi4SQHincW2USPNKtAZF0EiTlDXxLQ+14EzIqyqRkeJkb7bQV1FMXOzyAnjKSgm7zY5YbwC6P6Pq+7dCwB/5ZdtX/VXpapH0h+LEXyi90RG4wAAAABJRU5ErkJggg==',
			before           : () => notifyMe(`You have ${getUnreadEmailsCount()} new messages!`),
			itemSelector     : 'div._lvv2_w:not(._lvv2_y)',
			propsToSelectors : {
				from    : '.lvHighlightFromClass',
				subject : '.lvHighlightSubjectClass',
				note    : '[role="note"]'
			},
			formatter        : (data) => [data.subject, `From: ${data.from}\n${data.note}`]
		},
		{
			name             : 'Upcoming Calendar Events',
			icon             : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAH5QTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA32SJpAAAACl0Uk5TAAMECQsRFBceIC4/R0hPUlRXWGFohYiMjZKcqKy2uMzQ2d3e3+Dk8P6BWj66AAABE0lEQVRYw+2W3RLBMBCFD4pUVSnqvxQtff8XRDd2zFiGxAxjcq5OcrbfRXcnCcBSRUnatiCqtdUFhRLzQXlVVwZ0uWAg5jHnoQwIuSD+LKC/SittOF+notZcsKGNVb8CZKWxsgqQl7PRRXPep/WdZlww1+tcA0KzfxB+GtDjPJABARf0REBjsiCNazKgNtYFk4YIeFsOcAswlgP8I2CXvKjdA0D66gimDwFeTFLokImAiFwHSofeE4DPR1ZC5gAcyCV85PkO8OOAuk/y0CRzfooock14Oqw/AVhPYlu/BAIMySyBJbkhAh22XRt/HGDdRutBsh5l18a/AFhfbZaTaH29uzfSFwF7c8C+AkyPpt8fp8AJlJenGMZL6tIAAAAASUVORK5CYII=',
			itemSelector     : '.o365cs-notifications-reminders-listPanel > div',
			propsToSelectors : {
				title        : '.o365cs-notifications-reminders-title',
				timeToStart  : '.o365cs-notifications-reminders-timeToStartUnit',
				timeDuration : '.o365cs-notifications-reminders-timeDuration'
			},
			formatter        : (data) => [data.title, `Event at  ${data.timeDuration}`]
		}
	];

	function runNotifiers(oldHashes = {}) {
		return notifiers.reduce((acc, notifier) => {
			if (typeof notifier.formatter !== 'function') {
				throw new TypeError('scraper requires a formatter fn!');
			}

			oldHashes[notifier.name] = oldHashes[notifier.name] || new Set();

			const unreadObjects = scrapeForUnreadObjects(notifier.itemSelector, notifier.propsToSelectors);
			const newObjects = unreadObjects
				.filter(x => !oldHashes[notifier.name].has(x.hash));

			acc[notifier.name] = new Set(unreadObjects.map(x => x.hash));

			if(newObjects.length) {
				if(typeof notifier.before === 'function') {
					notifier.before();
				}

				newObjects
					.map(x => notifier.formatter(x.value))
					.forEach(([title, body]) => notifyMe(
						title,
						{
							body,
							icon : notifier.icon
						}
					));
		}
			return acc;
		}, {});
	}

	function alertNewUnread(oldStateHashes){

		if (window.blockNotifications) return false;


		const newHashes = runNotifiers(oldStateHashes);


		setTimeout(
			alertNewUnread,
			CHECK_INTERVAL,
			newHashes
		);

	}

	alertNewUnread();

	function createNotification(title, _options) {
		const options = _options || {};
		const n = new Notification(title, options);
		n.onclick = function() {
			window.focus(); this.cancel();
		};
		return n;
	}

	function notifyMe(title, options) {
		if (!window.Notification) {
			return false;
		}

		Notification.permission === "granted" ?
			createNotification(title, options) :
			Notification
				.requestPermission()
				.then(() => notifyMe(title, options));
	}

})();
