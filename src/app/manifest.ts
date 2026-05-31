import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Goal Tracking - Relation Circle",
    short_name: "GoalTrack",
    description: "Track daily habits and savings goals",
    start_url: "/habits",
    display: "standalone",
    background_color: "#070b14",
    theme_color: "#F97316",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
