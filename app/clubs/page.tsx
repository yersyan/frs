import countries from "@/data/countries";
import axios from "axios";
import {Team} from "@/types/interfaces";
import Teams from "@/components/Teams";

export default async function TeamsPage() {

  const data = await axios.get("https://comp.uefa.com/v2/coefficients?coefficientRange=OVERALL&coefficientType=MEN_CLUB&language=EN&page=1&pagesize=500&seasonYear=2025")

  const clubs: Team[] = data.data.data.members.map((club: any) => {
      return {
          id: +club.member.id,
          name: club.member.displayName,
          entity: club.member.countryName,
          image: club.member.logoUrl,
          position: club.overallRanking.position
      }
  })

  return (
    <main>
        <Teams entities={countries} teamsData={clubs}/>
    </main>
  );
}
