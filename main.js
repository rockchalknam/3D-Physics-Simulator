/**
 * Let's Go Herons | Physics Lab Controller
 * Clean Recompiled Version
 */

var myApp = {
    data: {
        beforeEmulatorStarted: true,
        moduleInitializing: false,
        hasRoms: true,
        romList: [], // Will be populated from romlist.js
        noLocalSave: true,
        remappableButtons: [
            { name: 'Start/Pause', key: 'Enter' },
            { name: 'Action A', key: 'x' },
            { name: 'Action B', key: 'c' },
            { name: 'Up', key: 'ArrowUp' },
            { name: 'Down', key: 'ArrowDown' },
            { name: 'Left', key: 'ArrowLeft' },
            { name: 'Right', key: 'ArrowRight' }
        ]
    },

    init: function() {
        // 1. Sync the ROM list from your romlist.js file
        if (typeof ROMLIST !== 'undefined') {
            this.data.romList = ROMLIST;
        }

        // 2. Bind the data to the HTML using Rivets
        rivets.bind($('#maindiv'), { data: this.data });
        
        console.log("Heron Physics Lab: Systems Initialized");
    },

    loadRom: function() {
        const selectedUrl = $('#romselect').val();
        if (!selectedUrl) {
            toastr.error("Please select a module.");
            return;
        }

        this.data.moduleInitializing = true;
        toastr.info("Igniting Physics Engine...");

        // 1. Tell the WASM engine where the canvas is
        window.Module.canvas = document.getElementById('canvas');
        $('#canvasDiv').show();

        // 2. Fetch the physics data file (.dat)
        fetch(selectedUrl)
            .then(response => {
                if (!response.ok) throw new Error("File not found");
                return response.arrayBuffer();
            })
            .then(buffer => {
                const romData = new Uint8Array(buffer);
                
                // 3. Start the Engine
                // This 'InitModule' is inside your n64wasm.js
                if (typeof InitModule === 'function') {
                    InitModule(romData);
                    
                    // UI Updates
                    this.data.beforeEmulatorStarted = false;
                    this.data.moduleInitializing = false;
                    toastr.success("Simulation Live");
                } else {
                    toastr.error("Engine Bridge Missing. Check file order.");
                }
            })
            .catch(err => {
                console.error("Boot Error:", err);
                toastr.error("Failed to load physics data.");
                this.data.moduleInitializing = false;
            });
    },

    // UI Helpers
    reset: function() {
        if(confirm("Reset Experiment?")) window.location.reload();
    },

    fullscreen: function() {
        const canvas = document.getElementById('canvas');
        if (canvas.requestFullscreen) canvas.requestFullscreen();
    }
};

// This bridge allows the HTML "onclick" to find our functions
var myClass = {
    loadRom: function() { myApp.loadRom(); }
};

// Launch when page is ready
$(document).ready(function() {
    myApp.init();
});
