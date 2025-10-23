import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/reels.css";
import ReelFeed from "../../components/ReelFeed";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [videos, setVideos] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    // ✅ Always include cookies in axios calls
    axios.defaults.withCredentials = true;

    // ✅ Fetch videos
    useEffect(() => {
        axios
            .get(`${backendUrl}/api/food`, { withCredentials: true })
            .then((res) => {
                setVideos(res.data.foodItems || res.data.foods || []);
            })
            .catch((err) => {
                console.error("Error fetching videos:", err);
            });
    }, []);

    // ✅ Handle unauthorized cases
    const handleUnauthorized = (error) => {
        if (error.response && error.response.status === 401) {
            navigate("/user/login");
        } else {
            console.error("Request failed:", error);
        }
    };

    // ❤️ Like food
    const likeVideo = async (item) => {
        try {
            const res = await axios.post(
                `${backendUrl}/api/food/like`,
                { foodId: item._id },
                { withCredentials: true }
            );

            const isLiked = res.data.like;
            setVideos((prev) =>
                prev.map((v) =>
                    v._id === item._id
                        ? { ...v, likeCount: v.likeCount + (isLiked ? 1 : -1) }
                        : v
                )
            );
        } catch (error) {
            handleUnauthorized(error);
        }
    };

    // 🔖 Save food
    const saveVideo = async (item) => {
        try {
            const res = await axios.post(
                `${backendUrl}/api/food/save`,
                { foodId: item._id },
                { withCredentials: true }
            );

            const isSaved = res.data.save;
            setVideos((prev) =>
                prev.map((v) =>
                    v._id === item._id
                        ? { ...v, savesCount: v.savesCount + (isSaved ? 1 : -1) }
                        : v
                )
            );
        } catch (error) {
            handleUnauthorized(error);
        }
    };

    return (
        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />
    );
};

export default Home;
