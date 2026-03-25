/**
 * Let's Go Herons | Physics Lab Controller
 * Final Synchronized Version for GitHub Pages
 */

var myApp = {
    data: {
        beforeEmulatorStarted: true,
        hasRoms: false,
        romList: [],
        moduleInitializing: false,
        chkAdvanced: false,
        noLocalSave: true,
        settings: {
            SHOWADVANCED: true
        },
        // Default Key Bindings for Students
        remappableButtons: [
            { name: 'Start/Pause', key: 'Enter' },
            { name: 'Action A', key: 'x' },
            { name: 'Action B', key: 'c' },
            { name: 'Z-Trigger', key: 'z' },
            { name: 'Up', key: 'ArrowUp' },
            { name: 'Down', key: 'ArrowDown' },
            { name: 'Left', key: 'ArrowLeft' },
            { name: 'Right', key: 'ArrowRight' }
        ]
    },

    init: function() {
        // 1. Initialize UI Binding
        rivets.bind($('#maindiv'), { data: this.data });

        // 2. Check for existing saves
        this.data.noLocalSave = !localStorage.getItem('heron-lab-save');

        console.log("Heron Physics Lab: Systems Initialized");
    },

    // --- Core Simulation Logic ---
    
    uploadBrowse: function() {
        $('#file-upload').click();
    },

    loadRom: function() {
        const selectedUrl = $('#romselect').val();
        if (!selectedUrl) {
            toastr.error("Please select a module first.");
            return;
        }

        this.data.moduleInitializing = true;
        toastr.info("Igniting Physics Engine...");

        // 1. Update the pre-defined Module with simulation-specific hooks
        window.Module.monitorRunDependencies = (left) => {
            if (left === 0) {
                this.data.moduleInitializing = false;
                this.data.beforeEmulatorStarted = false;
                $('#canvasDiv').fadeIn();
                toastr.success("Simulation Live");
            }
        };

        // 2. Show the canvas container
        $('#canvasDiv').show();

        // 3. Trigger the WebAssembly Loader
        // We use a try/catch to catch path errors on GitHub Pages
        try {
            if (typeof InitModule === 'function') {
                InitModule(selectedUrl);
            } else {
                console.error("InitModule not found. Ensure n64wasm.js is loaded.");
                toastr.error("Engine Bridge Missing.");
            }
        } catch (err) {
            console.error("WASM Boot Error:", err);
            toastr.error("Failed to boot WASM engine.");
        }
    },

    // --- Student Tools ---

    reset: function() {
        if(confirm("Reset the current experiment?")) {
            // Most engines use a simple location reload to clear WASM memory
            window.location.reload();
        }
    },

    newRom: function() {
        if(confirm("Exit to Dashboard?")) {
            window.location.reload();
        }
    },

    saveStateLocal: function() {
        // This is a UI placeholder for state management
        localStorage.setItem('heron-lab-save', 'active_session');
        this.data.noLocalSave = false;
        toastr.success("Milestone Saved!");
    },

    fullscreen: function() {
        const canvas = document.getElementById('canvas');
        if (canvas.requestFullscreen) canvas.requestFullscreen();
        else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    },

    showRemapModal: function() {
        $('#buttonsModal').modal('show');
    }
};

/**
 * Global Bridge for HTML 'onclick' events
 */
var myClass = {
    loadRom: function() {
        myApp.loadRom();
    }
};

// Start the Application
$(document).ready(function() {
    myApp.init();
});
