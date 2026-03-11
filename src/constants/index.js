import {
  GiAndroidMask,
  GiBarStool,
  GiCloudDownload,
  GiCoaDeJima,
  GiGlobe,
  GiPalette,
} from "react-icons/gi";
import {
  MdPlayCircle,
  MdVerified,
  MdTrendingUp,
  MdAccessTime,
  MdDevices,
  MdEmojiEvents,
} from "react-icons/md";

export const features = [
  {
    icon: MdPlayCircle,
    title: "HD Video Lessons",
    desc: "Crystal-clear video content with subtitles and playback controls.",
  },
  {
    icon: MdVerified,
    title: "Certified Instructors",
    desc: "Every instructor is vetted and approved by our academic team.",
  },
  {
    icon: MdDevices,
    title: "Learn Anywhere",
    desc: "Access your courses on any device, anytime, even offline.",
  },
  {
    icon: MdTrendingUp,
    title: "Track Progress",
    desc: "Visual dashboards to keep you motivated and on track.",
  },
  {
    icon: MdAccessTime,
    title: "Learn at Your Pace",
    desc: "No deadlines. No pressure. Learn when it works for you.",
  },
  {
    icon: MdEmojiEvents,
    title: "Earn Certificates",
    desc: "Get recognized with shareable certificates on completion.",
  },
];

export const stats = [
  { value: "50K+", label: "Students" },
  { value: "1,200+", label: "Courses" },
  { value: "300+", label: "Instructors" },
  { value: "4.8★", label: "Avg Rating" },
];

export const categories = [
  { name: "Web Development", icon: GiGlobe },
  { name: "Data Science", icon: GiBarStool },
  { name: "Design", icon: GiPalette },
  { name: "Mobile Development", icon: GiAndroidMask },
  { name: "Cloud Computing", icon: GiCloudDownload },
  { name: "Programming", icon: GiCoaDeJima },
];
