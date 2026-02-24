import React from 'react'
import { Document, Page, View, Text } from '@react-pdf/renderer'
import { buildStyles } from './PDFStyles'
import { formatDateRange } from '@/lib/utils'
import { siteConfig } from '@/lib/site-config'
import type { ResolvedLoadout, Bullet, ExportRules } from '@/types'

interface Props {
  loadout: ResolvedLoadout
  fontScale: number
  lineHeightScale: number
  recruiterMode?: boolean
  bulletCapsPerRole?: Record<string, number>
  projectCount?: number
  projectsCompact?: boolean
  showLeadership?: boolean
  showAdditional?: boolean
}

function BulletLine({ bullet, styles }: { bullet: Bullet; styles: ReturnType<typeof buildStyles> }) {
  return (
    <Text style={styles.bulletText}>
      {'• '}{bullet.text}
      {bullet.metric ? <Text style={styles.bulletMetric}> ({bullet.metric})</Text> : null}
    </Text>
  )
}

export function ResumePDF({
  loadout,
  fontScale,
  lineHeightScale,
  recruiterMode = false,
  bulletCapsPerRole = {},
  projectCount,
  projectsCompact = false,
  showLeadership = true,
}: Props) {
  const styles = buildStyles(fontScale, lineHeightScale, recruiterMode)
  const rules: ExportRules = loadout.loadout.exportRules
  const maxProjects = projectCount ?? rules.maxProjects

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* Header */}
        <View>
          <Text style={styles.headerName}>{siteConfig.name}</Text>
          <Text style={styles.headerTitle}>{siteConfig.title}</Text>
          <Text style={styles.headerContact}>
            {siteConfig.email}  ·  {siteConfig.socials.linkedin?.replace('https://linkedin.com/in/', 'linkedin.com/in/')}
            {siteConfig.socials.github && `  ·  ${siteConfig.socials.github.replace('https://github.com/', 'github.com/')}`}
          </Text>
        </View>

        {/* Education */}
        {loadout.education.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Education</Text>
            {loadout.education.map(edu => (
              <View key={edu.id} style={styles.row}>
                <View>
                  <Text style={styles.schoolName}>{edu.school}</Text>
                  <Text style={styles.degreeName}>
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                    {edu.gpa ? `  ·  GPA: ${edu.gpa}` : ''}
                  </Text>
                </View>
                <Text style={styles.jobMeta}>{formatDateRange(edu.startDate, edu.endDate)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {loadout.skillGroups.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Skills</Text>
            {loadout.skillGroups.map(({ group, skills }) => (
              <View key={group} style={styles.skillRow}>
                <Text style={styles.skillGroup}>{group}:</Text>
                <Text style={styles.skillNames}>{skills.map(s => s.name).join(', ')}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {loadout.certifications.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Certifications</Text>
            {loadout.certifications.map(cert => (
              <View key={cert.id} style={styles.row}>
                <Text style={styles.certName}>{cert.name} · {cert.issuer}</Text>
                <Text style={styles.certMeta}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Experience */}
        {loadout.experiences.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Experience</Text>
            {loadout.experiences.map(exp => {
              const cap = bulletCapsPerRole[exp.id]
                ?? exp.loadoutItem.bulletCapOverride
                ?? rules.maxBulletsPerRole
              const bullets = exp.bullets.slice(0, cap)

              return (
                <View key={exp.id} style={{ marginBottom: lineHeightScale * 6 }}>
                  <View style={styles.jobRow}>
                    <View>
                      <Text style={styles.jobTitle}>{exp.role}</Text>
                      <Text style={styles.jobCompany}>{exp.company}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.jobMeta}>{formatDateRange(exp.startDate, exp.endDate)}</Text>
                      {exp.location && <Text style={styles.jobMeta}>{exp.location}</Text>}
                    </View>
                  </View>
                  {bullets.map(b => <BulletLine key={b.id} bullet={b} styles={styles} />)}
                </View>
              )
            })}
          </View>
        )}

        {/* Projects */}
        {loadout.projects.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Projects</Text>
            {loadout.projects.slice(0, maxProjects).map(proj => (
              <View key={proj.id} style={{ marginBottom: lineHeightScale * 3 }}>
                {projectsCompact ? (
                  <View style={styles.row}>
                    <Text style={styles.projectTitle}>
                      {proj.title}
                      {' '}
                      <Text style={styles.projectLink}>
                        {proj.githubUrl ? proj.githubUrl.replace('https://', '') : ''}
                      </Text>
                    </Text>
                    <Text style={styles.projectPitch}>{proj.pitch}</Text>
                  </View>
                ) : (
                  <View>
                    <View style={styles.row}>
                      <Text style={styles.projectTitle}>{proj.title}</Text>
                      {proj.githubUrl && (
                        <Text style={styles.projectLink}>{proj.githubUrl.replace('https://', '')}</Text>
                      )}
                    </View>
                    <Text style={styles.projectPitch}>{proj.pitch}</Text>
                    {proj.techStack.length > 0 && (
                      <Text style={{ ...styles.projectPitch, color: buildStyles(fontScale, lineHeightScale, recruiterMode).jobMeta.color }}>
                        {proj.techStack.slice(0, 5).join(' · ')}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Leadership */}
        {showLeadership && loadout.leadership.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Leadership</Text>
            {loadout.leadership.map(lead => (
              <View key={lead.id} style={{ marginBottom: lineHeightScale * 4 }}>
                <View style={styles.row}>
                  <View>
                    <Text style={styles.jobTitle}>{lead.role}</Text>
                    <Text style={styles.jobCompany}>{lead.org}</Text>
                  </View>
                  <Text style={styles.jobMeta}>{formatDateRange(lead.startDate, lead.endDate)}</Text>
                </View>
                {lead.bullets.slice(0, 2).map((b, i) => (
                  <Text key={i} style={styles.bulletText}>{'• '}{b}</Text>
                ))}
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  )
}
