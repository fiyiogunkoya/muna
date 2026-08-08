import {
  Award,
  Book,
  BookOpen,
  Briefcase,
  ClipboardCheck,
  Globe,
  GraduationCap,
  HandHeart,
  Heart,
  Home as HomeIcon,
  Library,
  Lightbulb,
  MessageCircle,
  Mic,
  Sparkles,
  Sprout,
  Stethoscope,
  Users,
  Utensils,
  type LucideIcon,
} from 'lucide-react'

const map: Record<string, LucideIcon> = {
  Heart,
  BookOpen,
  Book,
  Sprout,
  Users,
  Home: HomeIcon,
  Lightbulb,
  Globe,
  HandHeart,
  GraduationCap,
  Stethoscope,
  Utensils,
  Briefcase,
  Library,
  Award,
  ClipboardCheck,
  Mic,
  MessageCircle,
  Sparkles,
}

export function resolveIcon(name?: string | null): LucideIcon | null {
  if (!name) return null
  return map[name] ?? null
}
