import React from 'react';
import {
    Shield, Lock, Globe, Target, PieChart as PieChartLucideIcon, Users, Search, Flag, BarChartBig, Gavel, MessageSquare,
    Twitter, Facebook, Linkedin, Instagram, MapPin, Phone, Mail, Send, Star as StarIcon, CheckCircle
} from 'lucide-react';

interface IconMapperProps {
    iconClass?: string;
    className?: string;
    style?: React.CSSProperties;
}

const IconMapper: React.FC<IconMapperProps> = (props) => {
    const { iconClass, className, style } = props;
    const defaultClassName = className || "w-5 h-5";
    if (!iconClass) return <CheckCircle className={defaultClassName} style={style} />; // Default icon

    if (iconClass.includes('fa-shield-alt')) return <Shield className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-lock')) return <Lock className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-globe')) return <Globe className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-bullseye')) return <Target className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-chart-pie')) return <PieChartLucideIcon className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-users')) return <Users className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-search')) return <Search className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-flag')) return <Flag className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-chart-bar')) return <BarChartBig className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-gavel')) return <Gavel className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-comments')) return <MessageSquare className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-twitter')) return <Twitter className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-facebook-f') || iconClass.includes('fa-facebook')) return <Facebook className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-linkedin-in') || iconClass.includes('fa-linkedin')) return <Linkedin className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-instagram')) return <Instagram className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-map-marker-alt')) return <MapPin className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-phone-alt')) return <Phone className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-envelope')) return <Mail className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-paper-plane')) return <Send className={defaultClassName} style={style} />;
    if (iconClass.includes('fa-star')) return <StarIcon className={defaultClassName} style={style} />;

    console.warn("Unmapped icon class:", iconClass);
    return <CheckCircle className={defaultClassName} style={style} />;
};

export default IconMapper;
