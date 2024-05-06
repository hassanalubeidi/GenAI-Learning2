import { useParams } from "next/navigation";
import { ApplicantDetails } from "~/components/component/applicant-details";

export default function ApplicationDetailsPage() {
    const params = useParams();

    const applicationId = params ? parseInt(params.applicationId as string) : null;

    return (
        <div>
            <ApplicantDetails id={applicationId} />
        </div>
    )
}