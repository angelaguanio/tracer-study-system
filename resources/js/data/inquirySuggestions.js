export const INQUIRY_SUGGESTIONS = [
    {
        id: 'grad-pic',
        category: 'Graduation Photos',
        title: 'Graduation Picture Releasing',
        alumniPrompt: 'How can I claim my Graduation Picture?',
        defaultInquiryMessage: 'Good day! I would like to inquire about the requirements and process for claiming my Graduation Picture. Thank you!',
        keywords: [
            'graduation picture',
            'grad picture',
            'grad pic',
            'picture releasing',
            'claim picture',
            'claim grad pic',
            'photoshoot',
            'pictorial',
            'photo releasing',
            'larawan',
            'kuha ng picture',
            'kuha ng picture graduation'
        ],
        template: `Hello {alumni_name},

Good day! Here are the requirements for claiming your Graduation Picture:

• For Personal Claiming:
Present any of the following: Graduation Fee Official Receipt, Alumni ID, Transcript of Records (TOR), Diploma, or any valid government/school ID.
*(Note: The original copy of the graduation fee receipt is required if you are also applying for an Alumni ID).*

• If Claiming Thru an Authorized Representative:
- Signed Authorization Letter (must state your full name, degree/course, year, and semester graduated).
- Photocopy of your TOR or Diploma.
- One (1) photocopy of your valid ID or Alumni ID.
- One (1) photocopy of the representative's valid ID.

Please visit our office during regular office hours. Thank you!`,
        coordinatorTemplate: `Hello {alumni_name},

Good day! Here are the requirements for claiming your Graduation Picture:

• For Personal Claiming:
Present any of the following at the Alumni Affairs Office: Graduation Fee Official Receipt, Alumni ID, Transcript of Records (TOR), Diploma, or any valid government/school ID.
*(Note: The original copy of the graduation fee receipt is required if you are also applying for an Alumni ID).*

• If Claiming Thru an Authorized Representative:
- Signed Authorization Letter (must state your full name, degree/course, year, and semester graduated).
- Photocopy of your TOR or Diploma.
- One (1) photocopy of your valid ID or Alumni ID.
- One (1) photocopy of the representative's valid ID.

Please visit the Alumni Affairs Office during regular office hours to claim your picture. Feel free to let me know if you need any assistance from our department. Thank you!`
    },
    {
        id: 'yearbook',
        category: 'Yearbook',
        title: 'Yearbook Releasing',
        alumniPrompt: 'How do I claim my Yearbook?',
        defaultInquiryMessage: 'Good day! I would like to inquire about the requirements and procedure for claiming my Yearbook. Thank you!',
        keywords: [
            'yearbook',
            'year book',
            'annual book',
            'claim yearbook',
            'yearbook releasing',
            'kuha ng yearbook',
            'release yearbook'
        ],
        template: `Hello {alumni_name},

Good day! Here are the requirements for claiming your Yearbook:

• For Personal Claiming:
Present any of the following: Graduation Fee Official Receipt, Alumni ID, Diploma, or any valid ID.

• If Claiming Thru an Authorized Representative:
- Signed Authorization Letter (must include your degree/course, year, and semester graduated).
- Photocopy of your TOR or Diploma.
- One (1) photocopy of your valid ID or Alumni ID.
- One (1) photocopy of the representative's valid ID.

You may claim this at our office during regular working hours. Thank you!`,
        coordinatorTemplate: `Hello {alumni_name},

Good day! Here are the requirements for claiming your Yearbook:

• For Personal Claiming:
Present any of the following at the Alumni Affairs Office: Graduation Fee Official Receipt, Alumni ID, Diploma, or any valid ID.

• If Claiming Thru an Authorized Representative:
- Signed Authorization Letter (must include your degree/course, year, and semester graduated).
- Photocopy of your TOR or Diploma.
- One (1) photocopy of your valid ID or Alumni ID.
- One (1) photocopy of the representative's valid ID.

You may claim your yearbook at the Alumni Affairs Office during regular working hours. Feel free to reach out if you have any questions. Thank you!`
    },
    {
        id: 'clearance-tor-waiver',
        category: 'Clearance & TOR',
        title: 'Clearance Signature for TOR & Waiver',
        alumniPrompt: 'What are the requirements for TOR & Waiver clearance?',
        defaultInquiryMessage: 'Good day! I would like to inquire about the clearance requirements and signature process for my TOR or Graduating Waiver. Thank you!',
        keywords: [
            'clearance',
            'tor clearance',
            'waiver',
            'transcript of records',
            'transcript',
            'clearance signature',
            'sign clearance',
            'pirma ng clearance',
            'tor request',
            'request tor'
        ],
        template: `Hello {alumni_name},

Good day! Regarding clearance signatures for Transcript of Records (TOR) and Waivers, please note the following guidelines:

• For Transcript of Records (TOR - Graduates/Alumni):
Before your request for TOR can be signed and processed, our office verifies if you have an updated profile and have completed the Graduate Tracer Study survey.

• For Graduation Clearance / Waiver (Graduating Students):
To process your waiver, we will verify that:
1. Your Graduation Fee has been settled.
2. You have answered and submitted the Graduate Tracer Study survey.

Once you have completed your Tracer Study survey through this portal, kindly notify us or visit the office so we can proceed with signing your clearance. Thank you!`,
        coordinatorTemplate: `Hello {alumni_name},

Good day! Regarding clearance signatures for Transcript of Records (TOR) and Waivers, please note the following guidelines:

• For Transcript of Records (TOR - Graduates/Alumni):
Before clearance for your TOR request can be signed and endorsed, we verify that you have an updated profile and have completed the Graduate Tracer Study survey.

• For Graduation Clearance / Waiver (Graduating Students):
To process and endorse your waiver, we verify that:
1. Your Graduation Fee has been settled.
2. You have answered and submitted the Graduate Tracer Study survey on this portal.

Once you have completed your Tracer Study survey, kindly reply here or visit our department so we can verify your submission and proceed with signing your clearance. Thank you!`
    },
    {
        id: 'alumni-id',
        category: 'Alumni ID',
        title: 'Alumni ID Requirements & Issuance',
        alumniPrompt: 'How can I get my Alumni ID?',
        defaultInquiryMessage: 'Good day! I would like to ask about the requirements and process for securing my Alumni ID. Thank you!',
        keywords: [
            'alumni id',
            'claim alumni id',
            'get alumni id',
            'kuha ng alumni id',
            'alumni identification',
            'id issuance',
            'request alumni id',
            'how to get alumni id'
        ],
        template: `Hello {alumni_name},

Good day! Regarding your inquiry about the Alumni ID, please take note of the following:

• Requirement to Present:
Please present the original copy of your Graduation Fee Official Receipt at the Alumni Affairs Office.

• Important Notes:
- The graduation fee receipt serves as official proof of your graduation.
- The Alumni ID is already included and covered as part of your graduation fee package.

Once you present your receipt, our office will verify your record and proceed with issuing your Alumni ID. Please visit us during regular office hours. Thank you!`,
        coordinatorTemplate: `Hello {alumni_name},

Good day! Regarding your inquiry about the Alumni ID, please take note of the following guidelines:

• Requirement to Present:
Please present the original copy of your Graduation Fee Official Receipt at the Alumni Affairs Office.

• Important Notes:
- The graduation fee receipt serves as official proof that your Alumni ID was included as part of your graduation fee package.
- The Alumni Affairs Office will verify your record and issue your official Alumni ID upon presenting your receipt.

Please visit the Alumni Affairs Office during regular office hours to secure your ID. Let me know if you need any assistance regarding your records. Thank you!`
    }
];

