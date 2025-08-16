import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../styles/reels.css'

const Home = () => {
    const [ videos, setVideos ] = useState([])
    const videoRefs = useRef(new Map())
    const containerRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target

                    if (!(video instanceof HTMLVideoElement)) return
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        // Autoplay visible video
                        video
                            .play()
                            .catch(() => {/* ignore autoplay errors (iOS might block if not muted) */ })
                    } else {
                        video.pause()
                    }
                })
            },
            { threshold: [ 0, 0.25, 0.6, 0.9, 1 ] }
        )

        // Observe all videos after mount
        videoRefs.current.forEach((vid) => observer.observe(vid))

        // Cleanup
        return () => observer.disconnect()
    }, [ videos ])

    useEffect(() => {
        axios.get("http://localhost:3000/api/food", { withCredentials: true })
            .then(response => {

                console.log(response.data);

                setVideos(response.data.foodItems)
            })
            .catch(() => { /* noop: optionally handle error */ })
    }, [])

    const setVideoRef = (id) => (el) => {
        if (!el) {
            videoRefs.current.delete(id)
            return
        }
        videoRefs.current.set(id, el)
    }

    async function likeVideo(item) {

        const response = await axios.post("http://localhost:3000/api/food/like", { foodId: item._id }, {withCredentials: true})

        if(response.data.like){
            console.log("Video liked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount + 1 } : v))
        }else{
            console.log("Video unliked");
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, likeCount: v.likeCount - 1 } : v))
        }
        
    }

    async function saveVideo(item) {
        const response = await axios.post("http://localhost:3000/api/food/save", { foodId: item._id }, { withCredentials: true })
        
        if(response.data.save){
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount + 1 } : v))
        }else{
            setVideos((prev) => prev.map((v) => v._id === item._id ? { ...v, savesCount: v.savesCount - 1 } : v))
        }
    }

    return (
        <div ref={containerRef} className="reels-page">
            <div className="reels-feed" role="list">
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
                                    <button onClick={() => likeVideo(item)} className="reel-action" aria-label="Like">
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                                        </svg>
                                    </button>
                                    <div className="reel-action__count">{item.likeCount ?? item.likes ?? 0}</div>
                                </div>

                                <div className="reel-action-group">
                                    <button className="reel-action" onClick={() => saveVideo(item)} aria-label="Bookmark">
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

export default Home