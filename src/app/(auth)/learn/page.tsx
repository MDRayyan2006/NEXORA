"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from "@/components/ui";
import { LEARNING_RESOURCES, LearningResource } from "@/lib/data/learning-content";

export default function LearnPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalResource, setActiveModalResource] = useState<LearningResource | null>(null);

  const categories = ["All", "Mathematics", "Physics", "Chemistry", "English"];

  const filteredResources = LEARNING_RESOURCES.filter((res) => {
    const matchesCategory = selectedCategory === "All" || res.category === selectedCategory;
    const matchesSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <h1 className="text-2xl font-bold text-slate-900">
                Learning Resources: Videos, Textbooks & Audio
              </h1>
              <Badge variant="info">Multi-Channel Delivery</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Every topic is prepared with curated video lectures, textbook chapter summaries, worked problems, and keypad audio test questions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/call-tutor">
              <Button variant="primary" size="sm" className="text-xs font-bold bg-teal-700 hover:bg-teal-800">
                📞 Schedule Call for Topic
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#152d4a] text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics, formulas, or concepts..."
            className="w-full sm:w-72 text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => (
            <Card
              key={item.id}
              className="overflow-hidden border-slate-200 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              {/* Card Top: Video Thumbnail & Duration */}
              <div>
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  <img
                    src={item.video.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant="info" className="text-[10px] bg-slate-900/80 backdrop-blur text-teal-300 border-none">
                      {item.subject}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-[10px] bg-black/70 text-white font-mono px-2 py-0.5 rounded-md backdrop-blur">
                      ⏱️ {item.video.duration}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] text-teal-300 font-semibold">{item.video.channel}</p>
                    <h3 className="font-bold text-sm leading-snug line-clamp-1">{item.title}</h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {item.summary}
                  </p>

                  {/* Core principles preview */}
                  <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Textbook Highlight & Formula:
                    </p>
                    <p className="text-xs font-mono font-semibold text-slate-800">
                      {item.textbook.formulaSheet[0] || item.textbook.corePrinciples[0]}
                    </p>
                  </div>

                  {/* Associated Job Skill */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="text-sm">💼</span>
                    <span className="text-[11px] text-teal-700 font-semibold">
                      {item.jobSkills[0]?.skillName || "Commercial Quantitative Skill"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => setActiveModalResource(item)}
                  className="text-xs py-1.5 px-3 font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  📖 Study Notes & Video
                </Button>

                <Link href={`/call-tutor`}>
                  <Button size="sm" variant="secondary" className="text-xs py-1.5 px-2.5 font-semibold text-slate-700">
                    📞 Audio Call
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* MODAL: Full Textbook Notes & Embedded Video Player */}
        {activeModalResource && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <Badge variant="info" className="text-xs mb-1">
                    {activeModalResource.subject} • {activeModalResource.gradeLevel}
                  </Badge>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeModalResource.title}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveModalResource(null)}
                  className="text-slate-400 hover:text-slate-700 text-2xl font-bold leading-none p-1"
                >
                  ×
                </button>
              </div>

              {/* Video Player Embed */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Curated Video Lecture ({activeModalResource.video.channel})
                </h3>
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeModalResource.video.youtubeId}`}
                    title={activeModalResource.video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                </div>
              </div>

              {/* Textbook Chapter Notes */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Comprehensive Textbook Notes & Formulas
                </h3>

                <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-teal-900">Key Principles:</p>
                  <ul className="text-xs text-teal-800 space-y-1 list-disc list-inside">
                    {activeModalResource.textbook.corePrinciples.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 font-mono text-xs space-y-2">
                  <p className="text-teal-400 font-bold uppercase tracking-wider text-[10px]">
                    Formula Reference:
                  </p>
                  {activeModalResource.textbook.formulaSheet.map((f, i) => (
                    <p key={i} className="text-teal-200">
                      • {f}
                    </p>
                  ))}
                </div>

                {/* Worked Example */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <p className="font-bold text-slate-900">
                    Worked Problem: {activeModalResource.textbook.workedExample.problem}
                  </p>
                  <div className="space-y-1 text-slate-600 pl-2 border-l-2 border-teal-500">
                    {activeModalResource.textbook.workedExample.stepByStep.map((s, i) => (
                      <p key={i}>{s}</p>
                    ))}
                  </div>
                  <p className="font-bold text-emerald-700 pt-1">
                    {activeModalResource.textbook.workedExample.solution}
                  </p>
                </div>
              </div>

              {/* Keypad Oral Test Preview */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2 text-xs">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>📞</span>
                  <span>Audio Call Oral Test Preview (Asked on Keypad Phone):</span>
                </p>
                {activeModalResource.callAssessment.map((q, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-slate-800 font-medium">Q: {q.audioQuestion}</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options.map((o) => (
                        <div key={o.digit} className="bg-white p-2 rounded-lg border border-amber-200 text-[11px] font-mono">
                          Key {o.digit} → {o.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <div className="flex justify-end gap-3 pt-2">
                <Link href="/call-tutor">
                  <Button variant="primary" className="text-xs font-bold">
                    Schedule Daily Call for this Topic →
                  </Button>
                </Link>
                <Button
                  variant="secondary"
                  onClick={() => setActiveModalResource(null)}
                  className="text-xs"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
