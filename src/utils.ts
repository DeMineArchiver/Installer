import { resolve } from "app-root-path";
import electron, { app, protocol } from "electron";
import path from "path";
import http from "http";
import { UrlObject } from "url";

// Electron environment check
function getIsDev(): boolean {
    if (typeof electron === 'string') {
        throw new TypeError('Not running in an Electron environment!');
    }
    if("ELECTRON_IS_DEV" in process.env) {
        return Number.parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
    } else return !electron.app.isPackaged;
}

export const isDev = getIsDev();

// Platform checks
export const isWindows = process.platform === "win32";


// Electron next
export async function startNext(directories: NextDirectories | string, port: number = 8000) {
    directories = (typeof directories === "string") ? ({
        production: directories,
        development: directories
    } as NextDirectories) : directories;
    
    for (const type in directories) {
        if(!Object.hasOwn(directories, type)) continue;
    
        if (!path.isAbsolute(directories[type])) {
          directories[type] = resolve(directories[type])
        }
      }
    
      if (!isDev) {
        return setupNextProduction(directories.production);
      } else return await startNextDev(directories.development, port);
}

interface NextDirectories {
    production: string;
    development: string;
}

async function startNextDev(directory: string, port: number = 8000) {
    const next = (await import("next"))?.default({
        dir: directory,
        dev: true
    });
    if (!next) throw new Error("Could not load NextJS!");
    await next.prepare();

    const requestHandler = next.getRequestHandler();
    const server = http.createServer(requestHandler);

    server.listen(port, () => {
        app.on('before-quit', () => server.close());
    });
}

function setupNextProduction(directory: string) {
    const prefixes = ['/_next', '/static'];

    protocol.interceptFileProtocol("file", (request, callback) => {
        let urlPath = request.url.substring(isWindows ? 8 : 7)

        for (const prefix of prefixes) {
            let newPath = urlPath;

            if (isWindows) newPath = newPath.substring(2);
            if (!newPath.startsWith(prefix)) continue;
            if (isWindows) newPath = path.normalize(newPath);

            newPath = path.join(directory, "out", newPath);
            urlPath = newPath;
        }

        callback({ path: decodeURIComponent(urlPath) });
    })
}


// Url
export function urlFormat(urlObject: UrlObject | string): string {
    if(typeof urlObject === "string") {
        return new URL(urlObject).toString();
    } else {
        const url = new URL("https://realcamera.github.io/");
        url.protocol = urlObject.protocol;
        url.pathname = urlObject.pathname;
        url.hostname = urlObject.hostname;
        url.hash = urlObject.hash;
        url.href = urlObject.href;
        return url.toString();
    }
}