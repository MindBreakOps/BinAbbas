import React from 'react';
import { 
  Home, Users, Calendar, FileText, Newspaper, Banknote, Settings, 
  Plus, Printer, Save, Trash2, LogOut, User, Shuffle, BookOpen, 
  Check, RefreshCw, Heart, Edit, LayoutGrid, Search, Award, 
  FileSpreadsheet, Receipt, Moon, Sun, Bell, MessageCircle, 
  Compass, MoonStar, HelpCircle
} from 'lucide-react';

// THIS WAS MISSING! Vite was crashing because this didn't exist.
export type IconName = 
  | 'home' | 'users' | 'cal' | 'file' | 'news' | 'money' | 'cog' 
  | 'plus' | 'print' | 'save' | 'trash' | 'logout' | 'user' 
  | 'shuffle' | 'book' | 'check' | 'refresh' | 'heart' | 'edit' 
  | 'grid' | 'search' | 'award' | 'xl' | 'invoice' | 'moon' 
  | 'sun' | 'bell' | 'whatsapp' | 'compass' | 'mosque';

const iconMap: Record<IconName, React.ElementType> = {
  home: Home,
  users: Users,
  cal: Calendar,
  file: FileText,
  news: Newspaper,
  money: Banknote,
  cog: Settings,
  plus: Plus,
  print: Printer,
  save: Save,
  trash: Trash2,
  logout: LogOut,
  user: User,
  shuffle: Shuffle,
  book: BookOpen,
  check: Check,
  refresh: RefreshCw,
  heart: Heart,
  edit: Edit,
  grid: LayoutGrid,
  search: Search,
  award: Award,
  xl: FileSpreadsheet,
  invoice: Receipt,
  moon: Moon,
  sun: Sun,
  bell: Bell,
  whatsapp: MessageCircle,
  compass: Compass,
  mosque: MoonStar,
};

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 20, color = 'currentColor', className, ...props }: IconProps) {
  const LucideIcon = iconMap[name] || HelpCircle;
  
  return (
	<LucideIcon 
	  size={size} 
	  color={color} 
	  className={className} 
	  {...(props as any)} 
	/>
  );
}