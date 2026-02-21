class Device {
    id;
    createdAt;
    name;
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
                class="flex items-center gap-3 p-3 bg-white dark:bg-primary/10 rounded-lg border border-primary/5">
                <span class="material-icons-outlined text-slate-400">smartphone</span>
                <div class="flex flex-col">
                    <span class="text-sm font-medium phone-name"></span>
                    <span class="text-[10px] text-slate-500">Dernière connexion: <span class="createdAt"></span></span>
                </div>
            </div>
        `
        el.querySelector(".phone-name").innerText = this.name;
        el.querySelector(".createdAt").innerText = timeAgo(this.createdAt);
        return el
    }
}