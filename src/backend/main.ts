import { app, ipcMain } from "electron";
import { createWindow, getWindow } from "./createWindow";
import { getPDFData } from "./getPDFData";
import { readFileAndResize } from "./readFileAndResize";
import { dialog } from "electron";

// win app is ready
app.whenReady().then(createWindow);

ipcMain.handle("openFile", async () => {
  // open native filebrowser
  try {
    const file = dialog.showOpenDialogSync(getWindow(), {
      properties: ["openFile"],
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });

    if (file?.length) {
      const filedata = await getPDFData(file[0]);
      getWindow().webContents.send("openFile", filedata);
    } else {
      getWindow().webContents.send("openFile");
    }
  } catch (err) {
    app.quit();
  }
});

ipcMain.handle("saveAsDialog", async (_event, arg) => {
  // open native filebrowser
  try {
    const saveAsPath = dialog.showSaveDialogSync(getWindow(), {
      title: "saveAs",
      properties: ["createDirectory", "showOverwriteConfirmation"],
      filters: [{ name: "PDF", extensions: ["pdf"] }],
    });

    if (saveAsPath) {
      const filepath = await readFileAndResize(arg, saveAsPath);
      require("electron").shell.openExternal(filepath);
    }
    getWindow().webContents.send("saveAsDialog");
  } catch (err) {
    console.log(err);
    dialog.showErrorBox(
      "save error",
      "unable to save file, resource busy or locked"
    );
    getWindow().webContents.send("saveAsDialog");
  }
});

ipcMain.handle("saveToDesktop", async (_event, arg) => {
  try {
    if (arg) {
      const filepath = await readFileAndResize(arg);
      require("electron").shell.openExternal(filepath);
      getWindow().webContents.send("saveToDesktop", filepath);
    }
  } catch (err) {
    app.quit();
  }
});
