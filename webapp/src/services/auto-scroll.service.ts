export interface ScrollOptions {
  msPerPx: number;
  onScrollEnd?: () => void;
}

export class AutoScrollService {
  /** Used as a start/stop flag for scrolling and to prevent multiple "threads"
   *  of scrolling callbacks. Consider the behavior of `start` and `scroll`. If
   *  we used a simple boolean then multiple calls to start would result in
   *  multiple parallel calls to the self-recursive `scroll` function. Using
   *  this, all calls to `scroll` self-terminate if they do not match the
   *  global `activeScrollId` (which is incremented on every call to `start`),
   *  leading to only one active "thread" (the one with the current scroll id).
   */
  private activeScrollId = 0;

  /** Used to detect when we've reached the end of our scrollable content.
   *  Other methods (comparing current position to height, etc.) are unreliable
   *  depending on how the scrolled elements are styled and positioned. */
  private lastY = 0;
  private lastYChangeTime = 0;

  /** Used to control the scrolling "frame-rate". */
  private lastScrollTime = 0;

  constructor(public options: ScrollOptions) {}

  public start = (initialDelay: number | void) => {
    const nextScrollId = (this.activeScrollId + 1) % 8192;
    this.activeScrollId = nextScrollId;
    this.lastY = window.scrollY;

    setTimeout(() => {
      this.lastScrollTime = performance.now();
      this.scroll(performance.now(), nextScrollId);
    }, initialDelay || 0);
  };

  public stop = () => {
    this.activeScrollId += 1;
  };

  private scroll = (timestamp: number, scrollId: number) => {
    if (scrollId !== this.activeScrollId) return;

    const elapsedTime = timestamp - this.lastScrollTime;
    if (elapsedTime > this.options.msPerPx) {
      window.scrollBy({
        top: Math.max(1, Math.floor(elapsedTime / this.options.msPerPx))
      });
      this.lastScrollTime = timestamp;

      // Don't trigger the "end-of-scroll" logic until we've spent a full
      // second trying to scroll unsuccessfully.
      if (window.scrollY !== this.lastY) {
        this.lastY = window.scrollY;
        this.lastYChangeTime = timestamp;
      } else if (timestamp - this.lastYChangeTime > 2000) {
        if (this.options.onScrollEnd) {
          this.options.onScrollEnd();
        }
        this.stop();
      }
    }
    window.requestAnimationFrame(ts => this.scroll(ts, scrollId));
  };
}
