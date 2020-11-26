import { FileData } from "../backend/fileData";
import { ipcRenderer, contextBridge } from "electron";

const preloadAPI = {
  openFileDialog: function () {
    return new Promise<FileData>((resolve) => {
      ipcRenderer.once("openFile", (_event: any, msg: FileData) => {
        resolve(msg);
      });
      ipcRenderer.invoke("openFile");
    });
  },
  saveAsDialog: function (filedata: FileData) {
    return new Promise((resolve) => {
      ipcRenderer.once("saveAsDialog", (_event: any, msg: string) => {
        resolve(msg);
      });
      ipcRenderer.invoke("saveAsDialog", filedata);
    });
  },
  saveToDesktopBtn: function (filedata: FileData) {
    return new Promise((resolve) => {
      ipcRenderer.once("saveToDesktop", (_event: any, msg: string) => {
        resolve(msg);
      });
      ipcRenderer.invoke("saveToDesktop", filedata);
    });
  },
  showSelectedBtn: function (filedata: FileData): Promise<void> {
    return new Promise((resolve) => {
      try {
        require("electron").shell.openExternal(filedata.filePath);
        resolve();
      } catch (e) {
        resolve();
        //todo
      }
    });
  },
  gotoUrl: function (url: string) {
    require("electron").shell.openExternal(url);
  },
};

contextBridge.exposeInMainWorld("preload", preloadAPI);

export type PreloadAPI = { preload: typeof preloadAPI } & typeof window;
