/**
 * Let's Go Herons | Physics Lab Controller
 * Optimized for GitHub Pages & Student Use
 */

var myApp = {
    data: {
        beforeEmulatorStarted: true,
        hasRoms: false,
        romList: [],
        moduleInitializing: false,
        chkAdvanced: false,
        noLocalSave: true,
        password: '',
        remapPlayer1: true,
        remapOptions: false,
        settings: {
            SHOWADVANCED: true
        },
        // Default Key Bindings for Students
        remappableButtons: [
            { name: 'Start/Pause', key: 'Enter', joy: '9' },
            { name: 'Action A', key: 'x', joy: '0' },
            { name: 'Action B', key: 'c', joy: '1' },
            { name: 'Z-Trigger', key: 'z', joy: '7' },
            { name: 'Up', key: 'ArrowUp', joy: 'up' },
            { name: 'Down', key: 'ArrowDown', joy: 'down' },
            { name: 'Left', key: 'ArrowLeft', joy: 'left' },
            { name: 'Right', key: 'ArrowRight', joy: 'right' }
        ]
    },

    init: function() {
        // 1. Initialize UI Binding with Rivets
        rivets.bind($('#maindiv'), { data: this.data });

        // 2. Check for existing lab saves in browser memory
        this.data.noLocalSave = !localStorage.getItem('heron-lab-save');

        // 3. Setup File Listeners for manual uploads
        this.setupFileListeners();

        console.log("Heron Physics Lab: Systems Online");
    },

    setupFileListeners: function() {
        $('#file-upload').change(function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                myApp.data.romList.push({ title: file.name, url: 'local' });
                myApp.data.hasRoms = true;
                toastr.success("Dataset '" + file.name + "' loaded.");
            }
        });
    },

    // --- Core Simulation Logic ---
    
    uploadBrowse: function() {
        $('#file-upload').click();
    },

    loadRom: function() {
        // Get the selected file URL from the dropdown
        const selectedUrl = $('#romselect').val();
        if (!selectedUrl) {
            toastr.error("Please select a module first.");
            return;
        }

        this.data.moduleInitializing = true;
        toastr.info("Initializing Physics Engine...");

        // Prepare the Emscripten Module object for n64wasm.js
        window.Module = {
            canvas: document.getElementById('canvas'),
            print: (text) => console.log(text),
            printErr: (text) => console.error(text),
            onRuntimeInitialized: function() {
                console.log("WASM Engine Ready");
            },
            monitorRunDependencies: (left) => {
                if (left === 0) {
                    myApp.data.moduleInitializing = false;
                    myApp.data.beforeEmulatorStarted = false;
                    $('#canvasDiv').fadeIn();
                }
            }
        };

        // Trigger the loader function defined in n64wasm.js
        // If InitModule is the function name in your n64wasm.js:
        try {
            if (typeof InitModule === 'function') {
                InitModule(selectedUrl);
            } else {
                console.warn("InitModule function not found. Ensure n64wasm.js is loaded.");
            }
        } catch (err) {
            console.error("Failed to start engine:", err);
            toastr.error("Engine failed to start. Check console for details.");
        }
    },

    // --- Student Controls ---

    reset: function() {
        if(confirm("Reset the current experiment?")) {
            // Re-loads the current module
            this.loadRom();
            toastr.warning("Simulation Reset");
        }
    },

    newRom: function() {
        if(confirm("Exit to Lab Dashboard? Unsaved progress will be lost.")) {
            window.location.reload();
        }
    },

    saveStateLocal: function() {
        // Placeholder for WASM memory capture
        localStorage.setItem('heron-lab-save', 'active_session');
        this.data.noLocalSave = false;
        toastr.success("Lab Milestone Saved!");
    },

    loadStateLocal: function() {
        toastr.info("Restoring from Milestone...");
        // Logic to inject state back into Module
    },

    // --- UI Helpers ---

    showRemapModal: function() {
        $('#buttonsModal').modal('show');
    },

    swapRemap: function(mode) {
        if(mode === 'player1') {
            this.data.remapPlayer1 = true;
            this.data.remapOptions = false;
        } else {
            this.data.remapPlayer1 = false;
            this.data.remapOptions = true;
        }
    },

    fullscreen: function() {
        const canvas = document.getElementById('canvas');
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    }
};

/**
 * Global Bridge for the HTML buttons
 */
var myClass = {
    loadRom: function() {
        myApp.loadRom();
    }
};

// Start app
$(document).ready(function() {
    myApp.init();
});
