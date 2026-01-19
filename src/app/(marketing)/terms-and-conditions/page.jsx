"use client";

import Navbar from "@/components/Navbar";
import FooterSection from "@/components/landing/FooterSection";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "About Us", href: "/#about" },
  { label: "Features", href: "/#features" },
  { label: "Plan", href: "/#plan" },
  { label: "Careers", href: "/#careers" },
  { label: "Contact Us", href: "/#contact" },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <Navbar items={navItems} />
      
      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="bg-white rounded-xl shadow-xl p-10 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B4B31] mb-3">
              Terms and Conditions
            </h1>
            <p className="text-gray-500 text-sm md:text-base mb-10">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div className="prose prose-lg max-w-none space-y-10 text-gray-800">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">1. Introduction</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  Welcome to MaktabOS ("Platform," "we," "us," or "our"). MaktabOS is a web-based school 
                  management system designed to support educational institutions, administrators, teachers, 
                  parents, and students.
                </p>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  By accessing or using MaktabOS, you agree to be bound by these Terms and Conditions 
                  ("Terms"). If you do not agree, you may not use the Platform.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">2. Eligibility</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">You must be:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>At least 18 years old, or</li>
                  <li>Using the Platform under the supervision of a parent, legal guardian, or authorized 
                  school administrator.</li>
                </ul>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  Institutions are responsible for ensuring that their users are authorized.
                </p>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">3. Accounts & Access</h2>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Users must provide accurate and complete information.</li>
                  <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                  <li>You may not share accounts or access systems you are not authorized to use.</li>
                  <li>MaktabOS reserves the right to suspend or terminate accounts for violations.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">4. Acceptable Use</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Violate any laws or regulations</li>
                  <li>Upload malicious code or attempt unauthorized access</li>
                  <li>Abuse, harass, or harm others</li>
                  <li>Reverse engineer or exploit the Platform</li>
                  <li>Use the Platform for non-educational or unlawful purposes</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">5. Subscription, Billing & Payments</h2>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Certain features require a paid subscription.</li>
                  <li>Fees are billed monthly or annually as selected.</li>
                  <li>All payments are non-refundable unless otherwise stated.</li>
                  <li>We may modify pricing with reasonable notice.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">6. Intellectual Property</h2>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>All platform content, software, branding, and designs belong to MaktabOS.</li>
                  <li>Schools retain ownership of their uploaded content and student data.</li>
                  <li>You may not copy, resell, or redistribute the Platform without written consent.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">7. Data Ownership</h2>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Schools own their institutional data.</li>
                  <li>Parents retain rights to their child's data.</li>
                  <li>MaktabOS acts as a data processor, not a data owner.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">8. Service Availability</h2>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>We aim for high uptime but do not guarantee uninterrupted service.</li>
                  <li>Maintenance, updates, or outages may occur.</li>
                  <li>MaktabOS is not liable for downtime or data loss beyond reasonable control.</li>
                </ul>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">9. Termination</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">We may suspend or terminate access:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>For violations of these Terms</li>
                  <li>For non-payment</li>
                  <li>If required by law</li>
                </ul>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  Users may terminate their account at any time through their administrator.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">10. Disclaimers</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  The Platform is provided "as is" without warranties of any kind.
                </p>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  We do not guarantee academic outcomes, performance improvements, or error-free operation.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">11. Limitation of Liability</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">To the maximum extent permitted by law:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>MaktabOS shall not be liable for indirect, incidental, or consequential damages.</li>
                  <li>Our total liability shall not exceed the amount paid in the last 12 months.</li>
                </ul>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">12. Governing Law</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  These Terms are governed by the laws of the State of Minnesota, USA, unless otherwise 
                  required by applicable law.
                </p>
              </section>

              {/* Section 13 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">13. Changes to Terms</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  We may update these Terms periodically. Continued use constitutes acceptance of changes.
                </p>
              </section>

              {/* Section 14 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">14. Contact</h2>
                <div className="space-y-3">
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Email:</strong> <a href="mailto:support@maktabos.com" className="text-[#0B4B31] hover:underline">support@maktabos.com</a>
                  </p>
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Website:</strong> <a href="https://maktabos.com" target="_blank" rel="noopener noreferrer" className="text-[#0B4B31] hover:underline">https://maktabos.com</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </>
  );
}

