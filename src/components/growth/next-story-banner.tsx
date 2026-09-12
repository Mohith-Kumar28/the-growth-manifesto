import { Link } from '@tanstack/react-router'
import { Reveal } from './reveal'

/**
 * Mid-page invitation that sits under the client marquee. The frame is drawn
 * twice, as in the design: a crisp CSS rule plus a hand-drawn ink rectangle
 * that only comes in once there is enough width for it to read as sketched.
 */
export function NextStoryBanner() {
  return (
    <Reveal className="mt-14 md:mt-16">
      <div className="relative rounded-[15px] border border-ink">
        <img
          src="/assets/growth/frame-sketch.webp"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-[7px] hidden h-[calc(100%-14px)] w-[calc(100%-14px)] md:block"
        />

        <div className="relative flex flex-col-reverse items-center gap-6 px-6 py-8 sm:flex-row sm:justify-center sm:gap-8 md:px-10 md:py-6 lg:gap-[37px]">
          <div className="flex w-full max-w-[755px] flex-col gap-4 md:gap-[25px]">
            <div className="flex flex-col gap-2.5">
              <h2 className="font-fell text-[24px] leading-tight text-ink sm:text-[30px] lg:text-[36px]">
                Your Company could be the next story we write.
              </h2>
              <p className="max-w-[362px] font-fell text-[17px] leading-snug text-gray-body md:text-[20px]">
                Every great company begins with a decision.
                <br />
                Let&rsquo;s write a growth story{' '}
                <em className="italic">worth printing.</em>
              </p>
            </div>

            {/* Both halves of this CTA lead to the founders intake form —
                the italic label reads as part of the invitation, so it is a
                link in its own right rather than dead text beside the button. */}
            <div className="flex flex-wrap items-center gap-4 md:gap-5">
              <Link
                to="/founders"
                className="font-fell text-[20px] italic text-ink underline-offset-4 transition-opacity hover:underline hover:opacity-80 md:text-[24px]"
              >
                Start Your Chapter
              </Link>
              <Link
                to="/founders"
                className="bg-brand-red px-8 py-3.5 font-fell text-[12px] tracking-[2px] text-paper-rect uppercase transition-opacity hover:opacity-90"
              >
                Tell us your story
              </Link>
            </div>
          </div>

          <img
            src="/assets/growth/type-writer.png"
            alt="An antique typewriter with a sheet reading &ldquo;What&rsquo;s your story?&rdquo;"
            width={198}
            height={198}
            loading="lazy"
            decoding="async"
            className="size-[150px] shrink-0 object-contain sm:size-[170px] lg:size-[198px]"
          />
        </div>
      </div>
    </Reveal>
  )
}
