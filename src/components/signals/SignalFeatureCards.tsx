import Image from "next/image";
import { getLocale } from "next-intl/server";
import {
  certsForLocale,
  signalIcons,
  signalKeys,
  type SignalKey,
} from "@/lib/signalCerts";

const mediaIconKeys = new Set<SignalKey>([...signalKeys]);

const ANALYZES_PREVIEW = 6;

export async function SignalFeatureCards() {
  const locale = await getLocale();
  const copy = certsForLocale(locale);

  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
      {signalKeys.map((key, index) => {
        const cert = copy.certs[key];
        const analyzes = cert.analyzes.slice(0, ANALYZES_PREVIEW);
        const n = String(index + 1).padStart(2, "0");
        const isMediaIcon = mediaIconKeys.has(key);

        return (
          <article key={key} className="signal-feature-card group">
            <div className="signal-feature-card__glow" aria-hidden="true" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`signal-feature-card__icon${
                    isMediaIcon ? " signal-feature-card__icon--media" : ""
                  }`}
                >
                  <Image
                    src={signalIcons[key]}
                    alt=""
                    width={isMediaIcon ? 104 : 36}
                    height={isMediaIcon ? 104 : 36}
                    className={
                      isMediaIcon
                        ? "h-full w-full object-cover"
                        : "h-9 w-9 opacity-95"
                    }
                  />
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-pure md:text-[1.65rem]">
                    {cert.name}
                  </h3>
                  <p className="mt-2.5 max-w-md text-[0.95rem] leading-[1.65] text-muted">
                    {cert.summary}
                  </p>
                </div>
              </div>
              <span className="font-mono text-xs tracking-[0.18em] text-primary/70">
                {n}
              </span>
            </div>

            <p className="relative mt-8 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-primary/85">
              {copy.analyzesTitle}
            </p>
            <ul className="relative mt-3.5 space-y-2.5 text-sm leading-relaxed text-muted">
              {analyzes.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[0.7rem] h-px w-3.5 shrink-0 bg-primary/55" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="relative mt-7 border-t border-glass/35 pt-5 text-sm leading-relaxed text-pure/80">
              {cert.value}
            </p>
          </article>
        );
      })}
    </div>
  );
}
