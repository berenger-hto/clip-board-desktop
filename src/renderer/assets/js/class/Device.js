class Device {
    /** @type {string} */
    id;
    /** @type {number} */
    createdAt;
    /** @type {string} */
    name;

    /**
     * @param {Object} device
     * @param {string} device.id
     * @param {number} device.updatedAt
     * @param {string} device.deviceName
     */
    constructor(device) {
        this.id = device.id;
        this.createdAt = device.updatedAt;
        this.name = device.deviceName;
    }

    append() {
        const el = document.createElement("div")
        el.classList.add("device-item")
        el.innerHTML = `
            <div
                class="flex items-center gap-3 p-3 bg-card text-card-foreground rounded-lg border border-border">
                <span class="material-icons-outlined text-muted-foreground">smartphone</span>
                <div class="flex flex-col">
                    <span class="text-sm font-medium phone-name"></span>
                    <span class="text-[10px] text-muted-foreground">Dernière connexion: <span class="createdAt"></span></span>
                </div>
            </div>
        `
        el.querySelector(".phone-name").innerText = this.name;
        el.querySelector(".createdAt").innerText = timeAgo(this.createdAt);
        return el
    }
}