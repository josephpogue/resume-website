export const EXTRACTION_PROMPT = `Extract all career and resume data from this document. Return ONLY a valid JSON object — no markdown, no explanation.

Schema (only include sections that have data in the document):
{
  "experiences": [{
    "company": "string",
    "role": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | Present | null",
    "location": "string | null",
    "description": "brief role summary or null",
    "tags": ["relevant skill/domain keywords"],
    "bullets": [{ "text": "achievement statement", "metric": "quantified result or null" }],
    "contextNotes": "2-4 paragraphs of rich private context: day-to-day responsibilities, technical depth, team context, challenges, impact — things that would not fit on a resume but provide important background for AI to generate better bullets later. Write in first person."
  }],
  "education": [{
    "school": "string",
    "degree": "string",
    "field": "string | null",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | null",
    "gpa": "string | null",
    "honors": "string | null"
  }],
  "skills": [{
    "name": "string",
    "group": "Languages | Tools | Platforms | Frameworks | Certifications",
    "proficiency": 3
  }],
  "certifications": [{
    "name": "string",
    "issuer": "string",
    "date": "YYYY-MM",
    "expires": "YYYY-MM | null",
    "credUrl": "string | null"
  }],
  "leadership": [{
    "org": "string",
    "role": "string",
    "startDate": "YYYY-MM",
    "endDate": "YYYY-MM | Present | null",
    "bullets": ["achievement statement"],
    "tags": ["keywords"]
  }],
  "projects": [{
    "title": "string",
    "pitch": "1-2 sentence description",
    "casestudy": "longer description | null",
    "githubUrl": "string | null",
    "demoUrl": "string | null",
    "tags": ["keywords"],
    "techStack": ["technology names"],
    "featured": false
  }]
}

For dates, use "YYYY-MM" format. If only a year is given, use "YYYY-01". For "Present" or current roles, use null for endDate.
For skill proficiency: 1=beginner, 2=basic, 3=intermediate, 4=advanced, 5=expert.
Return ONLY the JSON object.`
