
import { pipeline, env } from '@xenova/transformers';

import wavefile from 'wavefile';
import fs from 'fs';



// // Disable local models
// env.allowLocalModels = false;

/**
 * This class uses the Singleton pattern to ensure that only one instance of the
 * pipeline is loaded. This is because loading the pipeline is an expensive
 * operation and we don't want to do it every time we want to translate a sentence.
 */
// ref: https://huggingface.co/Xenova/mms-tts-deu

// class SpeechSynthesisPipeline {
//     static task = 'text-to-speech';
//     static model = 'Xenova/mms-tts-deu';
//     static instance = null;

//     static async getInstance(progress_callback = null) {
//         if (this.instance === null) {
//             this.instance = pipeline(this.task, this.model, { progress_callback });
//         }

//         return this.instance;
//     }
// }


// const wav = new wavefile.WaveFile();

// Listen for messages from the main thread
self.addEventListener('message', async (event) => {
    const wav = new wavefile.WaveFile();
    // Retrieve the translation pipeline. When called for the first time,
    // this will load the pipeline and save it for future use.
    // let synthesizer = await SpeechSynthesisPipeline.getInstance(x => {
    //     // We also add a progress callback to the pipeline so that we can
    //     // track model loading.
    //     // self.postMessage(x);
    //     // console.log('inside synthesizer. x:', x)
    // });

    const synthesizer = await pipeline('text-to-speech', 'Xenova/mms-tts-deu', {
        quantized: false, // Remove this line to use the quantized version (default)
    });

    // Actually perform the speech generation from text
    // let output = await synthesizer(event.data.text, {
    //     tgt_lang: event.data.tgt_lang,
    //     src_lang: event.data.src_lang,

    //     // Allows for partial output
    //     callback_function: x => {
    //         self.postMessage({
    //             status: 'update',
    //             output: translator.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true })
    //         });
    //     }
    // });

    console.log(event)
    console.log(event.data.text)

    let output = await synthesizer(event.data.text)
    console.log(output)
    console.log('starting wav file conversion...')
    wav.fromScratch(1, output.sampling_rate, '32f', output.audio);
    // fs.writeFileSync('out.wav', wav.toBuffer());
    console.log(wav)

    // Send the output back to the main thread
    self.postMessage({
        status: 'complete',
        output: wav,
    });
});
