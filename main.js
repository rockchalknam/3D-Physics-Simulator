/**
 * Physics Lab Controller - main.js
 * Project: Let's Go Herons
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
        remappableButtons: [
            { name: 'Start/Pause', key: 'Enter', joy: '9' },
            { name: 'Action A', key: 'x', joy: '0' },
            { name: 'Action B', key: 'c', joy: '1' },
            { name: 'Z-Trigger', key: 'z', joy: '7' },
            { name: 'Up', key: 'ArrowUp', joy: 'up' },
            { name: 'Down', key: 'ArrowDown', joy: 'down' },
            { name: 'Left', key: 'ArrowLeft', joy: 'left' },
            { name: 'Right', key: 'ArrowRight', joy: 'right' }
        ],
        remapPlayer1: true,
        remapOptions: false
    },

    init: function() {
        // Bind Rivets.js for reactive UI
        rivets.bind($('#maindiv'), { data: this.data });
        
        // Check for existing saves to enable/disable "Quick Load"
        this.data.noLocalSave = !localStorage.getItem('heron-lab-save');
        
        console.log("Physics Lab: Systems Online");
    },

    // --- File Handling ---
    uploadBrowse: function() {
        $('#file-upload').click();
    },

    // --- Simulation Controls ---
    loadRom: function() {
        this.data.moduleInitializing = true;
        toastr.info("Initializing Physics Engine...");
        
        // Simulating the hand-off to the WASM Module
        setTimeout(() => {
            $('#canvasDiv').fadeIn();
            this.data.beforeEmulatorStarted = false;
            this.data.moduleInitializing = false;
            toastr.success("Simulation Running");
        }, 1500);
    },

    newRom: function() {
        if (confirm("Stop the current simulation? Unsaved data will be lost.")) {
            location.reload(); // Hard reset for clean student environment
        }
    },

    // --- UI State Management ---
    showRemapModal: function() {
        $('#buttonsModal').modal('show');
    },

    swapRemap: function(type) {
        if (type === 'player1') {
            this.data.remapPlayer1 = true;
            this.data.remapOptions = false;
        } else {
            this.data.remapPlayer1 = false;
            this.data.remapOptions = true;
        }
    },

    saveStateLocal: function() {
        // Logic to capture WASM memory state
        localStorage.setItem('heron-lab-save', 'data_blob');
        this.data.noLocalSave = false;
        toastr.success("Milestone Saved Locally");
    },

    fullscreen: function() {
        var el = document.getElementById('canvas');
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.mozRequestFullScreen) el.mozRequestFullScreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
    }
};

// Global Class for core emulator hooks
var myClass = {
    loadRom: function() {
        myApp.loadRom();
    }
};

$(document).ready(function() {
    myApp.init();
    
    // Listen for file selection
    $('#file-upload').change(function() {
        if (this.files.length > 0) {
            myApp.data.hasRoms = true;
            myApp.data.romList = [{ title: this.files[0].name, url: 'local' }];
            toastr.success("Dataset: " + this.files[0].name + " loaded.");
        }
    });
});
