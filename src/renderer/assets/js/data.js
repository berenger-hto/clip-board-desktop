class Data {
    id;
    createdAt;
    value;
    constructor(data) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.value = data.value;
    }

    append() {
        const el = document.createElement('div');
        el.classList.add('clipboard-item');
        el.innerHTML = `
            <div class="clipboard-tile group relative bg-white dark:bg-primary/5 border border-primary/5 rounded-xl p-5 transition-all shadow-sm overflow-hidden">
                <div class="flex justify-between items-start mb-2">
                    <pre class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap value"></pre>
                    <div class="tile-actions opacity-0 transition-opacity flex gap-2 no-drag">
                        <button class="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span class="material-icons-outlined">content_copy</span>
                        </button>
                        <button class="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg h-10 w-10 flex items-center justify-center">
                            <span class="material-icons-outlined">delete</span>
                        </button>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-[10px] font-medium text-slate-400 uppercase">${this.createdAt}</span>
                </div>
            </div>
        `;
        el.querySelector(".value").innerText = this.value
        return el;
    }
}