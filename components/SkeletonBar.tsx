/* ================================================================== */
/*  Marketing Mode — Skeleton Placeholder Component                   */
/* ================================================================== */

export function SkeletonBar({
  w = '100%',
  h = 7,
  opacity = 0.14,
}: {
  w?: string | number
  h?: number
  opacity?: number
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 4,
        background: `rgba(0,0,0,${opacity + 0.06})`,
        flexShrink: 0,
      }}
      className="dark:bg-white/[0.08]"
    />
  )
}
