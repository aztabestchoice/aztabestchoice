/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MOCK_BLOGS } from '../mockData';
import { BlogArticle, SiteSettings } from '../types';
import { BookOpen, Calendar, User, Clock, ArrowLeft, ArrowRight, Tag } from 'lucide-react';

interface BlogPageProps {
  siteSettings?: SiteSettings;
}

export default function BlogPage({ siteSettings }: BlogPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Tips Psikotes' | 'Kesehatan Mental' | 'Informasi Seleksi'>('All');
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  const activeBlogs = siteSettings?.blogs && siteSettings.blogs.length > 0
    ? siteSettings.blogs
    : MOCK_BLOGS;

  // Filter based on state selection
  const filteredBlogs = selectedCategory === 'All'
    ? activeBlogs 
    : activeBlogs.filter(blog => blog.category === selectedCategory);

  const categories = ['All', 'Tips Psikotes', 'Kesehatan Mental', 'Informasi Seleksi'] as const;

  // Render Full Article Details View
  if (activeArticle) {
    return (
      <div className="bg-slate-50 py-12 px-4 font-sans animate-fade-in" id="blog-reader-view">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          
          {/* Article Banner Header Graphic/Cover */}
          <div className="h-64 sm:h-96 relative">
            <img 
              src={activeArticle.image} 
              alt={activeArticle.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {/* dark contrast gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
            
            {/* Category floating button */}
            <div className="absolute bottom-6 left-6 flex items-center space-x-2">
              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${activeArticle.categoryColor} z-10`}>
                {activeArticle.category}
              </span>
              <span className="text-xs text-slate-300 font-medium z-10 font-mono">
                {activeArticle.readTime}
              </span>
            </div>
          </div>

          {/* Reader Core Area */}
          <div className="p-6 sm:p-10 space-y-6 text-left">
            <button
              onClick={() => { setActiveArticle(null); window.scrollTo({ top: 0, behavior: 'instant' }); }}
              className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-900 hover:text-amber-600 transition-colors"
              id="back-to-blogs-list"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali Ke Daftar Artikel</span>
            </button>

            <h1 className="font-sans font-extrabold text-2xl sm:text-4xl text-slate-950 leading-tight">
              {activeArticle.title}
            </h1>

            {/* Author Date Metadata info */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400 border-y border-gray-100 py-3 font-mono">
              <div className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5" />
                <span>Oleh: {activeArticle.author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Tanggal: {activeArticle.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimasi: {activeArticle.readTime}</span>
              </div>
            </div>

            {/* Simulated HTML / Rich text representation */}
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed font-sans space-y-4 whitespace-pre-line" id="article-body">
              {activeArticle.content}
            </div>

            {/* Tags footer row */}
            <div className="pt-6 border-t border-gray-100" id="article-tags-row">
              <h4 className="text-xs font-bold text-slate-650 uppercase tracking-wider mb-2 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Kata Kunci Artikel:</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeArticle.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-slate-100 border border-slate-205 text-[10px] sm:text-xs font-medium text-slate-600 rounded-lg font-mono"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Render Category Listings Grid
  return (
    <div className="bg-slate-50 py-12 px-4 font-sans" id="blog-category-listings">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs text-emerald-800 font-bold uppercase tracking-widest block mb-1">
            Media Publikasi & Sains Edukatif
          </span>
          <h1 className="font-sans font-extrabold text-3xl sm:text-5xl text-emerald-950 tracking-tight">
            Artikel Informasi & Edukasi Azta
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Bagian dari misi optimasi potensi diri: bimbingan tips psikotes, kesiapan mental, dan pengarahan seleksi abdi negara.
          </p>
        </div>

        {/* Category Filters Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" id="blog-category-selectors">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all border ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-600'
              }`}
            >
              {cat === 'All' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Article Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="blog-items-grid">
          {filteredBlogs.map((article) => (
            <article 
              key={article.id} 
              className="bg-white border border-gray-150 rounded-2xl overflow-hidden hover:shadow-md hover:border-emerald-700/20 transition-all flex flex-col h-full group"
            >
              {/* Blog Image Cover */}
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Float tag */}
                <span className={`absolute top-4 left-4 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${article.categoryColor}`}>
                  {article.category}
                </span>
              </div>

              {/* Blog Content Summary Block */}
              <div className="p-6 flex flex-col justify-between flex-grow text-left">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1.5 text-[10px] text-gray-400 font-mono">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>

                  <h3 className="font-sans font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors text-base line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-6">
                  <span className="text-[10px] text-gray-450 font-semibold font-mono">
                    Oleh: {article.author}
                  </span>
                  
                  <button
                    onClick={() => { setActiveArticle(article); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center space-x-1 text-xs text-emerald-800 font-bold hover:text-amber-600 transition-colors"
                  >
                    <span>Baca Artikel</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
