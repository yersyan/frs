import Teams from "@/components/Teams";
import countries from "@/data/countries";
import clubs from "@/data/clubs";

export default function TeamsPage() {
  return (
    <main>
        <Teams entityData={countries} teamsData={clubs}/>
    </main>
  );
}
