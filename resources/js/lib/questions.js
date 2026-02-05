const personalInfo = {
        "title" : "Personal Information",
        "desc": "Please select the option that applies to you or supply the needed information as completely as possible.",
        "questions" : [
            {
                "id": "last_name",
                "label": "Lastname",
                "type": "text",
                "placeholder": "Lastname",
                "validation": {min:18, max:99}
            },
            {
                "id": "first_name",
                "label": "Firstname",
                "type": "text",
                "placeholder": "Firstname",
                "validation": {min:18, max:99}
            },
            {
                "id": "middle_name",
                "label": "Middlename",
                "type": "text",
                "placeholder": "Middlename",
                "validation": {min:18, max:99}
            },
            ////////////////////////////////////
            {
                "id": "address",
                "label": "Home Address",
                "type": "text",
                "placeholder": "Home Address",
                "validation": {min:18, max:99}
            },
            {
                "id": "email",
                "label": "Email Address",
                "type": "text",
                "placeholder": "Email Address",
                "validation": {min:18, max:99}
            },
            {
                "id": "contact",
                "label": "Mobile Number",
                "type": "tel",
                "placeholder": "ex. 0912 345 6789",
                "validation": {
                    "required": true,
                    "pattern": "^[0-9]{11}$",
                    "message": "Please enter a valid 11-digit mobile number"
                    }
            },
            //////////////////////////////////
            {
                "id": "degree",
                "label": "Bachelor's Degree obtained from Wesleyan University-Philippines",
                "type": "select",
                "placeholder": "Select your degree",
                "options": [
                    { "label": "Bachelor of Science in Compuuter Engineering", "value": "bscpe" },
                    { "label": "Bachelor of Science in Electronics Computer Engineering", "value": "bsece" },
                    { "label": "Bachelor of Science in Information Technology", "value": "bsit" }
                ],
                "validation": { "required": true }
            },
            {
                "id": "year_graduated",
                "label": "Year Graduated",
                "type": "year_select",
                "min": 1990,
                "max": 2026,
                "validation": { "required": true }
            }
        ]
    }


export default personalInfo;