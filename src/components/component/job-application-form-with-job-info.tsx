import { useForm } from "react-hook-form";
import { CardTitle, CardHeader, CardContent, Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import classNames from "classnames";
import { DividerHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { fillFormWithAI } from "../../ai/aiService";
import useFileUpload from "~/lib/hooks";
import { useParams } from "next/navigation";
import { api } from "~/utils/api";
import { cvSchema } from "~/ai/cvSchema";

const FormField = ({ field, register }) => {
  const {
    label,
    id,
    type,
    placeholder,
    required,
    component: Component = Input,
    className,
    disabled = false,
    onChange
  } = field;

  return (
    <div
      className={classNames(
        "space-y-2",
        field.colSpan === 2 ? "col-span-2" : "col-span-1"
      )}
    >
      <Label htmlFor={id}>{label}</Label>
      <Component
        onChange={onChange}
        disabled={disabled}
        id={id}
        type={type}
        placeholder={placeholder}
        className={className}
        {...field}
        {...register(id, { required })}
      />
    </div>
  );
};


const jobDetails = {
  position: "Software Engineer",
  location: "Remote",
  salary: "$80,000 - $100,000",
};

export function JobApplicationFormWithJobInfo() {
  const params = useParams();
  const jobId = params && params.id ? parseInt(params.id as string) : null
  const {data: job} = api.jobListing.getJobListing.useQuery({ id: jobId })
  const [formValues, setFormValues] = useState({})
  const { register, handleSubmit, setValue, getValues, control } = useForm({
    values: formValues,
  });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone, setAiDone] = useState(false);
  ;
  
  

  const autoFillForm = async (content: string) => {
    setAiLoading(true);
    const parsedFormResponse = await fillFormWithAI(content, cvSchema, (parsedFormResponse) => {
      setFormValues(parsedFormResponse);
    }, () => {
      
    });
    
    setAiLoading(false);
    setAiDone(true);
  };

  const { extractedText, handleFileUpload } = useFileUpload();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission logic here
  };

  
  

  return (
    <div className="mx-auto max-w-[600px] space-y-6 px-4">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Job Application</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Please fill out the form below to apply for the job
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
        </CardHeader>
        <CardContent>
          {
            job && <ul>
              <li><span>Position:</span> {job.title}</li>
              <li><span>Company:</span> {job.company}</li>
              <li><span>Location:</span> {job.location}</li>
              <li><span>Job Type:</span> {job.jobType}</li>
            </ul>
          }
        </CardContent>
      </Card>
      <div className="py-4">
        <Input type="file" onChange={handleFileUpload} />
        <Button disabled={(extractedText === '') || (aiLoading || aiDone)} className="mt-2" onClick={() => autoFillForm(extractedText)}>
          Fill form with AI 🔮
        </Button>
      </div>

      {aiLoading && (
        <span>
          <DividerHorizontalIcon /> Loading...<DividerHorizontalIcon />
        </span>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(cvSchema.parameters.properties).filter(([key, field]) => field.type !== 'array').map(([key, field]) => (
            <FormField
              key={key}
              field={{
                id: key,
                label: field.title,
                type: field.type,
                placeholder: field["ui:placeholder"],
                required: cvSchema.parameters.required.includes(key),
                component: field["ui:widget"] === "textarea" ? Textarea : Input,
                className: field["ui:widget"] === "textarea" ? "min-h-[100px]" : "",
                colSpan: field["ui:colSpan"],
              }}
              register={register}
            />
          ))}
        </div>
        {Object.entries(cvSchema.parameters.properties).filter(([key, field]) => field.type == 'array').map(([key, field]) => (
            <div className="w-full">
              { getValues(key) && <div className="pt-8 pb-4"><Label className="py-8"><strong className="py-8">{field.title}:</strong></Label></div> }
              
              {
                getValues(key) && getValues(key).map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 pb-12">
                    {Object.entries(field.items.properties).map(([subKey, subField]) => (
                      <FormField
                        key={`${key}.${subKey}[${index}]`}
                        field={{
                          id: `${key}.${subKey}[${index}]`,
                          label: subField.title,
                          type: subField.type,
                          placeholder: subField["ui:placeholder"],
                          required: field.items.required.includes(`${key}.${subKey}[${index}]`),
                          component: subField["ui:widget"] === "textarea" ? Textarea : Input,
                          className: subField["ui:widget"] === "textarea" ? "min-h-[100px]" : "",
                          colSpan: subField["ui:colSpan"] ?? 2,
                          value: item[subKey] ?? "",

                        }}
                        register={register}
                      />
                    ))}
                  </div>
                ))
              }

            </div>
              
            
          ))}
        <div className="pb-8">
          <Button className="w-full p" type="submit" disabled={!aiDone}>
            Submit Application
          </Button>
        </div>
        
      </form>
    </div>
  );
}