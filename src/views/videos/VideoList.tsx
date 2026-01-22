"use client";

import YouTubeEmbed from "@components/components/YouTubeEmbed";
import { useDisclosure } from "@components/hooks/useDisclosure";
import React, { useEffect, useState, useCallback } from "react";
import { db } from "@components/configs/firebase";
import { collection, getDocs } from "firebase/firestore";
import VideoShimmer from "./VideoShimmer";

interface VideoItemsProps {
  title: string;
  videoId: string;
  order: number;
}

const VideoList = () => {
  const [videos, setVideos] = useState<VideoItemsProps[]>([]);

  const [isLoading, handle] = useDisclosure(true);
  const getVideos = useCallback(async () => {
    try {
      handle.open();
      const querySnapshot = await getDocs(collection(db, "videos"));
      querySnapshot.forEach((doc) => {
        setVideos((prev) => [...prev, doc.data() as VideoItemsProps]);
      });
      handle.close();
    } catch (error) {
      handle.close();
      console.log(error);
      alert("Failed to fetch data");
    }
  }, [handle]);

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  if (isLoading) {
    return <VideoShimmer />;
  }
  return (
    <div className="flex flex-col gap-4 mt-8">
      {videos
        .sort((a, b) => b.order - a.order)
        .map((video) => (
          <YouTubeEmbed
            key={video.videoId}
            title={video.title}
            videoId={video.videoId}
          />
        ))}
    </div>
  );
};

export default VideoList;
