# BabelFish

![Babel Fish from Hitchhiker's Guide](./src/assets/babelfish.jpg)

Real time speech2speech language translation directly in your browser! Built with [🤗 Transformers.js](https://github.com/xenova/transformers.js). 

Using local Whisper, publicly available machine translation models and text2speech models, bundled up in an end to end pipeline.

Check out the demo site [here](https://elegant-phoenix-ffa99e.netlify.app/). Still work in progress.

Currently working on chaining all the modules together more seamlessly and improving latency.


## Getting Started / Running locally

1. Clone the repo and install dependencies:

    ```bash
    git clone https://github.com/yojuna/babel_fish.git
    cd whisper-web
    npm install
    ```

2. Run the development server:

    ```bash
    npm run dev
    ```
    > Firefox users need to change the `dom.workers.modules.enabled` setting in `about:config` to `true` to enable Web Workers.
    > Check out [this issue](https://github.com/xenova/whisper-web/issues/8) for more details.

3. Open the link (e.g., [http://localhost:5173/](http://localhost:5173/)) in your browser. Or alternatively, you can open it on your mobile browser at the internal IP address of your wifi network. Refer to the output after running `npm run dev`
