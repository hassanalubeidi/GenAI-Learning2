import { CardTitle, CardHeader, CardContent, Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";

type FormFieldProps = {
  label: string;
  id: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  component?: any;
  className?: string;
};

const FormField = ({ label, id, placeholder, type = "text", required = true, component: Component = Input, className = "" }: FormFieldProps) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Component className={className} id={id} placeholder={placeholder} required={required} type={type} />
  </div>
);

const jobDetails = {
  position: "Software Engineer",
  location: "Remote",
  salary: "$80,000 - $100,000",
};

const formFields = [
  { label: "First name", id: "first-name", placeholder: "John", colSpan: 1 },
  { label: "Last name", id: "last-name", placeholder: "Doe", colSpan: 1 },
  { label: "Email", id: "email", placeholder: "johndoe@example.com", type: "email" },
  { label: "Phone Number", id: "phone", placeholder: "(123) 456-7890" },
  { label: "Address", id: "address", placeholder: "123 Main St, City, State, ZIP" },
  { label: "Upload Resume", id: "resume", type: "file" },
  { label: "Cover Letter", id: "cover-letter", placeholder: "Tell us about yourself", component: Textarea, className: "min-h-[100px]" },
];

export function JobApplicationFormWithJobInfo() {
  return (
    <div className="mx-auto max-w-[600px] space-y-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Job Application</h1>
        <p className="text-gray-500 dark:text-gray-400">Please fill out the form below to apply for the job</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">Position: {jobDetails.position}</p>
          <p className="text-gray-500 dark:text-gray-400">Location: {jobDetails.location}</p>
          <p className="text-gray-500 dark:text-gray-400">Salary: {jobDetails.salary}</p>
        </CardContent>
      </Card>
      <div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {formFields.filter(field => field.colSpan === 1).map(field => (
              <FormField key={field.id} {...field} />
            ))}
          </div>
          {formFields.filter(field => !field.colSpan).map(field => (
            <FormField key={field.id} {...field} />
          ))}
          <Button className="w-full" type="submit">
            Submit Application
          </Button>
        </div>
      </div>
    </div>
  );
}