import { useState } from "react";

const WHISPER_WORKER_PATH = "../workers/whisperWorker.js"

export interface MessageEventHandler {
    (event: MessageEvent): void;
}

export function useWorker(messageEventHandler: MessageEventHandler): Worker {
    // Create new worker once and never again
    const [worker] = useState(() => createWorker(messageEventHandler));
    return worker;
}

function createWorker(messageEventHandler: MessageEventHandler): Worker {
    // const worker = new Worker(new URL("../worker.js", import.meta.url), {
    //     type: "module",
    // });
    const worker = new Worker(new URL(WHISPER_WORKER_PATH, import.meta.url), {
        type: "module",
    });
    // Listen for messages from the Web Worker
    worker.addEventListener("message", messageEventHandler);
    return worker;
}
