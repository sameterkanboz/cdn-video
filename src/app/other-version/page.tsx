"use client";

import { Close } from "@mui/icons-material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Box,
  Button,
  Container,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useRef, useState } from "react";

const videos = [
  {
    id: 1,
    src: "/videos/first.mp4",
    name: "Big Buck Bunny",
    placeholder: "/placeholder.svg?height=256&width=256",
  },
  {
    id: 2,
    src: "/videos/second.mp4",
    name: "Elephant's Dream",
    placeholder: "/placeholder.svg?height=256&width=256",
  },
  {
    id: 3,
    src: "/videos/third.mp4",
    name: "For Bigger Blazes",
    placeholder: "/placeholder.svg?height=256&width=256",
  },
];

const VideoContainer = styled(Box)<{ isExpanded: boolean }>(
  ({ theme, isExpanded }) => ({
    position: "fixed",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
    overflow: "hidden",
    transition: "all 0.3s ease-in-out",
    backgroundColor: theme.palette.grey[900],
    width: isExpanded ? "364px" : "256px",
    height: isExpanded ? "640px" : "256px",
    borderRadius: isExpanded ? "12px" : "50%",
    cursor: isExpanded ? "default" : "pointer",
  })
);

const VideoControls = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
}));

interface CustomButtonProps {
  isActive: boolean;
}

const CustomButton = styled((props: CustomButtonProps & any) => (
  <IconButton {...props} />
))(({ theme, isActive }) => ({
  width: "32px",
  height: "32px",
  backgroundColor: isActive ? theme.palette.common.white : "rgba(0, 0, 0, 0.5)",
  color: isActive ? theme.palette.common.black : theme.palette.common.white,
  "&:hover": {
    backgroundColor: isActive ? theme.palette.grey[200] : "rgba(0, 0, 0, 0.75)",
  },
}));

export default function Component() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustomButtons, setShowCustomButtons] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeVideo = (video: {
    id: number;
    src: string;
    name: string;
    placeholder: string;
  }) => {
    setCurrentVideo(video);
    setProgress(0);
    setIsPlaying(true);
    if (video.id !== 1) {
      setShowCustomButtons(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsPlaying(true);
      videoRef.current?.play();
    } else {
      setIsPlaying(false);
      videoRef.current?.pause();
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    const playVideo = async () => {
      if (videoElement && isExpanded) {
        try {
          await videoElement.play();
          setIsPlaying(true);
        } catch (error) {
          console.error("Autoplay failed:", error);
          setIsPlaying(false);
        }
      }
    };

    const updateProgress = () => {
      if (videoElement) {
        const currentProgress =
          (videoElement.currentTime / videoElement.duration) * 100;
        setProgress(currentProgress);
        if (
          currentVideo.id === 1 &&
          currentProgress >= 5 &&
          !showCustomButtons
        ) {
          setShowCustomButtons(true);
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    if (videoElement) {
      videoElement.addEventListener("timeupdate", updateProgress);
      videoElement.addEventListener("play", handlePlay);
      videoElement.addEventListener("pause", handlePause);
      if (isExpanded) {
        playVideo();
      }
    }

    return () => {
      if (videoElement) {
        videoElement.removeEventListener("timeupdate", updateProgress);
        videoElement.removeEventListener("play", handlePlay);
        videoElement.removeEventListener("pause", handlePause);
      }
    };
  }, [currentVideo, isExpanded]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button href="/" variant="contained">
        Go to Main Version
      </Button>
      <VideoContainer
        isExpanded={isExpanded}
        onClick={isExpanded ? undefined : toggleExpand}
      >
        {isExpanded ? (
          <video
            ref={videoRef}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            src={currentVideo.src}
            loop
            muted={isMuted}
            playsInline
          />
        ) : (
          <img
            src={
              "https://s3.amazonaws.com/blab-impact-published-production/nzuFH4rNd2xj2q6NNQmqRM65tPHkFQe2"
            }
            alt={currentVideo.name}
            style={{
              width: "80%",
              height: "100%",
              objectFit: "contain",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          />
        )}
        {isExpanded && showCustomButtons && (
          <Box
            sx={{
              position: "absolute",
              top: 48,
              left: 8,
              right: 8,
              display: "flex",
              justifyContent: "space-between",
              zIndex: 10,
            }}
          >
            {videos.map((video) => (
              <CustomButton
                key={video.id}
                onClick={() => changeVideo(video)}
                isActive={currentVideo.id === video.id}
                size="small"
              >
                {video.id}
              </CustomButton>
            ))}
          </Box>
        )}
        {isExpanded && (
          <>
            <IconButton
              onClick={toggleExpand}
              sx={{ color: "white", position: "absolute", top: 0, right: 0 }}
            >
              <Close />
            </IconButton>
            <VideoControls>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <IconButton onClick={togglePlay} sx={{ color: "white" }}>
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton onClick={toggleMute} sx={{ color: "white" }}>
                  {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "white",
                  },
                }}
              />
            </VideoControls>
          </>
        )}
      </VideoContainer>
    </Container>
  );
}
