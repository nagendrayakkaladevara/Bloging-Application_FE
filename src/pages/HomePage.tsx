/**
 * HomePage Component
 * 
 * Displays a catalogue/list of all available blogs.
 */

import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BlogPreview } from "@/types/blog";
import { Calendar, Clock, User } from "lucide-react";

interface HomePageProps {
  blogs: BlogPreview[];
}

export function HomePage({ blogs }: HomePageProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Blog Catalogue</h1>
          <p className="text-muted-foreground">
            Explore our collection of articles and insights
          </p>
        </header>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blogs available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link key={blog.id} to={`/blog/${blog.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  {blog.meta.coverImage && (
                    <img
                      src={blog.meta.coverImage}
                      alt={blog.meta.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{blog.meta.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {blog.meta.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{blog.meta.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(blog.meta.publishedAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{blog.meta.readTime} min</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

