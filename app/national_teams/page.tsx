import Teams from "@/components/Teams";
import national_teams from "@/data/national_teams";
import confederations from "@/data/confedertions";

export default function TeamsPage() {
  return (
    <main>
        <Teams entityData={confederations} teamsData={national_teams}/>
    </main>
  );
}
