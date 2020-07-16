import { app, BrowserWindow } from "electron";
import * as path from "path";

let win: BrowserWindow = null;

export function getWindow() {
  return win;
}

export async function createWindow() {
  // load dependencies

  // add window
  win = new BrowserWindow({
    width: 600,
    minHeight: 400,
    minWidth: 600,
    maxWidth: 600,
    height: 750,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "/../preload/main.js"),
    },
  });

  // load url
  win.loadURL(`file://${__dirname}/../frontend/index.html`);

  // hide menus
  win.setMenuBarVisibility(false);
  if (!process.env.production !== true) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  // when window is ready
  win.once("ready-to-show", async () => {
    win.show();
    win.on("closed", () => {
      app.quit();
    });
  });
}
