const { app, BrowserWindow, Notification, ipcMain, Menu } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    title: "Pomodoro App",
    icon: "img/img.jpg",
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: true,
    },
  });

  mainWindow.loadFile("renderer/index.html");
}

app.whenReady().then(() => {
  createWindow();

  let notiDescanso = new Notification({
    title: "Es hora de descansar!",
    body: "Buen trabajo, mereces un descanso.",
    icon: path.join(__dirname, "img/descanso.jpg"),
  });
  let notiTrabajo = new Notification({
    title: "Hora de volver al trabajo",
    body: "Es hora de seguir esforzandote!",
    icon: path.join(__dirname, "img/concentrarse.jpg"),
  });

  ipcMain.on("tomarDescanso", (event) => {
    notiDescanso.show();
  });

  ipcMain.on("volverTrabajo", (event) => {
    notiTrabajo.show();
  });
});

app.on("window-all-closed", () => {
  app.quit();
});
