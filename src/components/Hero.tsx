/**
 * Hero Component
 * 
 * Hero section for the home page with call-to-action buttons.
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PointerHighlight } from "./ui/pointer-highlight";

export function Hero() {
  const handleScrollToBlogs = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const blogsSection = document.getElementById("blogs");
    if (blogsSection) {
      const firstBlogCard = blogsSection.querySelector("a");
      if (firstBlogCard) {
        firstBlogCard.scrollIntoView({ 
          behavior: "smooth", 
          block: "start",
          inline: "nearest"
        });
      } else {
        blogsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dot pattern background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] dark:opacity-[0.2]" />
      
      <motion.div 
        className="relative z-10 text-center max-w-3xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Badge
            variant="secondary"
            className="rounded-full py-1 border-border mb-6"
            asChild
          >
            <Link to="/" className="flex items-center">
              Just released v1.0.0 <ArrowUpRight className="ml-1 h-4 w-4" />
            </Link>
          </Badge>
        </motion.div>
        <motion.h1 
          className="mt-6 text-3xl sm:text-3xl md:text-4xl lg:text-5xl md:leading-[1.2] font-semibold tracking-tighter"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Welcome to my blog <br />{`<Sai Nagendra Yakkadevara />`}
        </motion.h1>
        <motion.p 
          className="mt-6 md:text-lg text-foreground/80"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          This is my blogging platform where I share<PointerHighlight
            rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
            pointerClassName="text-blue-500 h-3 w-3"
            containerClassName="inline-block mx-1"
          >
            <span className="relative z-10 px-1.5"> tools and resources </span>
          </PointerHighlight>that I find useful.
        </motion.p>
        <motion.div 
          className="mt-12 flex items-center justify-center gap-4 flex-wrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button size="lg" className="rounded-full text-base" asChild>
            <a href="#blogs" onClick={handleScrollToBlogs}>
              Explore Blogs <ArrowUpRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <div className="relative inline-block">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
              asChild
            >
              <a href="#blogs" onClick={handleScrollToBlogs} className="flex items-center gap-2">
                <CirclePlay className="h-5 w-5" /> View Portfolio
              </a>
            </Button>
            <Badge 
              variant="default"
              className="absolute -top-2 -right-2 text-xs"
            >
              Coming Soon
            </Badge>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

