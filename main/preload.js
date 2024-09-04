const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("tomarDescanso", {
  descanso: () => ipcRenderer.send("tomarDescanso"),
});

contextBridge.exposeInMainWorld("volverTrabajo", {
  trabajo: () => ipcRenderer.send("volverTrabajo"),
});
