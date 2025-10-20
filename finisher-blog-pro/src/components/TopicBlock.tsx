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
      await trackCTRClick(blogId);
      window.open(topic.buttonLink, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <div className="glass-card p-8 hover:shadow-lg hover:shadow-blue-400/10 transition-all duration-300">
        {/* Topic Image */}
        {topic.image && (
          <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
            <Image
              src={topic.image}
              alt={topic.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        )}

        {/* Topic Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 gradient-text">
          {topic.title}
        </h2>

        {/* Topic Content */}
        <div 
          className="text-gray-300 leading-relaxed mb-6 prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: topic.content }}
        />

        {/* CTR Button */}
        {topic.buttonEnabled && topic.buttonText && topic.buttonLink && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCTRClick}
            className="neon-button inline-flex items-center space-x-2 group"
          >
            <span>{topic.buttonText}</span>
            <ExternalLink 
              size={16} 
              className="group-hover:translate-x-1 transition-transform duration-200" 
            />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default TopicBlock;