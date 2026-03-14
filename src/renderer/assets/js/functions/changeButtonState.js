/**
 * Change filter buttons state
 * @param {HTMLElement} targetElement 
 */

function changeButtonState(targetElement) {
    const elements = document.querySelectorAll("#filter-buttons button")
    const buttonStyles = {
        active: "flex items-center gap-2 px-6 py-2.5 bg-primary text-white hover:opacity-75 text-sm font-semibold rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-30",
        disabled: "flex items-center gap-2 px-6 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white text-sm font-semibold rounded-full transition-all disabled:cursor-not-allowed disabled:opacity-30"
    }

    elements.forEach(element => {
        element.className = ""
    })

    elements.forEach(btn => {
        btn.className = buttonStyles.disabled
    })

    targetElement.className = buttonStyles.active
}