/**
 * Get the appropriate template for a given role ('admin' or 'coordinator')
 */
export function getSuggestionTemplate(item, role = 'admin') {
    if (!item) return '';
    if (role === 'coordinator' && item.coordinatorTemplate) {
        return item.coordinatorTemplate;
    }
    return item.template || '';
}

/**
 * Get all suggestions formatted for a given role
 */
export function getInquirySuggestions(role = 'admin') {
    return INQUIRY_SUGGESTIONS.map(item => ({
        ...item,
        template: getSuggestionTemplate(item, role)
    }));
}

/**
 * Replace placeholders like {alumni_name} in template
 */
export function formatSuggestion(template, { alumniName } = {}) {
    if (!template) return '';
    const name = alumniName ? alumniName.trim() : 'there';
    return template.replace(/\{alumni_name\}/g, name);
}

/**
 * Detect the best matching canned response based on subject and message
 */
export function getBestMatchingSuggestion(subject = '', message = '') {
    const combined = `${subject} ${message}`.toLowerCase();
    if (!combined.trim()) return null;

    let bestMatch = null;
    let highestScore = 0;

    for (const item of INQUIRY_SUGGESTIONS) {
        let score = 0;
        for (const kw of item.keywords) {
            const kwLower = kw.toLowerCase();
            if (combined.includes(kwLower)) {
                // Multi-word phrases give a higher score than single words
                const wordCount = kwLower.split(' ').length;
                score += wordCount * 2;
            }
        }

        if (score > highestScore) {
            highestScore = score;
            bestMatch = item;
        }
    }

    return highestScore > 0 ? bestMatch : null;
}
