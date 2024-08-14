import national_teams from "@/data/national_teams";
import confederations from "@/data/confedertions";
import Teams from "@/components/Teams";

export default function NationalTeamsPage() {

  const nationalTeams = national_teams.map((team) => {
      if(team.entity === 1){
          team.entity = "CONMEBOL"
      } else if(team.entity === 2){
          team.entity = "UEFA"
      } else if(team.entity === 3){
          team.entity = "CAF"
      }
      else if(team.entity === 4){
          team.entity = "AFC"
      }
      else if(team.entity === 5){
          team.entity = "CONCACAF"
      }
      else if(team.entity === 6){
          team.entity = "OFC"
      }

      return {
          ...team,
          position: team.id
      }
  })

  return (
    <main>
        <Teams entities={confederations} teamsData={nationalTeams}/>
    </main>
  );
}
