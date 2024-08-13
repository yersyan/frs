import countries from "@/data/countries";
// import clubs from "@/data/clubs";
import axios from "axios";
import Clubs from "@/components/Clubs";

export default async function TeamsPage() {

  const clubs = await axios.get("https://comp.uefa.com/v2/coefficients?coefficientRange=OVERALL&coefficientType=MEN_CLUB&language=EN&page=1&pagesize=500&seasonYear=2025")

  return (
    <main>
        <Clubs entities={countries} clubs={clubs.data.data.members}/>
    </main>
  );
}
