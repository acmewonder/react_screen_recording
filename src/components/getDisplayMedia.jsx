export async function getDisplayMedia(status) {
  const option = {
    video: {
      mandatory: {
        maxWidth: screen.width,
        maxHeight: screen.height,
        maxFrameRate: 60,
      },
    }
  }
  const optionWithSound = {
    video: {
      mandatory: {
        maxWidth: screen.width,
        maxHeight: screen.height,
        maxFrameRate: 60,
      },
    },
    audio: true
  }
  if(status) 
    return await navigator.mediaDevices.getDisplayMedia(optionWithSound)
  else
    return await navigator.mediaDevices.getDisplayMedia(option)
}

export async function getAudioMedia() {
  const option = { audio: true }
  return await navigator.mediaDevices.getUserMedia(option)
}
