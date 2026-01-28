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

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar items={navItems} />
      
      <div className="min-h-screen bg-gray-50 pt-16 pb-16">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="bg-white rounded-xl shadow-xl p-10 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0B4B31] mb-3">
              Privacy Policy
            </h1>
            <p className="text-gray-500 text-sm md:text-base mb-10">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <div className="prose prose-lg max-w-none space-y-10 text-gray-800">
              {/* Section 1 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">1. Overview</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  MaktabOS respects your privacy and is committed to protecting personal data. This Privacy 
                  Policy explains how we collect, use, and safeguard information.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-[#0B4B31] mb-4 mt-6">a. Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Names, email addresses</li>
                  <li>School and role information</li>
                  <li>Student records (as provided by schools)</li>
                  <li>Payment details (processed via third-party providers)</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#0B4B31] mb-4 mt-6">b. Automatically Collected</h3>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>IP address</li>
                  <li>Device/browser information</li>
                  <li>Usage logs and activity data</li>
                </ul>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">3. How We Use Information</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">We use data to:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Operate and maintain the Platform</li>
                  <li>Provide support and updates</li>
                  <li>Improve features and performance</li>
                  <li>Process payments</li>
                  <li>Ensure security and compliance</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">4. Children's Privacy</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">MaktabOS is designed for educational use:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Schools are responsible for parental consent.</li>
                  <li>We comply with FERPA and COPPA where applicable.</li>
                  <li>We do not sell or market student data.</li>
                </ul>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">5. Data Sharing</h2>
                <p className="leading-relaxed mb-4 text-base md:text-lg">
                  We do not sell personal data.
                </p>
                <p className="leading-relaxed mb-3 text-base md:text-lg">We may share data with:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Authorized school administrators</li>
                  <li>Service providers (hosting, payments, analytics)</li>
                  <li>Legal authorities if required by law</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">6. Data Security</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">We implement:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Encryption</li>
                  <li>Role-based access controls</li>
                  <li>Secure hosting environments</li>
                  <li>Regular monitoring</li>
                </ul>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  No system is 100% secure, but we take reasonable measures to protect data.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">7. Data Retention</h2>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Data is retained as long as accounts are active or legally required.</li>
                  <li>Schools may request data deletion upon contract termination.</li>
                </ul>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">8. User Rights</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">
                  Depending on jurisdiction, users may have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Access their data</li>
                  <li>Request corrections</li>
                  <li>Request deletion</li>
                  <li>Restrict or object to processing</li>
                </ul>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  Requests can be submitted via email.
                </p>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">9. Cookies</h2>
                <p className="leading-relaxed mb-3 text-base md:text-lg">MaktabOS uses cookies for:</p>
                <ul className="list-disc pl-6 space-y-3 text-base md:text-lg">
                  <li>Authentication</li>
                  <li>Performance optimization</li>
                  <li>User experience improvements</li>
                </ul>
                <p className="leading-relaxed mt-5 text-base md:text-lg">
                  You may disable cookies, but some features may not function properly.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">10. Third-Party Services</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  We may integrate with third-party tools (e.g., Stripe, email services). Their privacy practices are 
                  governed by their own policies.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">11. Policy Updates</h2>
                <p className="leading-relaxed text-base md:text-lg">
                  We may update this Privacy Policy periodically. Material changes will be communicated.
                </p>
              </section>

              {/* Section 12 */}
              <section>
                <h2 className="text-2xl font-bold text-[#0B4B31] mb-5">12. Contact Us</h2>
                <div className="space-y-3">
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Email:</strong> <a href="mailto:Admin@maktabos.com" className="text-[#0B4B31] hover:underline">Admin@maktabos.com</a>
                  </p>
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Website:</strong> <a href="https://maktabos.com" target="_blank" rel="noopener noreferrer" className="text-[#0B4B31] hover:underline">https://maktabos.com</a>
                  </p>
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Facebook:</strong> <a href="https://www.facebook.com/share/173NRCfbS7/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="text-[#0B4B31] hover:underline">https://www.facebook.com/share/173NRCfbS7/?mibextid=wwXIfr</a>
                  </p>
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Instagram:</strong> <a href="https://www.instagram.com/maktabos?igsh=M2k5cWZnNHd2eTAx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-[#0B4B31] hover:underline">https://www.instagram.com/maktabos?igsh=M2k5cWZnNHd2eTAx&utm_source=qr</a>
                  </p>
                  <p className="leading-relaxed text-base md:text-lg">
                    <strong>Phone:</strong> <a href="tel:+16123676283" className="text-[#0B4B31] hover:underline">+1 612 - 367- 6283</a>
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

