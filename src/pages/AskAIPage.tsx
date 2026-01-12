/**
 * AskAIPage Component
 * 
 * A modern AI chat interface that matches the application's aesthetic.
 * Features a clean chat UI with message history and input field.
 */

import * as React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Send, 
  User,
  Loader2,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import type { BlogPreview, Blog } from "@/types/blog";
import { mockBlogs } from "@/data/mockBlogs";

interface AskAIPageProps {
  blogs: BlogPreview[];
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function AskAIPage({ blogs }: AskAIPageProps) {
  const { open } = useSidebar();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);


  // Auto-scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Helper function to extract text content from blog blocks
  const extractBlogContent = (blog: Blog): string => {
    let content = `${blog.meta.title}. ${blog.meta.description}. `;
    blog.blocks.forEach((block) => {
      if (block.type === "paragraph") {
        content += block.text + " ";
      } else if (block.type === "heading") {
        content += block.text + " ";
      } else if (block.type === "list") {
        content += block.items.join(" ") + " ";
      } else if (block.type === "quote") {
        content += block.text + " ";
      } else if (block.type === "callout") {
        content += (block.title || "") + " " + block.content + " ";
      }
    });
    return content.toLowerCase();
  };

  // Helper function to find relevant blogs based on question
  const findRelevantBlogs = (question: string): Blog[] => {
    const keywords = question.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    return mockBlogs.filter(blog => {
      const content = extractBlogContent(blog);
      const title = blog.meta.title.toLowerCase();
      const description = blog.meta.description.toLowerCase();
      const tags = blog.tags.map(t => t.toLowerCase()).join(" ");
      
      const searchText = title + " " + description + " " + tags + " " + content;
      return keywords.some(keyword => searchText.includes(keyword));
    });
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase().trim();

    // Latest blog posts - check for blog/post related keywords
    if (
      (lowerQuestion.includes("latest") || lowerQuestion.includes("recent") || lowerQuestion.includes("new")) &&
      (lowerQuestion.includes("blog") || lowerQuestion.includes("post") || lowerQuestion.includes("article"))
    ) {
      if (blogs.length === 0) {
        return "I've searched through your blog content, but I couldn't find any blog posts at the moment. Please check back later!";
      }
      
      const latestBlogs = blogs
        .sort((a, b) => new Date(b.meta.publishedAt).getTime() - new Date(a.meta.publishedAt).getTime())
        .slice(0, 3);
      
      let response = "After reviewing your blog content, here are the latest blog posts:\n\n";
      latestBlogs.forEach((blog, index) => {
        const date = new Date(blog.meta.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        response += `${index + 1}. **${blog.meta.title}**\n   Published: ${date} | ${blog.meta.readTime} min read\n   ${blog.meta.description}\n\n`;
      });
      return response.trim();
    }

    // Find relevant blogs for the question
    const relevantBlogs = findRelevantBlogs(question);
    
    // Animations
    if (lowerQuestion.includes("animation") || lowerQuestion.includes("animate") || lowerQuestion.includes("animating")) {
      const tailwindBlog = mockBlogs.find(b => b.meta.title.toLowerCase().includes("tailwind"));
      let response = "After searching through your blog posts, I found relevant information about animations.\n\n";
      
      if (tailwindBlog) {
        response += `In your blog post **"${tailwindBlog.meta.title}"**, you discuss Tailwind CSS which provides utility classes for transitions and animations. `;
        
        // Extract relevant paragraphs
        const animationParagraphs = tailwindBlog.blocks
          .filter(b => b.type === "paragraph")
          .map(b => b as { type: "paragraph"; text: string })
          .filter(b => b.text.toLowerCase().includes("animation") || b.text.toLowerCase().includes("transition"))
          .slice(0, 1);
        
        if (animationParagraphs.length > 0) {
          response += `As mentioned: "${animationParagraphs[0].text}"\n\n`;
        }
      }
      
      response += `Based on your blog content and tech stack, here are recommendations:\n\n`;
      response += `1. **Framer Motion** - Your application already uses this for React animations\n`;
      response += `2. **Tailwind CSS Animations** - As covered in your Tailwind blog, use utility classes for simple effects\n`;
      response += `3. **CSS Transitions** - Built-in browser support for smooth animations\n\n`;
      response += `Your current setup with React + TypeScript + Tailwind CSS works well with Framer Motion for complex animations and Tailwind utilities for simple effects.`;
      
      return response;
    }

    // Icon libraries
    if (lowerQuestion.includes("icon") || lowerQuestion.includes("icons")) {
      let response = "After searching through your blog content, I found information about icon libraries.\n\n";
      
      const reactBlog = mockBlogs.find(b => b.meta.title.toLowerCase().includes("react"));
      if (reactBlog) {
        response += `In your blog post **"${reactBlog.meta.title}"**, you discuss React and TypeScript development. `;
        response += `Your application uses Lucide React icons, which is an excellent choice for React projects.\n\n`;
      }
      
      response += `Here are icon library recommendations based on your tech stack:\n\n`;
      response += `1. **Lucide React** - Currently in use, provides 1000+ icons with TypeScript support\n`;
      response += `2. **React Icons** - Popular library with multiple icon sets\n`;
      response += `3. **Heroicons** - Created by Tailwind CSS team, perfect for Tailwind projects\n`;
      response += `4. **Radix Icons** - Part of the Radix UI ecosystem\n\n`;
      response += `Since you're using React + TypeScript, Lucide React is a great fit. Consider Heroicons if you want something specifically designed for Tailwind CSS.`;
      
      return response;
    }

    // UI libraries
    if (
      lowerQuestion.includes("ui library") || 
      lowerQuestion.includes("ui component") || 
      lowerQuestion.includes("component library") ||
      (lowerQuestion.includes("ui") && lowerQuestion.includes("library")) ||
      (lowerQuestion.includes("good") && lowerQuestion.includes("ui") && lowerQuestion.includes("library"))
    ) {
      const configBlog = mockBlogs.find(b => b.meta.title.toLowerCase().includes("configuration"));
      let response = "After analyzing your blog content, I found relevant information about UI libraries.\n\n";
      
      if (configBlog) {
        response += `In your blog post **"${configBlog.meta.title}"**, you discuss configuration-driven UI architecture. `;
        
        // Extract relevant content about UI
        const uiParagraphs = configBlog.blocks
          .filter(b => b.type === "paragraph")
          .map(b => b as { type: "paragraph"; text: string })
          .filter(b => b.text.toLowerCase().includes("component") || b.text.toLowerCase().includes("ui"))
          .slice(0, 1);
        
        if (uiParagraphs.length > 0) {
          response += `As you mention: "${uiParagraphs[0].text.substring(0, 150)}..."\n\n`;
        }
      }
      
      response += `Based on your blog content, here are UI library recommendations:\n\n`;
      response += `1. **shadcn/ui** - You're currently using this! It's perfect because:\n`;
      response += `   - Built on Radix UI primitives\n`;
      response += `   - Fully customizable with Tailwind CSS\n`;
      response += `   - Copy-paste components (not a dependency)\n`;
      response += `   - TypeScript-first\n\n`;
      response += `2. **Radix UI** - The foundation of shadcn/ui\n`;
      response += `3. **Mantine** - Comprehensive React component library\n`;
      response += `4. **Chakra UI** - Simple and modular\n\n`;
      response += `Your "Building Configuration-Driven UIs" blog post aligns perfectly with shadcn/ui's approach, giving you maximum flexibility.`;
      
      return response;
    }

    // Search for relevant blogs and extract information
    if (relevantBlogs.length > 0) {
      let response = `After searching through your blog content, I found ${relevantBlogs.length} relevant ${relevantBlogs.length === 1 ? 'post' : 'posts'}:\n\n`;
      
      relevantBlogs.slice(0, 3).forEach((blog, index) => {
        response += `**${index + 1}. ${blog.meta.title}**\n`;
        response += `${blog.meta.description}\n\n`;
        
        // Extract key information from blog content
        const paragraphs = blog.blocks
          .filter(b => b.type === "paragraph")
          .map(b => (b as { type: "paragraph"; text: string }).text)
          .slice(0, 2);
        
        if (paragraphs.length > 0) {
          response += `Key points from this post:\n`;
          paragraphs.forEach((para) => {
            response += `- ${para.substring(0, 200)}${para.length > 200 ? '...' : ''}\n`;
          });
          response += `\n`;
        }
      });
      
      return response.trim();
    }

    // Default response with blog topics
    const allTopics = [...new Set(mockBlogs.flatMap(b => b.tags))];
    let response = `I've reviewed your blog content. You have ${mockBlogs.length} blog posts covering various topics.\n\n`;
    response += `Your blog covers:\n`;
    allTopics.slice(0, 8).forEach(tag => {
      response += `- ${tag}\n`;
    });
    response += `\nCould you ask a more specific question? For example:\n`;
    response += `- "Tell me about React and TypeScript"\n`;
    response += `- "What does your Tailwind CSS blog say?"\n`;
    response += `- "Explain configuration-driven UI"\n`;
    response += `\nI'll search through the relevant blog posts and provide detailed information!`;
    
    return response;
  };

  const sendMessage = (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: question.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      try {
        const responseContent = generateAIResponse(userMessage.content);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        console.error("Error generating AI response:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I apologize, but I encountered an error while processing your question. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const question = input.trim();
    setInput("");
    sendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      <AppSidebar blogs={blogs} />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4 bg-background">
          {!open ? (
            <SidebarTrigger className="-ml-1" aria-label="Open sidebar" />
          ) : null}
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-sm">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm">Ask AI</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col h-[calc(100vh-3.5rem)] overflow-hidden">
          {/* Clear Chat Button - Top Right */}
          {messages.length > 0 && (
            <div className="flex justify-end p-2 sm:p-4 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-xs sm:text-sm"
              >
                Clear Chat
              </Button>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 lg:p-8 min-h-0">
            {messages.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full border bg-muted mb-4"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 px-2">Start a conversation</h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
                  Ask me your question and I will go though the blogs and give you the best answer.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-md px-2">
                  {[
                    "What are the latest blog posts?",
                    "I want to implement animations in my website",
                    "Suggest me icon libraries for my website",
                    "Looking for a good UI library for my website",
                  ].map((suggestion, index) => (
                    <motion.button
                      key={suggestion}
                      type="button"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => sendMessage(suggestion)}
                      className="p-2.5 sm:p-3 text-left text-xs sm:text-sm border rounded-md hover:bg-accent transition-colors wrap-break-word"
                    >
                      {suggestion}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-2 sm:gap-4 max-w-3xl mx-auto w-full">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 sm:gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <motion.div
                        className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border bg-primary/10 shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      </motion.div>
                    )}
                    <Card
                      className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      }`}
                    >
                      <CardContent className="p-2.5 sm:p-3 md:p-4">
                        <div className="flex items-start gap-1.5 sm:gap-2">
                          {message.role === "user" && (
                            <User className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                          )}
                          {message.role === "assistant" ? (
                            <div className="text-xs sm:text-sm md:text-base leading-relaxed [&>p]:my-2 [&>p]:leading-relaxed [&>strong]:font-semibold [&>ul]:my-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:space-y-1 [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:space-y-1 [&>li]:my-1 [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:my-3 [&>h2]:text-base [&>h2]:font-semibold [&>h2]:my-3 [&>h3]:text-sm [&>h3]:font-semibold [&>h3]:my-3 [&>code]:text-xs [&>code]:bg-muted [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:font-mono [&>pre]:bg-muted [&>pre]:p-2 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>a]:text-primary [&>a]:no-underline hover:[&>a]:underline [&>blockquote]:border-l-4 [&>blockquote]:border-border [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-2">
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm md:text-base whitespace-pre-wrap wrap-break-word leading-relaxed">
                              {message.content}
                            </p>
                          )}
                        </div>
                        <p className="text-[10px] sm:text-xs opacity-70 mt-1.5 sm:mt-2">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </CardContent>
                    </Card>
                    {message.role === "user" && (
                      <motion.div
                        className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border bg-muted shrink-0"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                      </motion.div>
                    )}
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    className="flex gap-2 sm:gap-3 justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full border bg-primary/10 shrink-0">
                      <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <Card className="bg-card max-w-[75%] sm:max-w-[70%]">
                      <CardContent className="p-2.5 sm:p-3 md:p-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-muted-foreground" />
                          <p className="text-xs sm:text-sm text-muted-foreground">Thinking...</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-2 sm:p-4 md:p-6 lg:p-8 bg-background shrink-0">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..."
                    className="min-h-[50px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] resize-none pr-12 sm:pr-16 text-sm sm:text-base"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 h-7 w-7 sm:h-9 sm:w-9"
                    disabled={!input.trim() || isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                  </Button>
                </div>
              </form>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 text-center">
                AI responses are simulated. We are working on the actual AI service.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

