window.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('app-loader');
    const hideLoader = () => {
        if (!loader) return;
        loader.classList.add('opacity-0');
        setTimeout(() => loader.classList.add('hidden'), 500);
    };

    const checkNetwork = async () => {
        const interfaces = await window.electronAPI.networkInterfaces();
        if (!interfaces) {
            hideLoader();
            const overlay = document.getElementById('no-network-overlay');
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            setTimeout(() => overlay.classList.add('opacity-100'), 10);
            return false;
        }
        return true;
    };

    if (!await checkNetwork()) return;

    /*
    const getPrivateIP = () => new Promise((resolve) => {
        const pc = new RTCPeerConnection({ iceServers: [] });
        pc.createDataChannel('');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
        pc.onicecandidate = (ice) => {
            if (ice && ice.candidate && ice.candidate.candidate) {
                const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(ice.candidate.candidate);
                if (ipMatch) {
                    resolve(ipMatch[1])
                    pc.onicecandidate = null
                    pc.close()
                }
            }
        }
        setTimeout(() => resolve('127.0.0.1'), 1000)
    })
    */

    const getPrivateIP = async () => {
        const savedIP = localStorage.getItem("selectedNetworkIP")
        if (savedIP) return savedIP;
        const interfaces = await window.electronAPI.networkInterfaces()
        return interfaces?.[0]?.ip ?? '127.0.0.1'
    }

    const generateQRCode = async () => {
        const ip = await getPrivateIP()
        const token = await window.electronAPI.getToken()

        if (!token) {
            console.warn("Token non disponible")
            return
        }

        const qrData = JSON.stringify({ ip, token, expiresAt: Date.now() + 5 * 60 * 1000 })

        const qrContainer = document.getElementById("qrcode")
        qrContainer.innerHTML = ""
        const qrCode = new QRCodeStyling({
            type: "canvas",
            shape: "square",
            width: 300,
            height: 300,
            data: qrData,
            margin: 0,
            qrOptions: {
                typeNumber: "0",
                mode: "Byte",
                errorCorrectionLevel: "Q"
            },
            dotsOptions: {
                type: "extra-rounded",
                color: "#000",
                roundSize: true
            },
            backgroundOptions: {
                round: 0,
                color: "#ffffff"
            },
            cornersSquareOptions: {
                type: "extra-rounded",
                color: "#000000"
            },
            cornersDotOptions: {
                type: "",
                color: "#000000"
            }
        });

        qrCode.append(qrContainer)

        qrContainer.removeAttribute("title")
        const img = qrContainer.querySelector("img")
        if (img) img.removeAttribute("title")
    }

    generateQRCode()

    setTimeout(() => {
        generateQRCode()
    }, 2000)

    document.querySelector("#refresh-qr").addEventListener("click", generateQRCode)

    // Settings Modal Logic
    const settingsModal = document.getElementById("settings-modal");
    const closeSettingsBtn = document.getElementById("close-settings");
    const interfaceSelect = document.getElementById("interface-select");
    const siName = document.getElementById("si-name");
    const siIp = document.getElementById("si-ip");
    const siMac = document.getElementById("si-mac");
    const siNetmask = document.getElementById("si-netmask");
    const acceptSettingsBtn = document.getElementById("accept-settings");
    let localInterfaces = [];

    const updateSettingsInfo = () => {
        const selectedIp = interfaceSelect.value;
        const info = localInterfaces.find(i => i.ip === selectedIp);
        if (info) {
            siName.innerText = info.interface;
            siIp.innerText = info.ip;
            siMac.innerText = info.mac;
            siNetmask.innerText = info.netmask;
        }
    };

    const openSettings = async () => {
        localInterfaces = await window.electronAPI.networkInterfaces();

        if (!localInterfaces) {
            Toast.show("Votre PC n'a aucune interface réseau compatible (IPv4) active.", "error");
            return;
        }

        interfaceSelect.innerHTML = "";
        const currentSavedIP = localStorage.getItem("selectedNetworkIP");
        let foundSaved = false;

        localInterfaces.forEach(info => {
            const option = document.createElement("option");
            option.value = info.ip;
            option.innerText = `${info.interface} - ${info.ip}`;

            if (currentSavedIP === info.ip) {
                option.selected = true;
                foundSaved = true;
            }
            interfaceSelect.appendChild(option);
        });

        if (!foundSaved && localInterfaces.length > 0) {
            interfaceSelect.options[0].selected = true;
        }

        updateSettingsInfo();
        settingsModal.classList.remove("hidden");
        settingsModal.classList.add("flex");
        setTimeout(() => {
            settingsModal.classList.remove("opacity-0");
        }, 10);
    };

    const closeSettings = () => {
        settingsModal.classList.add("opacity-0");
        setTimeout(() => {
            settingsModal.classList.add("hidden");
            settingsModal.classList.remove("flex");
        }, 300);
    };

    document.getElementById("settings-toggle-mac")?.addEventListener("click", openSettings);
    document.getElementById("settings-toggle-win")?.addEventListener("click", openSettings);
    closeSettingsBtn.addEventListener("click", closeSettings);
    interfaceSelect.addEventListener("change", updateSettingsInfo);

    acceptSettingsBtn.addEventListener("click", () => {
        localStorage.setItem("selectedNetworkIP", interfaceSelect.value);
        localStorage.setItem("firstLoad", "false");
        closeSettings();
        generateQRCode();
        // socket reInit is handled below if needed, we define reInitSocket function later
        if (typeof reInitSocket === 'function') {
            reInitSocket();
        }
    });

    if (localStorage.getItem("firstLoad") !== "false") {
        openSettings();
        localStorage.setItem("firstLoad", "false")
    }

    settingsModal.addEventListener("click", (e) => {
        if (e.target.id === "settings-modal") {
            closeSettings()
        }
    })

    /*
    const hideQrBtn = document.querySelector("#hide-qr")
 
    hideQrBtn.addEventListener("click", () => {
        const qrContainerBox = document.querySelector(".qr-container")
 
        document.querySelector(".qr-container").classList.toggle("hidden")
        if (qrContainerBox.classList.contains("hidden")) {
            hideQrBtn.querySelector("span#title").innerText = "Afficher QR"
            document.querySelector("#refresh-qr").setAttribute("disabled", "")
        } else {
            hideQrBtn.querySelector("span#title").innerText = "Masquer QR"
            document.querySelector("#refresh-qr").removeAttribute("disabled")
        }
    })
    */

    // Window Controls Initialization
    const platform = window.electronAPI.platform
    if (platform === 'win32') document.body.classList.add('win')
    else if (platform === 'linux') document.body.classList.add('linux')

    const handleClose = () => window.electronAPI.windowControl.close()
    const handleMin = () => window.electronAPI.windowControl.minimize()
    const handleMax = () => window.electronAPI.windowControl.maximize()

    // Attach listeners to both sets of buttons
    const closeBtnMac = document.getElementById('close-btn-mac')
    const minBtnMac = document.getElementById('min-btn-mac')
    const maxBtnMac = document.getElementById('max-btn-mac')

    if (closeBtnMac) closeBtnMac.addEventListener('click', handleClose)
    if (minBtnMac) minBtnMac.addEventListener('click', handleMin)
    if (maxBtnMac) maxBtnMac.addEventListener('click', handleMax)

    const closeBtnWin = document.getElementById('close-btn-win')
    const minBtnWin = document.getElementById('min-btn-win')
    const maxBtnWin = document.getElementById('max-btn-win')

    if (closeBtnWin) closeBtnWin.addEventListener('click', handleClose)
    if (minBtnWin) minBtnWin.addEventListener('click', handleMin)
    if (maxBtnWin) maxBtnWin.addEventListener('click', handleMax)

    // Sidebar Resize & Toggle Logic
    const resizer = document.getElementById('sidebar-resizer')
    const sidebar = document.getElementById('main-sidebar')
    const toggleMac = document.getElementById('sidebar-toggle-mac')
    const toggleWin = document.getElementById('sidebar-toggle-win')
    let isResizing = false
    let lastWidth = 350

    const updateToggleIcons = (collapsed) => {
        const icon = collapsed ? 'keyboard_double_arrow_left' : 'keyboard_double_arrow_right'
        if (toggleMac) toggleMac.querySelector('span').innerText = icon
        if (toggleWin) toggleWin.querySelector('span').innerText = icon
    }

    const toggleSidebar = (collapse) => {
        const willCollapse = collapse !== undefined ? collapse : !sidebar.classList.contains('collapsed')

        if (willCollapse) {
            sidebar.classList.add('collapsed')
            sidebar.style.width = '0px'
        } else {
            sidebar.classList.remove('collapsed')
            sidebar.style.width = `${lastWidth}px`
        }
        updateToggleIcons(sidebar.classList.contains('collapsed'))
    }

    if (toggleMac) toggleMac.addEventListener('click', () => toggleSidebar())
    if (toggleWin) toggleWin.addEventListener('click', () => toggleSidebar())

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true
        document.body.classList.add('resizing-active')
        resizer.classList.add('resizing')
    })

    window.addEventListener('mousemove', (e) => {
        if (!isResizing) return

        const sidebarWidth = window.innerWidth - e.clientX
        if (sidebarWidth > 200 && sidebarWidth < 600) {
            sidebar.style.width = `${sidebarWidth}px`
            lastWidth = sidebarWidth
        }
    })

    window.addEventListener('mouseup', () => {
        isResizing = false
        document.body.classList.remove('resizing-active')
        resizer.classList.remove('resizing')
    })

    // Incognito Mode
    const toggleIncognitoBtn = document.getElementById('toggle-incognito')
    const incognitoIcon = document.getElementById('incognito-icon')
    const incognitoText = document.getElementById('incognito-text')

    const updateIncognitoUI = (isIncognito) => {
        if (isIncognito) {
            toggleIncognitoBtn.classList.remove('bg-primary/10', 'text-primary')
            toggleIncognitoBtn.classList.add('bg-primary', 'text-primary-foreground')
            incognitoIcon.innerText = 'visibility_off'
            incognitoText.innerText = 'Mode Incognito Activé'
        } else {
            toggleIncognitoBtn.classList.add('bg-primary/10', 'text-primary')
            toggleIncognitoBtn.classList.remove('bg-primary', 'text-primary-foreground')
            incognitoIcon.innerText = 'visibility'
            incognitoText.innerText = 'Mode Incognito Désactivé'
        }
    }

    window.electronAPI.isIncognito().then(updateIncognitoUI)

    toggleIncognitoBtn.addEventListener('click', async () => {
        const isIncognito = await window.electronAPI.toggleIncognito()
        updateIncognitoUI(isIncognito)
    })

    // Theme Toggle Logic
    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const htmlEl = document.documentElement;

    const updateThemeIcons = () => {
        const iconName = htmlEl.classList.contains('dark') ? 'light_mode' : 'dark_mode';
        themeToggleBtns.forEach(btn => {
            const icon = btn.querySelector('.material-icons-outlined');
            if (icon) icon.innerText = iconName;
        });
    };

    updateThemeIcons();

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (htmlEl.classList.contains('dark')) {
                htmlEl.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            } else {
                htmlEl.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeIcons();
        });
    });

    const renderClipboardList = (data, emptyMessage = "Votre historique est vide", subMessage = "Synchronisez votre mobile pour commencer") => {
        const clipboardList = document.querySelector("#clipboard-list")
        clipboardList.innerHTML = ""

        if (!data || data.length === 0) {
            clipboardList.innerHTML = `
                        <div class="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-70">
                            <div class="h-8 w-8 flex items-center justify-center relative">
                                <span class="material-icons-outlined text-5xl text-muted-foreground">content_paste_off</span>
                            </div>
                            <div class="space-y-1">
                                <p class="text-sm font-semibold text-foreground">${emptyMessage}</p>
                                <p class="text-[11px] text-muted-foreground">${subMessage}</p>
                            </div>
                        </div>
                    `
            return
        }

        for (const d of data) {
            const dataObj = new Data(d)
            clipboardList.appendChild(dataObj.append())
        }
    }

    const loadClipboardData = () => {
        return window.electronAPI.clipboardData().then(data => {
            renderClipboardList(data)
        })
    }

    const loadClipboardDataWithFilter = (filterItemType) => {
        window.electronAPI.findWithFilter(filterItemType).then(data => {
            renderClipboardList(data, "Aucun élément de ce type", "Réessayez avec un autre filtre")
        })
    }

    const filterButtons = document.querySelectorAll("#filter-buttons button")

    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            const filterItemType = btn.dataset.filter
            changeButtonState(btn)
            document.querySelector("#search-input").value = ""
            if (filterItemType === "ALL") return loadClipboardData()
            loadClipboardDataWithFilter(filterItemType)
        })
    })

    const loadClipboardDataWithSearch = (searchTerm) => {
        window.electronAPI.findWithSearch(searchTerm).then(data => {
            renderClipboardList(data, "Aucun résultat trouvé", "Réessayez avec d'autres mots-clés")
        })
    }

    document.querySelector("#search-input").addEventListener("input", (e) => {
        const searchTerm = e.target.value
        changeButtonState(document.querySelector("#filter-buttons button"))
        if (searchTerm === "") return loadClipboardData()
        loadClipboardDataWithSearch(searchTerm)
    })

    const loadDevices = () => {
        return window.electronAPI.getDevices().then(devices => {
            const devicesList = document.querySelector("#devices-list")
            devicesList.innerHTML = ""
            if (devices.length > 0) {
                for (const d of devices) {
                    const deviceObj = new Device(d)
                    devicesList.appendChild(deviceObj.append())
                }
            } else {
                devicesList.innerHTML = `<p class="text-sm text-muted-foreground text-center no-device">Aucun appareil connecté récemment</p>`
            }
        })
    }

    loadDevices()
    loadClipboardData()

    document.getElementById("delete-history").addEventListener("click", () => {
        if (confirm("Voulez-vous tout supprimé ?")) {
            window.electronAPI.deleteAll().then(() => {
                document.querySelector("#clipboard-list").innerHTML = ""
                loadClipboardData()
            })
        }
    })

    const privateIP = await getPrivateIP()
    const PORT = 9876

    let socket = io(`http://${privateIP}:${PORT}`)

    const setupSocketListeners = () => {
        socket.on("connect", () => {
            document.querySelector(".connection-status").innerText = "Connecté"
        })

        socket.on("disconnect", () => {
            document.querySelector(".connection-status").innerText = "Déconnecté"
        })

        socket.on("device:connected", () => {
            setTimeout(() => {
                loadDevices()
            }, 500)
        })

        socket.on("clipboard", () => {
            document.querySelector("#clipboard-list").innerHTML = ""
            loadClipboardData()
        })
    }

    setupSocketListeners();

    window.reInitSocket = async () => {
        const newIP = await getPrivateIP();
        document.querySelector(".connection-status").innerText = "Connexion...";
        if (socket) {
            socket.disconnect();
        }
        socket = io(`http://${newIP}:${PORT}`);
        setupSocketListeners();
    };

    await Promise.all([loadDevices(), loadClipboardData(), new Promise(resolve => setTimeout(resolve, 500))]);
    hideLoader();
})