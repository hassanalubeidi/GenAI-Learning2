export const cvSchema = {
    name: "save_cv",
    description: "save cv to mongo db",
    parameters: {
        type: "object",
        properties: {
          firstName: {
            type: "string",
            title: "First name",
            "ui:placeholder": "John",
            "ui:colSpan": 1,
          },
          lastName: {
            type: "string",
            title: "Last name",
            "ui:placeholder": "Doe",
            "ui:colSpan": 1,
          },
          email: {
            type: "string",
            title: "Email",
            "ui:placeholder": "johndoe@example.com",
            "ui:colSpan": 2,
          },
          phone: {
            type: "string",
            title: "Phone Number",
            "ui:placeholder": "(123) 456-7890",
            "ui:colSpan": 2,
          },
          address: {
            type: "string",
            title: "Address",
            "ui:placeholder": "123 Main St, City, State, ZIP",
            "ui:colSpan": 2,
          },
          experiences: {
            type: "array",
            title: "Work Experience",
            items: {
              type: "object",
              properties: {
                company: {
                  type: "string",
                  title: "Company",
                  "ui:placeholder": "Company Name",
                },
                position: {
                  type: "string",
                  title: "Position",
                  "ui:placeholder": "Job Title",
                },
                description: {
                  type: "string",
                  title: "Description",
                  "ui:widget": "textarea",
                  "ui:placeholder": "Describe your role and responsibilities",
                },
                startDate: {
                  type: "string",
                  title: "Start Date",
                  format: "date",
                  "ui:colSpan": 1,
                },
                endDate: {
                  type: "string",
                  title: "End Date",
                  format: "date",
                  "ui:colSpan": 1,
                },
              },
              required: ["company", "position", "description", "startDate"],
            },
            "ui:options": {
              orderable: false,
              addable: true,
              removable: true,
            },
          },
          education: {
            type: "array",
            title: "Education",
            items: {
              type: "object",
              properties: {
                institution: {
                  type: "string",
                  title: "Institution",
                  "ui:placeholder": "School or University",
                },
                degree: {
                  type: "string",
                  title: "Degree",
                  "ui:placeholder": "Degree or Program",
                },
                fieldOfStudy: {
                  type: "string",
                  title: "Field of Study",
                  "ui:placeholder": "Major or Specialization",
                },
                grade: {
                  type: "string",
                  title: "Grade",
                  "ui:placeholder": "Grade or GPA",
                },
                startDate: {
                  type: "string",
                  title: "Start Date",
                  format: "date",
                  "ui:colSpan": 1,
                },
                endDate: {
                  type: "string",
                  title: "End Date",
                  format: "date",
                  "ui:colSpan": 1,
                },
              },
              required: ["institution", "degree", "fieldOfStudy", "startDate"],
            },
            "ui:options": {
              orderable: false,
              addable: true,
              removable: true,
            },
          },
        },
        required: ["firstName", "lastName", "email", "phone", "address", "experiences", "education"],
      },
  };