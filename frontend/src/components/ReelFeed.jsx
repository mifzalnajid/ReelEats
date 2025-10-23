import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = "No videos yet." }) => {
  const videoRefs = useRef(new Map());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // ✅ Check login status
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/auth/check-auth`, { withCredentials: true })
      .then((res) => setIsLoggedIn(!!res.data.loggedIn))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // 🎥 Auto-play/pause videos when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!(video instanceof HTMLVideoElement)) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { });
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    );

    videoRefs.current.forEach((vid) => observer.observe(vid));
    return () => observer.disconnect();
  }, [items]);

  const setVideoRef = (id) => (el) => {
    if (!el) videoRefs.current.delete(id);
    else videoRefs.current.set(id, el);
  };

  // 🧭 Redirect if not logged in
  const handleLike = (item) => {
    if (!isLoggedIn) return navigate("/user/login");
    onLike?.(item);
  };

  const handleSave = (item) => {
    if (!isLoggedIn) return navigate("/user/login");
    onSave?.(item);
  };

  const handleVisitStore = (partnerId) => {
    if (!isLoggedIn) return navigate("/user/login");
    navigate(`/food-partner/${partnerId}`);
  };

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {/* ✅ Empty state */}
        {(!items || items.length === 0) && (
          <div className="empty-state">
            <p className="empty-text">{emptyMessage}</p>
            <p className="empty-subtext">Save some reels to see them here!</p>
          </div>
        )}

        {/* 🎥 Feed items */}
        {items.map((item) => (
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
                {/* ❤️ Like */}
                <div className="reel-action-group">
                  <button onClick={() => handleLike(item)} className="reel-action" aria-label="Like">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.likeCount ?? item.likes ?? 0}</div>
                </div>

                {/* 🔖 Save */}
                <div className="reel-action-group">
                  <button onClick={() => handleSave(item)} className="reel-action" aria-label="Save">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.savesCount ?? item.saves ?? 0}</div>
                </div>

                {/* 💬 Comments */}
                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">
                    {item.commentsCount ?? (item.comments?.length || 0)}
                  </div>
                </div>
              </div>

              <div className="reel-content">
                <p className="reel-description" title={item.description}>
                  {item.description}
                </p>

                {item.foodPartner && (
                  <button
                    onClick={() => handleVisitStore(item.foodPartner)}
                    className="reel-btn"
                    aria-label="Visit store"
                  >
                    Visit store
                  </button>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ReelFeed;
