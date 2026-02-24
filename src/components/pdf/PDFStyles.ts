import { StyleSheet } from '@react-pdf/renderer'

export const LETTER_WIDTH  = 612  // pts
export const LETTER_HEIGHT = 792  // pts
export const MARGIN = 36          // pts (0.5in)

export const COLORS = {
  bg:      '#0f0f0f',
  surface: '#1a1a1a',
  accent:  '#ff4655',
  accent2: '#00d4ff',
  text:    '#e5e5e5',
  muted:   '#8a8a8a',
  border:  '#2a2a2a',
  // Recruiter palette
  rBg:     '#ffffff',
  rText:   '#1e293b',
  rAccent: '#2563eb',
  rMuted:  '#64748b',
  rBorder: '#e2e8f0',
}

export function buildStyles(fontScale: number, lineHeightScale: number, recruiter = false) {
  const c = recruiter
    ? { bg: COLORS.rBg, text: COLORS.rText, accent: COLORS.rAccent, muted: COLORS.rMuted, border: COLORS.rBorder }
    : { bg: COLORS.bg, text: COLORS.text, accent: COLORS.accent, muted: COLORS.muted, border: COLORS.border }

  const fs = (n: number) => n * fontScale
  const lh = (n: number) => n * lineHeightScale

  return StyleSheet.create({
    page: {
      padding: MARGIN,
      backgroundColor: c.bg,
      fontFamily: 'Helvetica',
    },

    // Header
    headerName: {
      fontSize: fs(22),
      fontFamily: 'Helvetica-Bold',
      color: c.text,
      marginBottom: lh(2),
    },
    headerTitle: {
      fontSize: fs(10),
      color: c.accent,
      marginBottom: lh(4),
    },
    headerContact: {
      fontSize: fs(8),
      color: c.muted,
      marginBottom: lh(8),
    },

    // Section
    sectionHeader: {
      fontSize: fs(8),
      fontFamily: 'Helvetica-Bold',
      color: c.accent,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      borderBottomWidth: 1,
      borderBottomColor: c.accent,
      paddingBottom: lh(2),
      marginBottom: lh(4),
      marginTop: lh(10),
    },

    // Experience
    jobTitle: {
      fontSize: fs(10),
      fontFamily: 'Helvetica-Bold',
      color: c.text,
    },
    jobCompany: {
      fontSize: fs(9),
      color: c.accent,
    },
    jobMeta: {
      fontSize: fs(8),
      color: c.muted,
    },
    jobRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: lh(2),
    },
    bulletText: {
      fontSize: fs(9),
      color: c.text,
      lineHeight: lh(1.4),
      marginLeft: 8,
      marginBottom: lh(1.5),
    },
    bulletMetric: {
      color: c.accent,
      fontFamily: 'Helvetica-Bold',
    },

    // Skills
    skillRow: {
      flexDirection: 'row',
      marginBottom: lh(2),
    },
    skillGroup: {
      fontSize: fs(8),
      color: c.muted,
      width: 80,
      fontFamily: 'Helvetica-Bold',
    },
    skillNames: {
      fontSize: fs(8),
      color: c.text,
      flex: 1,
      lineHeight: lh(1.4),
    },

    // Education
    schoolName: {
      fontSize: fs(10),
      fontFamily: 'Helvetica-Bold',
      color: c.text,
    },
    degreeName: {
      fontSize: fs(9),
      color: c.muted,
    },

    // Projects
    projectRow: {
      flexDirection: 'row',
      marginBottom: lh(3),
    },
    projectTitle: {
      fontSize: fs(9),
      fontFamily: 'Helvetica-Bold',
      color: c.text,
    },
    projectPitch: {
      fontSize: fs(8),
      color: c.muted,
      lineHeight: lh(1.3),
      marginTop: lh(1),
    },
    projectLink: {
      fontSize: fs(7),
      color: c.accent,
    },

    // Certs
    certName: {
      fontSize: fs(9),
      color: c.text,
    },
    certMeta: {
      fontSize: fs(8),
      color: c.muted,
    },

    // Row layout
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
}
