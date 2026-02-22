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
     */
    constructor(data) {
        this.id = data.id;
        this.createdAt = data.createdAt
        this.value = data.value;
    }

    append() {
        const el = document.createElement('div');
        el.classList.add('clipboard-item');
        el.innerHTML = `
            <div class="clipboard-tile group relative bg-white dark:bg-primary/5 border border-primary/5 rounded-xl p-5 transition-all shadow-sm overflow-hidden">
                <div class="flex justify-between items-start mb-2 gap-4">
                    <div class="flex-1 min-w-0">
                        <pre class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-all overflow-hidden value"></pre>
                    </div>
                    <div class="tile-actions opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 no-drag shrink-0">
                        <button class="copy p-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span class="material-icons-outlined">content_copy</span>
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