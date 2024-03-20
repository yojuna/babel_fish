export function processTranscribedText(transcribedData){
    let chunks = transcribedData?.chunks ?? [];
    let text = chunks
        .map((chunk) => chunk.text)
        .join("")
        .trim();
    return text;
};