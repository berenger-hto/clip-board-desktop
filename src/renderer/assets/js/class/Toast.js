class Toast {
    /**
     * @param {string} message
     * @param {'success' | 'error' | 'info'} type
     * @param {number} duration
     */
    constructor(message, type = 'info', duration = 3000) {
        this.message = message;
        this.type = type;
        this.duration = duration;
        this.element = this.create();
    }

    create() {
        const el = document.createElement("div");

        let baseClasses = "fixed bottom-4 right-4 max-w-sm rounded-[14px] px-5 py-3.5 bg-popover text-popover-foreground shadow-xl transition-all duration-300 transform translate-y-full opacity-0 z-50 flex items-center gap-3 border border-border";

        const icons = {
            success: "check_circle",
            error: "error",
            info: "info"
        };

        el.className = baseClasses;

        el.innerHTML = `
            <span class="material-icons-outlined text-[18px] opacity-80">${icons[this.type] || icons.info}</span>
            <p class="text-sm font-medium m-0 flex-1">${this.message}</p>
        `;

        return el;
    }

    show() {
        document.body.appendChild(this.element);

        requestAnimationFrame(() => {
            this.element.classList.remove("translate-y-full", "opacity-0");
        });

        setTimeout(() => {
            this.hide();
        }, this.duration);
    }

    hide() {
        this.element.classList.add("translate-y-full", "opacity-0");

        setTimeout(() => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        }, 300);
    }

    static show(message, type = 'info', duration = 3000) {
        const toast = new Toast(message, type, duration);
        toast.show();
        return toast;
    }
}
