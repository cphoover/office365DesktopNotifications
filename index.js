(function() {
const CHECK_INTERVAL = 1000;

function getUnread(){
    const unreadMessagesNodes = Array.from(document.querySelectorAll('div._lvv2_w:not(._lvv2_y)'));
    return unreadMessagesNodes.map(x => {
        const value = {
            from: x.querySelector('.lvHighlightFromClass').textContent,
            subject: x.querySelector('.lvHighlightSubjectClass').textContent,
            note: x.querySelector('[role="note"]').textContent
        };
        return {
            hash : JSON.stringify(value),
            value
        };
    });
}

function getUnreadCount(){
    return parseInt(document
        .querySelector('[title="Inbox"]')
        .parentElement
        .querySelector("[id*='ucount']")
        .textContent
        .replace(/[^0-9]/g, ''), 10);
}

function alertNewUnreadMessages(lastHashes = new Set()){
    const unreadMessages = getUnread();
    const newUnreadMessages = unreadMessages
        .filter(x => !lastHashes.has(x.hash));
   
    if (newUnreadMessages.length)  {
        const unreadCount = getUnreadCount();
        notifyMe(`You have ${unreadCount} new messages!`);
        newUnreadMessages.forEach(x => notifyMe(x.value.subject, {
            body: `From : ${x.value.from}\n
${x.value.note}`
        }))
    }

    setTimeout(
        alertNewUnreadMessages,
        CHECK_INTERVAL,
        new Set(unreadMessages.map(x => x.hash))
    );
}

alertNewUnreadMessages();
  
function createNotification(title, _options) {
    const options = _options || {};
    options.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAD9GAAA/RgHkW2BAAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAWhQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAHAAAGBgAGBgAGBQAFBQAFBQAFBQAFBQAFBQAFBQAFBAAEBAAEBAAEBAAEBAAEBAAEBAAEAwADAwADAwADAwADAwADAwADAwADAwADAwADAgAFAgAFAgAFAgAFAgAFAgAFAgAFAgAEAgAEAgAEBAIEBAIEBAIEBAIEBAIEBAIEBAIEBAIEAwIDAwIDAwIDAwIDAwIDAwIFAwIFAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAgEEAgEEAgEEAgEEBAEEBAEEBAEEAwEFAwEFAwEFAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEEAwEESwxGowAAAHd0Uk5TAAECAwUHCAoLDA0OERITFxgZGhsdISMqLC0vMDEyNDY3OTw9QUZHSElKS0xNUFNdXmhpamtsbW5zdX2EiYyNjo+QkZKTlJuepamur7CxsrO0tru9w8TGyMrLzM3Oz9LX2Nrg4eLj5OXo6+zv8fLz9PX3+fv8/f5WTl8iAAACjElEQVRYw+2X6VcScRSGHwbUcSdQDMjKJQPMLdRcK82NSsw9E1woxSVRcfT++30ggmEZGPIj76e5c859zpn3vb9loKqqHkd9K9GjihRd8QO81KRiad0Ab64r7U/0p77h2Wll/adegBHAGa2kP+oERpAZC9R/M9+/Vg+WGUEkVAvWT2b75xWoDYkgItstwLt7U/aPAy3bkgLIsQvoT5iwPwC4jiUNkPMuwHtqyv6uc8kA5HbQRBgRJzB4K9kAeZgA6tfKsl8FJh5EDxBZtIJ1vjz7rYv/ygxAwiowXmJlaGOAGpZCANmzA4FESfvte1IYILGOEmGceICOmBQDyGUv4IwUtd8B9F5KcYAkh3I+MVthFRhKihFAZApQCoYxpwBTuW/zALJsA8a0gvbblqU0QDYaC4SR8AONG1IOQA7aAM9Jnv1tB1IeQOJewJEVxr4D8MalXIDsWHRhhFXAsiNlA9YbAFDmsuyHhvVyAQtW8AUBRjURbRQg6APrQlkAbQwIajJrAfyJhB+wzIoWLJhuPuDKB8pHEZFQDeDxADUhEZEPCviuSgFiblBXU89bzamDp3krVX+tA3fMGLDbCo79dHXYDtB+mK5/PIHWXSNAqFY/QWfP4flZpv7lTh0GxQDTFvDrZvg6ENAdvVevwTJdBJAc/hucLpPc+i0wnCwEuOjJjI6R3ivQc5EPOHIV30n0+lIHrqNcwGaTfvkYac8OTZt6wJItdwEb6acbbEtZgPvJkvu5Xr/7gMn7NOBmoPCYG+huBBi4SQHincW2USPNKtAZF0EiTlDXxLQ+14EzIqyqRkeJkb7bQV1FMXOzyAnjKSgm7zY5YbwC6P6Pq+7dCwB/5ZdtX/VXpapH0h+LEXyi90RG4wAAAABJRU5ErkJggg==";
    const n = new Notification(title, options);
    n.onclick = function(x) {
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
