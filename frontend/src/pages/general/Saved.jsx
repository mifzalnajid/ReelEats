import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../../styles/reels.css'
import axios from 'axios'

const Saved = () => {
    const [ videos, setVideos ] = useState([])
    const videoRefs = useRef(new Map())

    useEffect(() => {

        axios.get("http://localhost:3000/api/food/save", { withCredentials: true })
            .then(response => {
                const savedFoods = response.data.savedFoods.map((item) => ({
                    _id: item.food._id,
                    video: item.food.video,
                    description: item.food.description,
                    likeCount: item.food.likeCount,
                    savesCount: item.food.savesCount,
                    commentsCount: item.food.commentsCount,
                }))

                setVideos(savedFoods)

            })
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target
                    if (!(video instanceof HTMLVideoElement)) return
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        video.play().catch(() => { })
                    } else {
                        video.pause()
                    }
                })
            },
            { threshold: [ 0, 0.6, 1 ] }
        )

        videoRefs.current.forEach((vid) => observer.observe(vid))
        return () => observer.disconnect()
    }, [ videos ])

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
                                <div className="reel-action-group">
                                    <button className="reel-action" aria-label="Like">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.likesCount ?? item.likes ?? 0}</div>
                                </div>

                                <div className="reel-action-group">
                                    <button className="reel-action" onClick={() => removeSaved(item._id)} aria-label="Remove bookmark">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</div>
                                </div>

                                <div className="reel-action-group">
                                    <button className="reel-action" aria-label="Comments">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                                </div>
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
