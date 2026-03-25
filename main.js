/**
 * Let's Go Herons | Physics Lab Controller
 * Final Recompiled Version - GitHub Pages Optimized
 */

var myApp = {
    data: {
        beforeEmulatorStarted: true,
        hasRoms: false,
        romList: [],
        moduleInitializing: false,
        chkAdvanced: false,
        noLocalSave: true,
        settings: { SHOWADVANCED: true },
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
        // Bind UI
        rivets.bind($('#maindiv'), { data: this.data });
        this.data.noLocalSave = !localStorage.getItem('heron-lab-save');
        console.log("Heron Lab: Systems Online");
    },

    loadRom: function() {
        const selectedUrl = $('#romselect').val();
        if (!selectedUrl) {
            toastr.error("Please select a module.");
            return;
        }

        this.data.moduleInitializing = true;
        toastr.info("Connecting to WASM Bridge...");

        // 1. Prepare the Global Module for the code you pasted
        window.Module = window.Module || {};
        window.Module.canvas = document.getElementById('canvas');
        window.Module.monitorRunDependencies = (left) => {
            if (left === 0) {
                this.data.moduleInitializing = false;
                this.data.beforeEmulatorStarted = false;
                $('#canvasDiv').fadeIn();
                toastr.success("Simulation Live");
            }
        };

        // 2. Handle the WASM file location for GitHub Pages
        window.Module.locateFile = function(path) {
            if (path.endsWith('.wasm')) return "n64wasm.wasm";
            return path;
        };

        // 3. The Boot Sequence
        try {
            // Check if InitModule is globally available
            if (typeof InitModule === 'function') {
                InitModule(selectedUrl);
            } 
            // If not, we fetch the data manually and pass it to the engine
            else {
                fetch(selectedUrl)
                    .then(response => {
                        if (!response.ok) throw new Error("Dataset not found");
                        return response.arrayBuffer();
                    })
                    .then(buffer => {
                        const romData = new Uint8Array(buffer);
                        // Emergency check for the internal boot function
                        if (window.n64wasm && typeof window.n64wasm.load === 'function') {
                            window.n64wasm.load(romData);
                        } else {
                            // Standard fallback for n64wasm builds
                            console.warn("Using standard buffer injection...");
                            if (typeof InitModule === 'function') InitModule(romData);
                        }
                    })
                    .catch(err => {
                        console.error("Fetch Error:", err);
                        toastr.error("Could not load .dat file.");
                    });
            }
        } catch (err) {
            console.error("Fatal Boot Error:", err);
            toastr.error("Engine Bridge Failed.");
        }
    },

    // --- Student UI Helpers ---
    reset: function() {
        if(confirm("Reset Simulation?")) window.location.reload();
    },

    newRom: function() {
        if(confirm("Return to Dashboard?")) window.location.reload();
    },

    saveStateLocal: function() {
        localStorage.setItem('heron-lab-save', 'active');
        this.data.noLocalSave = false;
        toastr.success("Progress Saved!");
    },

    fullscreen: function() {
        const canvas = document.getElementById('canvas');
        if (canvas.requestFullscreen) canvas.requestFullscreen();
    },

    showRemapModal: function() {
        $('#buttonsModal').modal('show');
    }
};

// Global Bridge for HTML
var myClass = {
    loadRom: function() { myApp.loadRom(); }
};

$(document).ready(function() {
    myApp.init();
});
