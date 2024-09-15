import countries from "@/utils/data/countries";
import axios from "axios";
import {Team} from "@/utils/types/interfaces";
import Teams from "@/components/teams/Teams";
import clubs from "@/utils/data/clubs";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "FRS | Clubs",
    description: "",
};

export default async function ClubsPage() {

  const data = await axios.get("https://comp.uefa.com/v2/coefficients?coefficientRange=OVERALL&coefficientType=MEN_CLUB&language=EN&page=1&pagesize=500&seasonYear=2025")

  const clubsFromServer: Team[] = data.data.data.members.map((club: any) => {
      return {
          id: +club.member.id,
          name: club.member.displayName,
          entity: club.member.countryName,
          image: `https://api.fifa.com/api/v3/picture/flags-sq-2/${club.member.countryCode}`,
          position: club.overallRanking.position
      }
  })

  const clubsData: Team[] = [...clubsFromServer, ...clubs]

  return (
    <main>
        <Teams entities={countries} teamsData={clubsData}/>
    </main>
  );
}
