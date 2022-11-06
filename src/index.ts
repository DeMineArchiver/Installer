import { app, BrowserWindow } from "electron";
import InstallerWindow from "./Classes/InstallerWindow";
import { startNext } from "./utils";

export const devPort: number = 8000;

app.on("ready", async () => {
    await startNext("./renderer", devPort);
    await InstallerWindow.createWindow();

    app.on("activate", () => {
        if(InstallerWindow.getAllWindows().length === 0) InstallerWindow.createWindow();
    });
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();
});