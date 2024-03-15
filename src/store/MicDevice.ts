// import create from 'zustand';

// interface MicDevice {
//     deviceID: string,
//     allDevices: {},
//     setDeviceID: () => void
// }

// export const useMicDevice = create<MicDevice>( () => ({
//     deviceID: 'default',
//     setDeviceID: () => set((state) => ({deviceID: state}))
// }));


import { create } from 'zustand'

// function getAllMicDevices() {
//     var audio_mic_devices = []
//     if (!navigator.mediaDevices?.enumerateDevices) {
//         console.log("enumerateDevices() not supported.");
//       } else {
//         // List cameras and microphones.
//         navigator.mediaDevices
//           .enumerateDevices()
//           .then((devices) => {
//             devices.forEach((device) => {
//               console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
//             //   var dev_data> = {
//             //         dev_kind: device.kind,
//             //         dev_label: device.label,
//             //         dev_id: device.deviceId
//             //         }
//               audio_mic_devices.push({
//                 dev_kind: device.kind,
//                 dev_label: device.label,
//                 dev_id: device.deviceId,
//                 })
//             });
//             console.log(audio_mic_devices)
//           })
//           .catch((err) => {
//             console.error(`${err.name}: ${err.message}`);
//           });
//       }
//     return audio_mic_devices;
//     }

// const allAvailDevices = getAllMicDevices()

export const useMicDevice = create((set) => ({
    deviceID: 'default',
    setDeviceID: () => set((state) => ({ deviceID: state.deviceID})),
    // setAllDevices: () => set((state) => ({ allDevices: state.allDevices}))
}))