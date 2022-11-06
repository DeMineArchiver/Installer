import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import path from "path";
import { format } from "url";
import { devPort } from "..";
import { isDev, urlFormat } from "../utils";

export default class InstallerWindow extends BrowserWindow {
    public static readonly defaultWidth = 800;
    public static readonly defaultHeight = 600;

    public constructor(options?: BrowserWindowConstructorOptions) {
        const width = options?.width ? options.width : InstallerWindow.defaultWidth;
        const height = options?.height ? options.height : InstallerWindow.defaultHeight;
        super({
            // Transforms
            width, height,
            minWidth: width, maxWidth: width,
            minHeight: height, maxHeight: height,
            center: true,
            alwaysOnTop: false,

            // Layout
            closable: true, minimizable: true,
            maximizable: false, fullscreenable: true,
            resizable: false,
            
            
            // Look
            title: "REALcam Installer",
            darkTheme: true,
            roundedCorners: true,
            transparent: false,

            // Web
            webPreferences: {
                devTools: isDev,
                nodeIntegration: true,
                contextIsolation: true,
                
            },

            // Custom options
            ...options
        });
        this.setMenu(null);
    }

    public static async createWindow(options?: BrowserWindowConstructorOptions) {
        const window = new InstallerWindow(options);
        
        const url = isDev ? `http://localhost:${devPort}/` : urlFormat({
            pathname: path.join(__dirname, '../renderer/out/index.html'),
            protocol: 'file:',
            slashes: true,
        });

        window.loadURL(url);
    }

    public switchLanguage() {
        
    }
}