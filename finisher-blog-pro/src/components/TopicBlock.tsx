'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { BlogTopic } from '@/types/blog';
import { trackCTRClick } from '@/lib/analytics';

interface TopicBlockProps {
  topic: BlogTopic;
  blogId: string;
  index: number;
}

const TopicBlock = ({ topic, blogId, index }: TopicBlockProps) => {
  const handleCTRClick = async () => {
    if (topic.buttonEnabled && topic.buttonLink) {
      await trackCTRClick(blogId, topic.id);
      window.open(topic.buttonLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <article className="glass-card p-8 md:p-12 hover:shadow-2xl hover:shadow-blue-400/20 transition-all duration-500 border border-white/10">
        {/* Topic Image */}
        {topic.image && (
          <div className="relative h-80 mb-8 rounded-xl overflow-hidden shadow-2xl">
            <Image
              src={topic.image}
              alt={topic.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        )}

        {/* Topic Title */}
        <header className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 gradient-text leading-tight">
            {topic.title}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
        </header>

        {/* Topic Content */}
        <div 
          className="text-gray-200 leading-relaxed mb-8 prose prose-invert prose-lg max-w-none"
          style={{
            fontSize: '1.125rem',
            lineHeight: '1.8',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            color: '#e5e7eb'
          }}
          dangerouslySetInnerHTML={{ __html: topic.content }}
        />

        {/* CTR Button */}
        {topic.buttonEnabled && topic.buttonText && topic.buttonLink && (
          <footer className="pt-6 border-t border-white/10">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCTRClick}
              className="neon-button inline-flex items-center space-x-3 group px-6 py-3 text-base font-medium"
            >
              <span>{topic.buttonText}</span>
              <ExternalLink 
                size={18} 
                className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300" 
              />
            </motion.button>
          </footer>
        )}
      </article>
    </motion.div>
  );
};

export default TopicBlock;