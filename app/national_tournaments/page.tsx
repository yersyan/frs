import Teams from "@/components/Teams";
import national_tournaments_teams from "@/data/national_tournaments_teams";
import national_tournaments_countries from "@/data/national_tournaments_countries";

export default function NationalTournamentsPage() {

  return (
    <main>
        <Teams entities={national_tournaments_countries} teamsData={national_tournaments_teams}/>
    </main>
  );
}
