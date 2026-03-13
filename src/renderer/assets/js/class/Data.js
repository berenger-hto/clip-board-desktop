class Data {
    /** @type {string} */
    id;
    /** @type {number} */
    createdAt;
    /** @type {string} */
    value;

    /**
     * @param {Object} data
     * @param {string} data.id
     * @param {number} data.createdAt
     * @param {string} data.value
     * @param {string} data.type
     * @param {boolean} data.isFavorite
     */
    constructor(data) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.value = data.value;
        this.type = data.type;
        this.isFavorite = data.isFavorite;
    }

    append() {
        const el = document.createElement('div');
        el.classList.add('clipboard-item');
        el.innerHTML = `
            <div class="clipboard-tile group relative bg-white dark:bg-primary/5 border border-primary/5 rounded-xl p-5 transition-all shadow-sm overflow-hidden">
                <div class="flex items-center gap-2 mb-2">
                    <span class="content-type text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-500 uppercase font-bold tracking-wider"></span>
                </div>
                <div class="flex justify-between items-start mb-2 gap-4">
                    <div class="flex-1 min-w-0">
                        <pre class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all overflow-hidden value"></pre>
                    </div>
                    <div class="tile-actions opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 no-drag shrink-0 absolute top-0 right-0 p-5 bg-white dark:bg-primary/5 rounded-xl">
                        <button class="copy p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span class="material-icons-outlined">content_copy</span>
                        </button>
                        <button class="copy p-2 bg-[#FFD700]/10 hover:bg-[#FFD700] text-[#FFD700] hover:text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
                        </button>
                        <button class="delete p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span class="material-icons-outlined">delete</span>
                        </button>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] font-medium text-slate-400 uppercase createdAt"></span>
                </div>
            </div>
        `;
        el.querySelector(".value").innerText = this.value;
        el.querySelector(".createdAt").innerText = timeAgo(this.createdAt);
        el.querySelector(".content-type").innerText = this.type;
        if (this.isFavorite) {
            el.querySelector(".content-type").parentElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>`
        }
        el.querySelector(".delete").addEventListener("click", async (e) => {
            e.stopPropagation()
            await window.electronAPI.deleteData(this.id)
            el.remove()
        })

        el.querySelector(".copy").addEventListener("click", async (e) => {
            e.stopPropagation()
            await window.electronAPI.writeToClipboard(this.value)
            Toast.show("Copié dans le presse-papier", "success")
        })

        return el;
    }
}