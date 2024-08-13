import NationalTeams from "@/components/NationalTeams";
import national_teams from "@/data/national_teams";
import confederations from "@/data/confedertions";

export default function NationalTeamsPage() {
  return (
    <main>
        <NationalTeams entities={confederations} nationalTeams={national_teams}/>
    </main>
  );
}
