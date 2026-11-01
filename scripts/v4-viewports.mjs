/** Exact chapter-50 CSS viewports. These are emulation dimensions, not devices. */
export const V4_VIEWPORTS = [[320,720],[360,780],[390,844],[430,932],[568,320],[744,1133],[768,1024],[820,1180],[834,1194],[1024,768],[1024,1366],[1180,820],[1280,800],[1440,900],[1920,1080]];
export function auditViewports(env = process.env) {
  const exact = env.NEXUS_AUDIT_VIEWPORTS === 'chapter50' ? V4_VIEWPORTS : env.NEXUS_AUDIT_VIEWPORTS ? JSON.parse(env.NEXUS_AUDIT_VIEWPORTS) : null;
  const dimensions = exact ?? JSON.parse(env.NEXUS_AUDIT_WIDTHS || '[320,390,820,1440]').map(width => [width,1000]);
  return dimensions.map(([width,height]) => {
    if(!Number.isInteger(width)||!Number.isInteger(height)||width<240||height<240||width>7680||height>7680) throw Error('Invalid audit viewport');
    return {width,height,viewportKey:exact?`${width}x${height}`:String(width)};
  });
}
