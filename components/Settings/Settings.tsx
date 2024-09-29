"use client";

import React, {useEffect, useState} from "react";
import {Team} from "@/utils/types/interfaces";
import SelectedGroups from "@/components/Settings/SelectedGroups";
import distributeTeamsIntoGroups from "@/utils/helpers/distributeTeamsIntoGroups";
import TeamList from "@/components/teams/TeamList";
import ShuffleGroups from "@/components/Settings/ShuffleGroups";
import Stepper from "@/components/ui/Stepper";
import TeamsAdvance from "@/components/Settings/TeamsAdvance";
import GamesOption from "@/components/Settings/GamesOption";
import {TOURNAMENT_PAGE} from "@/utils/routes/pages";
import Pages from "@/components/ui/Pages";

const Settings: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [rounds, setRounds] = useState<any[]>([]); // State for tracking all rounds
    const [currentStep, setCurrentStep] = useState<number>(1); // Step state
    const [groupCount, setGroupCount] = useState<number>(1); // Step state

    useEffect(() => {
        const storedOptions = localStorage.getItem("simulatorOptions");
        if (storedOptions) {
            const optionsArray = JSON.parse(storedOptions);
            setTeams(optionsArray[0].teams);
            setRounds(optionsArray);
        }
    }, []);

    useEffect(() => {
        if (rounds.length && teams.length > 1) {
            const currentRound = rounds[currentStep - 1];
            const allGroups = distributeTeamsIntoGroups(teams, currentRound.selectedGroups);
            setRounds((prev) => {
                const newRounds = [...prev];
                newRounds[currentStep - 1].groups = allGroups;
                return newRounds;
            });
        }
    }, [groupCount, teams, currentStep]);

    // Save options for each round into localStorage
    const saveOptionsToLocalStorage = () => {
        localStorage.setItem("simulatorOptions", JSON.stringify(rounds));
    };

    // Handle moving to the next round
    const nextStep = () => {
        const currentRound = rounds[currentStep - 1];
        const advancingTeams = teams.slice(0, currentRound.selectedGroups * currentRound.teamsAdvance + currentRound.additionalAdvance);

        const changedAdvancingTeams = advancingTeams.map((team, index) => {
            return {
                ...team,
                name: `Team ${index + 1}`,
                image: '/images/flag.png',
                position: 0
            };
        });

        if (teams.length < 2) {
            return;
        }

        saveOptionsToLocalStorage();

        const newRound = {
            step: currentStep + 1,
            teamsAdvance: 1,
            additionalAdvance: 0,
            gamesOption: 1,
            selectedGroups: 1,
            teams: changedAdvancingTeams,
        };

        setGroupCount(1)
        setRounds([...rounds, newRound]);
        setTeams(changedAdvancingTeams);
        setCurrentStep(currentStep + 1);
    };

    // Handle moving to the previous step
    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            const previousRound = rounds[currentStep - 2];
            setTeams(previousRound.teams);  // Восстанавливаем команды для предыдущего шага
        }
    };

    const resetFutureRounds = (fromStep: number) => {
        setRounds((prevRounds) => prevRounds.slice(0, fromStep));
    };

    return (
        <div className="mb-4">
            {rounds.map((round, index) => (
                <div key={index} className={index + 1 === currentStep ? "block" : "hidden"}>
                    {round.groups?.length > 0 ? (
                        <>
                            <h2 className="text-lg font-bold mb-2">Teams by Groups (Round {round.step})</h2>
                            {currentStep === 1 && <ShuffleGroups
                                teams={teams}
                                groups={round.groups}
                                setGroups={(newGroups) => {
                                    setRounds((prev) => {
                                        const newRounds = [...prev];
                                        newRounds[round.step - 1].groups = newGroups;
                                        return newRounds;
                                    });
                                }}
                            />}
                            <div className="flex flex-wrap gap-4">
                                {round.groups.map((group: Team[], groupIndex: number) => (
                                    <div key={groupIndex} className="mb-4">
                                        <h3 className="text-md font-semibold mb-2">Group {groupIndex + 1}</h3>
                                        <TeamList
                                            teams={group}
                                            column
                                            teamsAdvance={round.teamsAdvance}
                                            additionalAdvance={round.additionalAdvance}
                                        />
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-lg font-bold mb-2">Teams (Round {round.step})</h2>
                            <TeamList
                                teams={teams}
                                column
                                teamsAdvance={round.teamsAdvance}
                                additionalAdvance={round.additionalAdvance}
                            />
                        </>
                    )}
                    <SelectedGroups
                        teamsCount={teams.length}
                        selectedGroups={round.selectedGroups}
                        setSelectedGroups={(newGroups) => {
                            setGroupCount(newGroups)
                            setRounds((prev) => {
                                const newRounds = [...prev];
                                newRounds[round.step - 1].selectedGroups = newGroups;
                                return newRounds;
                            });
                            resetFutureRounds(currentStep);
                        }}
                    />
                    <TeamsAdvance
                        teams={teams}
                        selectedGroups={round.selectedGroups}
                        teamsAdvance={round.teamsAdvance}
                        setTeamsAdvance={(newAdvance) => {
                            setRounds((prev) => {
                                const newRounds = [...prev];
                                newRounds[round.step - 1].teamsAdvance = newAdvance;
                                return newRounds;
                            });
                            resetFutureRounds(currentStep);
                        }}
                        additionalAdvance={round.additionalAdvance}
                        setAdditionalAdvance={(newAdditionalAdvance) => {
                            setRounds((prev) => {
                                const newRounds = [...prev];
                                newRounds[round.step - 1].additionalAdvance = newAdditionalAdvance;
                                return newRounds;
                            });
                            resetFutureRounds(currentStep);
                        }}
                    />
                    <GamesOption
                        gamesOption={round.gamesOption}
                        setGamesOption={(newGamesOption) => {
                            setRounds((prev) => {
                                const newRounds = [...prev];
                                newRounds[round.step - 1].gamesOption = newGamesOption;
                                return newRounds;
                            });
                            resetFutureRounds(currentStep);
                        }}
                    />
                </div>
            ))}


            <Stepper teamsLength={teams.length} currentStep={currentStep} nextStep={nextStep} prevStep={prevStep}/>

            {teams.length <= 1 && <Pages pages={[TOURNAMENT_PAGE]}/>}
        </div>
    );
};

export default Settings;
