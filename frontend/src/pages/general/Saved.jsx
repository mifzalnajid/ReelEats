import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'

const Saved = () => {
  const [videos, setVideos] = useState([])
  const videoRefs = useRef(new Map())

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedFoodItems') || '[]')
    setVideos(saved)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.6, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [videos])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    videoRefs.current.set(id, el)
  }

  const removeSaved = (id) => {
    const list = JSON.parse(localStorage.getItem('savedFoodItems') || '[]')
    const next = list.filter((x) => x._id !== id)
    localStorage.setItem('savedFoodItems', JSON.stringify(next))
    setVideos(next)
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {videos.length === 0 && (
          <div className="empty-state">
            <p>No saved videos yet.</p>
          </div>
        )}
        {videos.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted
              playsInline
              loop
              preload="metadata"
            />

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />

              <div className="reel-actions">
                <button className="reel-action" onClick={() => removeSaved(item._id)} aria-label="Remove bookmark">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>
                  </svg>
                </button>
              </div>

              <div className="reel-content">
                <p className="reel-description" title={item.description}>{item.description}</p>
                <Link className="reel-btn" to={"/food-partner/" + item.foodPartner} aria-label="Visit store">Visit store</Link>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Saved
