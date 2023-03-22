import React from "react"
import { getDisplayMedia } from "../getDisplayMedia"
import "./SourceInit.scss"
import img from "../../assets/leaves.jpg"

function SourceInit({ setDisplaySource }) {
  async function getVideoSources() {
    try {
      const displaySource = await getDisplayMedia()
      // setDisplaySource(displaySource)
    } catch {}
  }

  return (
    <section className="sourceInit" onClick={getVideoSources}>
      <h3 className="hovertext">Select Source</h3>
    </section>
  )
}

export default SourceInit
