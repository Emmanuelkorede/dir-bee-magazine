import React, { useState } from 'react';
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Send, Sparkles, Music, Link, User, MapPin } from "lucide-react";

export default function GetFeatured() {
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    location: '',
    projectType: 'Music Release (Single/EP/Album)',
    projectLink: '',
    pitch: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const editorialEmail = "officialdirectorbee@gmail.com"; 
    
    const subject = `Feature Submission: ${formData.artistName} (${formData.projectType})`;
    
    const body = `EDITORIAL FEATURE SUBMISSION
--------------------------------------------------
Artist/Brand Name: ${formData.artistName}
Contact Email: ${formData.email}
Location: ${formData.location}
Submission Type: ${formData.projectType}
Project/Portfolio Link: ${formData.projectLink}

THE PITCH & CONCEPT:
${formData.pitch}
--------------------------------------------------
Sent via Bee Magazine Submission Portal.`;

    // Encode strings safely for standard browser mailto links
    const mailtoUrl = `mailto:${editorialEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Trigger the client's default mail application
    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-burnt-brown selection:text-canvas">
      <Header />

      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 xl:gap-14">
          
          {/* Left Column: Brief Portal Submission Guidelines */}
          <div className="md:col-span-4 space-y-4">
            <span className="font-sans text-[10px] font-extrabold tracking-widest uppercase text-burnt-brown block">
              Submissions Open
            </span>
            <h1 className="font-serif text-3xl font-black tracking-tight leading-tight text-ink">
              Pitch to the Archive
            </h1>
            <p className="font-serif text-xs sm:text-sm text-muted-ink leading-relaxed">
              We catalog immersive worlds, sonic depth, and supernatural visual languages. Whether you are an artist, director, or visual strategist, submit your project for editorial consideration.
            </p>
            <div className="p-4 border border-[#E5E2DA] bg-[#FDFDFC] rounded-sm space-y-2">
              <span className="font-sans text-[8px] font-bold tracking-widest uppercase text-burnt-brown block">
                Note on Submissions
              </span>
              <p className="font-serif text-[11px] text-ink/70 leading-relaxed">
                Submitting opens your device's  email client with a pre-formatted structure. Review and send it directly from your inbox.
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Submission Form Frame */}
          <div className="md:col-span-8 border border-[#E5E2DA] bg-[#FDFDFC] p-6 sm:p-8 rounded-sm shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Artist / Brand Name */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink flex items-center gap-1.5">
                    <User className="w-3 h-3 text-burnt-brown" /> Creator / Artist Name *
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    required
                    value={formData.artistName}
                    onChange={handleChange}
                    placeholder="e.g. Director Bee"
                    className="w-full bg-canvas text-ink font-serif text-sm border border-[#E5E2DA] p-3 focus:outline-hidden focus:border-burnt-brown focus:ring-1 focus:ring-burnt-brown transition-all rounded-sm"
                  />
                </div>

                {/* Email Contact */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink flex items-center gap-1.5">
                    <Send className="w-3 h-3 text-burnt-brown" /> Contact Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@domain.com"
                    className="w-full bg-canvas text-ink font-serif text-sm border border-[#E5E2DA] p-3 focus:outline-hidden focus:border-burnt-brown focus:ring-1 focus:ring-burnt-brown transition-all rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Location Base */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-burnt-brown" /> Location Base *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Lagos, Nigeria"
                    className="w-full bg-canvas text-ink font-serif text-sm border border-[#E5E2DA] p-3 focus:outline-hidden focus:border-burnt-brown focus:ring-1 focus:ring-burnt-brown transition-all rounded-sm"
                  />
                </div>

                {/* Project Focus Type */}
                <div className="space-y-1.5">
                  <label className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink flex items-center gap-1.5">
                    <Music className="w-3 h-3 text-burnt-brown" /> Project Category *
                  </label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="w-full bg-canvas text-ink font-serif text-sm border border-[#E5E2DA] p-3 focus:outline-hidden focus:border-burnt-brown focus:ring-1 focus:ring-burnt-brown transition-all rounded-sm appearance-none"
                  >
                    <option value="Music Release (Single/EP/Album)">Music Release (Single/EP/Album)</option>
                    <option value="Visual Direction / Music Video">Visual Direction / Music Video</option>
                    <option value="Visual Identity & Design Rollout">Visual Identity & Design Rollout</option>
                    <option value="Editorial Interview Request">Editorial Interview Request</option>
                    <option value="Brand / Creative Collaboration">Brand / Creative Collaboration</option>
                  </select>
                </div>
              </div>

              {/* Streaming or Portfolio Assets Link */}
              <div className="space-y-1.5">
                <label className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink flex items-center gap-1.5">
                  <Link className="w-3 h-3 text-burnt-brown" /> Project Link / Portfolio Track *
                </label>
                <input
                  type="url"
                  name="projectLink"
                  required
                  value={formData.projectLink}
                  onChange={handleChange}
                  placeholder="SoundCloud, YouTube, Spotify, or Google Drive link"
                  className="w-full bg-canvas text-ink font-serif text-sm border border-[#E5E2DA] p-3 focus:outline-hidden focus:border-burnt-brown focus:ring-1 focus:ring-burnt-brown transition-all rounded-sm"
                />
              </div>

              {/* Pitch Brief text box description */}
              <div className="space-y-1.5">
                <label className="font-sans text-[9px] font-extrabold tracking-widest uppercase text-muted-ink flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-burnt-brown" /> The Narrative & Concept *
                </label>
                <textarea
                  name="pitch"
                  required
                  rows={6}
                  value={formData.pitch}
                  onChange={handleChange}
                  placeholder="Describe the conceptual direction of the project, your narrative inspirations, and why it belongs in the Bee Magazine archive..."
                  className="w-full bg-canvas text-ink font-serif text-sm border border-[#E5E2DA] p-3 focus:outline-hidden focus:border-burnt-brown focus:ring-1 focus:ring-burnt-brown transition-all rounded-sm resize-none leading-relaxed"
                />
              </div>

              {/* Editorial Styled Submission Trigger Action */}
              <button
                type="submit"
                className="w-full py-4 bg-burnt-brown text-canvas font-sans text-[10px] font-extrabold tracking-widest uppercase hover:bg-[#342013] transition-colors duration-300 rounded-sm flex items-center justify-center gap-2 mt-4"
              >
                Generate Email Pitch <Send className="w-3 h-3" />
              </button>

            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}