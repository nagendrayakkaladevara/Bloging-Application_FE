/**
 * SocialShare Component
 * 
 * Handles social media sharing functionality.
 */

import type { BlogSocialShare, SocialPlatform } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Twitter, Facebook, Linkedin, MessageSquare, Link2 } from "lucide-react";

interface SocialShareProps {
  socialShare: BlogSocialShare;
  url?: string;
  title?: string;
}

const platformIcons: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  twitter: Twitter,
  facebook: Facebook,
  linkedin: Linkedin,
  reddit: MessageSquare, // Using MessageSquare as alternative to Reddit icon
  copy: Link2,
};

const platformLabels: Record<SocialPlatform, string> = {
  twitter: "Twitter",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  reddit: "Reddit",
  copy: "Copy Link",
};

export function SocialShare({ socialShare, url, title }: SocialShareProps) {
  if (!socialShare.enabled || socialShare.platforms.length === 0) {
    return null;
  }

  const handleShare = (platform: SocialPlatform) => {
    const shareUrl = url || window.location.href;
    const shareTitle = title || document.title;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "reddit":
        window.open(
          `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        break;
    }
  };

  return (
    <Card className="my-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Share</span>
        </div>
        <div className="flex flex-wrap gap-2">
        {socialShare.platforms.map((platform) => {
          const Icon = platformIcons[platform];
          return (
            <Button
              key={platform}
              variant="outline"
              size="sm"
              onClick={() => handleShare(platform)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              <span>{platformLabels[platform]}</span>
            </Button>
          );
        })}
        </div>
      </CardContent>
    </Card>
  );
}

