"use client";

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/app/LanguageContext';
import { LEGAL_CONTENT, type RenderLocale } from './legalContent';
import { CURRENT_LEGAL_VERSIONS, LEGAL_OPERATOR, type LegalDocument } from '@/app/lib/legal/policy';
import PublicSiteNav from '@/app/components/PublicSiteNav';
import LegalFooter from '@/app/components/LegalFooter';

export default function LegalDocumentPage({ document }: { document: LegalDocument }) {
  const { language, t } = useLanguage();
  const locale: RenderLocale = language === 'en' || language === 'pt' || language === 'ro' ? language : 'es';
  const content = LEGAL_CONTENT[locale][document];
  return <div className="min-vh-100 bg-light"><PublicSiteNav /><main className="py-5"><div className="container" style={{ maxWidth: 850 }}>
    <Link href="/" className="btn btn-link text-decoration-none text-muted mb-4 d-flex align-items-center gap-2"><ChevronLeft size={20} />{t.common.back}</Link>
    <article className="ui-surface p-4 p-md-5"><h1 className="fw-bold text-secondary">{content.title}</h1><p className="text-muted">{t.common.version} {CURRENT_LEGAL_VERSIONS[document]} · {LEGAL_OPERATOR}</p><p className="lead text-secondary">{content.intro}</p>
      {content.sections.map((section) => <section className="mb-4" key={section.title}><h2 className="h5 fw-bold text-secondary">{section.title}</h2>{section.body && <p className="text-secondary lh-lg">{section.body}</p>}{section.bullets && <ul className="text-secondary lh-lg">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}
      <div className="border-top pt-3 text-muted small">{t.common.legal_contact}: <a href="mailto:marioalejandroruiz28@gmail.com">marioalejandroruiz28@gmail.com</a></div>
    </article>
  </div></main><LegalFooter /></div>;
}
