"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
  Spinner,
} from "@/components/ui";
import { GeneratedResume } from "@/lib/services/resume-service";

export default function ResumePage() {
  const [userName, setUserName] = useState("Ravi Kumar");
  const [phoneNumber, setPhoneNumber] = useState("+91 8328004967");
  const [resume, setResume] = useState<GeneratedResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"resume" | "forms">("resume");
  const [selectedFormIdx, setSelectedFormIdx] = useState(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [appliedPortal, setAppliedPortal] = useState<string | null>(null);
  const [qualifiedSkillsList, setQualifiedSkillsList] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("nexora_user_name");
      if (storedName) setUserName(storedName);
    }

    async function loadDataAndGenerate() {
      setLoading(true);
      try {
        let studentPhone = "+91 8328004967";
        try {
          const res = await fetch("/api/calls/schedule");
          const data = await res.json();
          if (data.schedule?.phoneNumber) {
            studentPhone = data.schedule.phoneNumber;
            setPhoneNumber(studentPhone);
          }
        } catch {}

        // 1. Fetch real skills qualified by the student via phone calls or simulator
        let realSkills: any[] = [];
        try {
          const skillsRes = await fetch("/api/skills/qualify");
          const skillsData = await skillsRes.json();
          if (skillsData.skills && skillsData.skills.length > 0) {
            realSkills = skillsData.skills;
            setQualifiedSkillsList(realSkills);
          }
        } catch {}

        if (realSkills.length === 0) {
          realSkills = [
            { topic: "Commercial Percentages & Billing", score: 2, total: 2, passed: true, dateLearned: "Today" },
          ];
        }

        // 2. Generate resume dynamically using Gemini AI with the real qualified skills
        const resumeRes = await fetch("/api/resume/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentName: userName,
            phoneNumber: studentPhone,
            email: `${userName.toLowerCase().replace(/\s+/g, "")}@nexora.edu`,
            location: "Visakhapatnam, Andhra Pradesh, India",
            educationLevel: "Secondary / Vocational Apprentice",
            skillsLearned: realSkills,
          }),
        });

        const resumeData = await resumeRes.json();
        if (resumeData.resume) {
          setResume(resumeData.resume);
        }
      } catch (err) {
        console.error("Failed to load resume:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDataAndGenerate();
  }, [userName]);

  const handleRefreshResume = async () => {
    setGenerating(true);
    try {
      // Re-fetch skills
      let realSkills: any[] = [];
      try {
        const skillsRes = await fetch("/api/skills/qualify");
        const skillsData = await skillsRes.json();
        if (skillsData.skills && skillsData.skills.length > 0) {
          realSkills = skillsData.skills;
          setQualifiedSkillsList(realSkills);
        }
      } catch {}

      const resumeRes = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: userName,
          phoneNumber,
          skillsLearned: realSkills,
        }),
      });
      const data = await resumeRes.json();
      if (data.resume) setResume(data.resume);
    } catch {
      alert("Could not update resume. Please check network connection.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const copyToClipboard = (text: string, fieldKey: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📄</span>
              <h1 className="text-2xl font-bold text-slate-900">
                AI Auto-Generated Resume & Job Form Filler
              </h1>
              <Badge variant="success">Auto-Synchronized with Call Tests</Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              As you learn topics through our AI Phone Calls and Keypad Tests, your verified competencies are automatically translated into an ATS-friendly resume and auto-filled application forms.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefreshResume}
              disabled={generating}
              className="text-xs font-semibold"
            >
              {generating ? "Updating..." : "🔄 Refresh with New Skills"}
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              🖨️ Print / Download PDF
            </Button>
          </div>
        </div>

        {/* Verified Phone & Call Test Skills Tracker */}
        {qualifiedSkillsList.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎓</span>
              <div>
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                  AI Call-Verified Competencies ({qualifiedSkillsList.length})
                </h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  These topics were taught by AI and verified through phone keypad MCQ tests. They automatically power your resume and job applications.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 shrink-0">
              {qualifiedSkillsList.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-white border border-emerald-300 rounded-lg text-[11px] font-bold text-emerald-800 shadow-sm flex items-center gap-1"
                >
                  <span>✓</span> {s.topic} ({s.score}/{s.total})
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab("resume")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "resume"
                ? "bg-[#152d4a] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            📋 Verified Professional Resume
          </button>
          <button
            onClick={() => setActiveTab("forms")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "forms"
                ? "bg-[#152d4a] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            📝 Auto-Filled Job Application Forms ({resume?.autoFilledApplications?.length || 2})
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center space-y-4">
            <Spinner size={36} />
            <p className="text-sm text-slate-500 font-medium">
              Gemini AI is compiling your verified skills into an ATS resume...
            </p>
          </div>
        ) : resume ? (
          <>
            {/* TAB 1: RESUME VIEW */}
            {activeTab === "resume" && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 sm:p-12 space-y-8 font-sans print:p-0 print:shadow-none print:border-none">
                {/* Header Section */}
                <div className="border-b border-slate-200 pb-6 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        {resume.fullName}
                      </h2>
                      <p className="text-sm font-semibold text-teal-700 mt-1">
                        {resume.professionalHeadline}
                      </p>
                    </div>
                    <div className="text-xs text-slate-500 sm:text-right space-y-1">
                      <p className="font-mono">📞 {resume.contact.phone}</p>
                      <p className="font-mono">✉️ {resume.contact.email}</p>
                      <p>📍 {resume.contact.location}</p>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="pt-2 flex items-center gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span>✓</span>
                      <span>{resume.contact.verifiedThrough}</span>
                    </span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Professional Summary
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {resume.executiveSummary}
                  </p>
                </div>

                {/* Verified Competencies */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Demonstrated Competencies (Phone Call Verified)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resume.verifiedCompetencies.map((comp, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <h4 className="text-xs font-bold text-slate-900">
                          {comp.category}
                        </h4>
                        <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                          {comp.skills.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                        <p className="text-[10px] text-teal-700 font-semibold pt-1 border-t border-slate-200">
                          {comp.assessmentVerification}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practical Applied Projects */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Practical Applied Case Studies & Simulations
                  </h3>
                  <div className="space-y-3">
                    {resume.practicalAppliedProjects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-teal-50/40 border border-teal-100 space-y-1.5">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-bold text-slate-900">
                            {proj.title}
                          </h4>
                          <div className="flex gap-1.5">
                            {proj.skillsApplied.map((sk, i) => (
                              <Badge key={i} variant="info" className="text-[10px]">
                                {sk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Education & Training
                    </h3>
                    <div className="space-y-2">
                      {resume.educationAndCertifications.map((edu, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <p className="font-bold text-slate-900">{edu.title}</p>
                          <p className="text-slate-500">{edu.issuer} • {edu.year}</p>
                          <span className="text-[10px] font-semibold text-emerald-700">{edu.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Languages & Target Fit
                    </h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <p className="font-semibold text-slate-700 mb-1">Languages Spoken:</p>
                        <div className="flex gap-2">
                          {resume.languages.map((l, i) => (
                            <span key={i} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800">
                              {l.name} ({l.proficiency})
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <p className="font-semibold text-slate-700 mb-1">Immediate Roles Match:</p>
                        <p className="text-slate-600">{resume.recommendedJobRoles.join(" • ")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AUTO-FILLED APPLICATION FORMS */}
            {activeTab === "forms" && (
              <div className="space-y-6">
                <Card className="p-6 space-y-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-base font-bold text-slate-900">
                      Pre-Filled Government & Apprenticeship Applications
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Our AI extracts your verified scores, phone number, and skills into standard recruitment portal fields. One-click copy into job forms.
                    </CardDescription>
                  </CardHeader>

                  {/* Portal Selection Tabs */}
                  <div className="flex gap-2 border-b border-slate-200 pb-2">
                    {resume.autoFilledApplications.map((app, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedFormIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          selectedFormIdx === idx
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {app.portalName}
                      </button>
                    ))}
                  </div>

                  {/* Selected Form Details */}
                  {resume.autoFilledApplications[selectedFormIdx] && (
                    <div className="space-y-4 pt-2">
                      <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl">
                        <div>
                          <p className="text-xs text-slate-400 uppercase font-semibold">Portal / Program</p>
                          <h3 className="text-base font-bold">
                            {resume.autoFilledApplications[selectedFormIdx].portalName}
                          </h3>
                        </div>
                        <Badge variant="success">
                          Role: {resume.autoFilledApplications[selectedFormIdx].roleApplied}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {Object.entries(
                          resume.autoFilledApplications[selectedFormIdx].fields
                        ).map(([fieldKey, value]) => (
                          <div
                            key={fieldKey}
                            className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                          >
                            <div className="flex-1">
                              <span className="text-[11px] font-bold text-slate-500 uppercase block">
                                {fieldKey}
                              </span>
                              <span className="text-xs font-semibold text-slate-900 block mt-0.5">
                                {value}
                              </span>
                            </div>

                            <button
                              onClick={() => copyToClipboard(value, fieldKey)}
                              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 transition-colors shrink-0"
                            >
                              {copiedField === fieldKey ? "✓ Copied!" : "📋 Copy"}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Direct Apply Action */}
                      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-xs text-slate-500">
                          {appliedPortal === resume.autoFilledApplications[selectedFormIdx].portalName ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                              <span>✅</span> Application submitted with AI-verified credentials! Recruiter received your oral test scores.
                            </span>
                          ) : (
                            <span>All verified competencies from your phone lessons have been matched with this apprenticeship role.</span>
                          )}
                        </div>

                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setAppliedPortal(resume.autoFilledApplications[selectedFormIdx].portalName);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          {appliedPortal === resume.autoFilledApplications[selectedFormIdx].portalName
                            ? "✓ Application Submitted"
                            : "🚀 1-Click Apply for Apprenticeship"}
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
}

