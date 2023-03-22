import React, { useState, useEffect } from "react"
import Grid from '@mui/material/Grid';

import Navbar from "./Navbar/Navbar"
import VideoPlayer from "./VideoPlayer/VideoPlayer"
import RecordBtn from "./RecordBtn/RecordBtn"
import SourceInit from "./SourceInit/SourceInit"

import Camera from "../assets/camera.svg"
import Webcam from "../assets/webcam.svg"
import Sound from "../assets/sound.svg"
import Mic from "../assets/mic.svg"
import Back from '../assets/back.svg';
import Checked from "../assets/checked.svg"
import Screen from "../assets/screen.svg"
import Start from "../assets/start.svg"
import Resume from '../assets/resume.svg';
import Stop from '../assets/stop.svg';
import End from '../assets/end.svg';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getDisplayMedia, getAudioMedia, getDisplayMediaWithAudio } from "./getDisplayMedia"

function Home() {
  const [displaySource, setDisplaySource] = useState(false)
  const [setting, setSetting] = useState({
    screen: true,
    camera: false,
    sound: true,
    mic: false
  });
      
  const [timer, setTimer] = useState('00:00:00');
  const [second, setSecond] = useState(0);
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(0);
  const [timerStatus, setTimerStatus] = useState(false);

  const [isRecording, setIsRecording] = useState(false)
  const [recordingPause, setRecordingPause] = useState(false)
  const [mediaRecorder, setmediaRecorder] = useState(null)

  useEffect(() => {
    function spaceBarRecord(keyPress) {
      console.log(keyPress.keyCode == 32)
      if (keyPress.keyCode == 32) {
        if (isRecording == false) {
          startRecording()
        } else {
          stopRecording()
        }
      }
    }
    window.addEventListener("keydown", spaceBarRecord)
    return () => {
      window.removeEventListener("keydown", spaceBarRecord)
    }
  })

  useEffect(() => {
    if(Number(second) >= 59) {
      const tempMinute = Number(minute) + 1;
      setMinute(tempMinute);
      setSecond(0);
    }
    if(Number(minute) >= 60) {
      const tempHour = Number(hour) + 1;
      setMinute(0);
      setHour(tempHour);
    }
  },[second, minute])


  useEffect(() => {
    if(timerStatus){
      const timer = setTimeout(function() {
        const tempSecond = second + 1;
        setSecond(tempSecond);
      }, 1000)

      return () => { // this should work flawlessly besides some milliseconds lost here and there 
        clearTimeout(timer)
      }
    }
  }, [second, timerStatus]);

  async function startRecording() {
    setTimerStatus(true);
    setIsRecording(true)

    // Add microphone audioTrack to videoSource
    // const audioSource = await getAudioMedia()
    // audioSource.getAudioTracks().forEach((audioTrack) => {
    //   displaySource.addTrack(audioTrack)
    // })

    let options = { mimeType: "video/webm;codecs=vp8" }
    const mediaRecorder = new MediaRecorder(displaySource, options)

    let recordedChunks = []
    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) recordedChunks.push(e.data)
    }

    mediaRecorder.onstop = function () {
      saveFile(recordedChunks)
      recordedChunks = []
    }
    mediaRecorder.start();
    setmediaRecorder(mediaRecorder)
  }

  async function stopRecording() {
    setTimerStatus(false);
    setHour(0);
    setMinute(0);
    setSecond(0);
    setIsRecording(false)
    mediaRecorder.stop()
  }

  async function pauseRecording() {
    setTimerStatus(false);
    setRecordingPause(true);
    mediaRecorder.pause();
  }

  async function resumeRecording() {
    setTimerStatus(true);
    setRecordingPause(false);
    mediaRecorder.resume()
  }

  const saveFile = (recordedChunks) => {
    const blob = new Blob(recordedChunks, { type: "video/webm" })

    const dateTime = new Date()
      .toLocaleString()
      .replace(" ", "_")
      .replace(",", "")
    const fileName = "Recording_" + dateTime

    const downloadLink = document.createElement("a")
    downloadLink.href = URL.createObjectURL(blob)
    downloadLink.download = `${fileName}`
    downloadLink.click()

    URL.revokeObjectURL(blob)
    downloadLink.remove()
  }

  const handleSound = () => {
    setSetting({...setting, sound: !setting.sound})
  }

  const handleMic = async () => {
    toast.warning('MediaDevice Not Found!', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    const audioSource = await getAudioMedia()
    console.log(audioSource);
    audioSource.getAudioTracks().forEach((audioTrack) => {
      displaySource.addTrack(audioTrack)
    })  
  }

  const getVideoSources = async() => {
    console.log(setting.sound);
    try {
      let displaySource;
      if(setting.sound)
        displaySource = await getDisplayMedia(setting.sound)
      else
        displaySource = await getDisplayMedia(setting.sound)
      setDisplaySource(displaySource)
    } catch {}
  }

  const handleBack = () =>{
    setDisplaySource(false);
  }

  return (    
    <>
      <div className="m-auto" style={{ maxWidth: '80%', marginTop: '150px' }}>
        <div className="flex">
          <div className="flex items-center m-0-auto" style={{marginBottom: '50px'}}>
            <img className="w-100 h-50" src={Camera} alt="camera" />
            <div className="color-black font-size_36 font-weight_700">フリーオンライン録画</div>
          </div>
        </div>
        {
         displaySource ? 
              <>
              <Grid container columns={12}>
                <Grid item xs={12} md={3} lg={3}>
                </Grid>
                <Grid item xs={12} md={5} lg={5} className="p-30">
                  <div className="back-btn" onClick={handleBack}>
                    <img src={Back} className="w-24 h-24" alt="back" />&nbsp;戻る
                  </div>
                  <VideoPlayer
                    displaySource={displaySource}
                    setDisplaySource={setDisplaySource}
                  />
                  <div className='flex justify-around' style={{marginTop: '40px'}}>
                    <img src={Webcam} className="w-30 h-30" alt="webcam" />
                    <img src={Sound} className="w-30 h-30" alt="sound" />
                    <img src={Mic} className="w-30 h-30" alt="mic" />
                  </div>
                </Grid>
                <Grid item xs={12} md={4} lg={4} className="p-30">
                  <div className='count-down-num'>{hour < 10 ? '0' + hour : hour}:{minute < 10 ? '0' + minute : minute}:{second < 10 ? '0' + second : second} </div>
                  <div className='flex justify-evenly' style={{marginTop: '30px'}}>
                  {
                    !isRecording? 
                      <>
                        <div className="control-btn" onClick={startRecording}>
                          <img src={Resume} className="w-24 h-24" alt="end" />
                        </div>
                        <div className="control-btn" onClick={stopRecording}>
                          <img src={End} className="w-24 h-24" alt="end" />
                        </div>
                      </>
                      :
                      recordingPause ?
                        <>
                          <div className="control-btn" onClick={resumeRecording}>
                            <img src={Resume} className="w-24 h-24" alt="end" />
                          </div>
                          <div className="control-btn" onClick={stopRecording}>
                            <img src={End} className="w-24 h-24" alt="end" />
                          </div>
                        </>
                        :
                        <>
                          <div className="control-btn" onClick={pauseRecording}>
                            <img src={Stop} className="w-24 h-24" alt="end" />
                          </div>
                          <div className="control-btn" onClick={stopRecording}>
                            <img src={End} className="w-24 h-24" alt="end" />
                          </div>
                        </>
                  }
                  </div>
                </Grid>
              </Grid>
            </>
            :
            <>        
              <div className="flex justify-evenly">
                <div className="main_btn">
                  <img className="w-100 h-50 m-0-auto" src={Screen} alt="screen" />
                  <div className="mt-10">スクリーン</div>
                  <img className={setting.screen ? "check-active" : "check-unactive"} src={Checked} alt="checked" />          
                </div>
                <div className="main_btn">
                  <img className="w-100 h-50 m-0-auto" src={Webcam} alt="screen" />
                  <div className="mt-10">ウェブカメラ</div>
                  <img className={setting.camera ? "check-active" : "check-unactive"} src={Checked} alt="checked" />
                </div>
                <div className="main_btn" onClick={handleSound}>
                  <img className="w-100 h-50 m-0-auto" src={Sound} alt="screen" />
                  <div className="mt-10">システムサウンド</div>
                  <img className={setting.sound ? "check-active" : "check-unactive"} src={Checked}  alt="checked" />
                </div>
                <div className="main_btn" onClick={handleMic}>
                  <img className="w-100 h-50 m-0-auto" src={Mic} alt="screen" />
                  <div className="mt-10">マイク</div>
                  <img className={setting.mic ? "check-active" : "check-unactive"} src={Checked}  alt="checked" />
                </div>
              </div>
              <button className="record-btn record-start m-auto" style={{marginTop:"50px"}} onClick={getVideoSources}>
                <img className="w-24 h-24 padding-5 w-35 h-35" src={Start} style={{backgroundColor: '#1fb5c9', borderRadius:'50%'}} alt="checked" />
                録画開始
              </button>
            </>
        }
      </div>
    </>
  )
}

export default Home
