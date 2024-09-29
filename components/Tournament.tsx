"use client";

import React, {FC, useEffect, useState, useCallback} from 'react';
import {Match, Standings, Team} from "@/utils/types/interfaces";
import MatchesComponent from "@/components/MatchesComponent";
import generateRoundRobinSchedule from "@/utils/helpers/generateRoundRobinSchedule";
import simulateMatch from "@/utils/helpers/simulateMatch";
import sortTeams from "@/utils/helpers/sortTeams";
import StandingsTable from "@/components/StandingsTable";
import {WINNERS_PAGE} from "@/utils/routes/pages";
import checkForExtraTime from "@/utils/helpers/checkForExtraTime";
import createStandings from "@/utils/helpers/createStandings";
import Pages from "@/components/ui/Pages";
import distributeTeamsIntoGroups from "@/utils/helpers/distributeTeamsIntoGroups";

const Tournament: FC = () => {
    const [roundIndex, setRoundIndex] = useState(0);
    const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
    const [groupsMatches, setGroupsMatches] = useState<Match[][][]>([]);
    const [standings, setStandings] = useState<{ [key: number]: Standings }>({});
    const [hideTables, setHideTables] = useState(false);
    const [allMatchesCompleted, setAllMatchesCompleted] = useState(false);

    // Функция для получения данных из localStorage с мемоизацией
    const getSimulatorOptions = useCallback(() => {
        const storedOptions = localStorage.getItem('simulatorOptions');
        return storedOptions ? JSON.parse(storedOptions) : [];
    }, []);

    useEffect(() => {
        const options = getSimulatorOptions();
        if (!options.length) return;

        const {teams, gamesOption, groups} = options[roundIndex];

        setSelectedTeams(teams);

        const allGroupsMatches: Match[][][] = groups.map(group => generateRoundRobinSchedule(group, gamesOption));
        setGroupsMatches(allGroupsMatches);

        // Инициализация standings для каждой группы
        setStandings(createStandings(groups));

        // Скрыть таблицы, если во всех группах по 2 команды
        setHideTables(groups.every(group => group.length === 2));
    }, [roundIndex, getSimulatorOptions]);

    // Проверка, завершены ли все матчи
    const checkAllMatchesCompleted = useCallback(() => {
        const completed = groupsMatches.every(groupMatches =>
            groupMatches.every(roundMatches =>
                roundMatches.every(match => match.simulated)
            )
        );
        setAllMatchesCompleted(completed);
        if (completed) {
            determineAdvancingTeams();
        }
    }, [groupsMatches]);

    useEffect(() => {
        if (groupsMatches.length) {
            checkAllMatchesCompleted();
        }
    }, [groupsMatches, checkAllMatchesCompleted]);

    // Функция для определения проходящих команд
    const determineAdvancingTeams = useCallback(() => {
        const options = getSimulatorOptions();
        const {teamsAdvance, selectedGroups, additionalAdvance} = options[roundIndex];

        const advancing: Team[] = [];
        const thirdPlaceTeams: Team[] = [];

        Object.keys(standings).forEach(groupIndex => {
            const sortedTeams = sortedTeamsByGroup(parseInt(groupIndex), selectedTeams, groupsMatches, standings);
            advancing.push(...sortedTeams.slice(0, teamsAdvance));

            if (selectedGroups === 1) {
                if (teamsAdvance === 2) {
                    thirdPlaceTeams.push(sortedTeams[2]);
                }
            } else if (selectedTeams.length === 4 && selectedGroups === 2) {
                thirdPlaceTeams.push(...sortedTeams.slice(teamsAdvance));
            }
        });

        if (additionalAdvance > 0) {
            const nextPositionTeams: Team[] = [];
            Object.keys(standings).forEach(groupIndex => {
                const sortedTeams = sortedTeamsByGroup(parseInt(groupIndex), selectedTeams, groupsMatches, standings);
                if (sortedTeams.length > teamsAdvance) {
                    nextPositionTeams.push(sortedTeams[teamsAdvance]);
                }
            });

            nextPositionTeams.sort((a, b) => {
                const teamAStats = standings[getGroupIndexByTeam(a)][a.id];
                const teamBStats = standings[getGroupIndexByTeam(b)][b.id];

                if (teamAStats.Pts !== teamBStats.Pts) {
                    return teamBStats.Pts - teamAStats.Pts;
                }
                return teamBStats.GD !== teamAStats.GD
                    ? teamBStats.GD - teamAStats.GD
                    : teamBStats.GF - teamAStats.GF;
            });

            advancing.push(...nextPositionTeams.slice(0, additionalAdvance));
        }

        // Сортируем проходящие команды по месту в группе
        advancing.sort((a, b) => {
            // Найдем индексы команд в группах (это их позиции)
            const groupIndexA = getGroupIndexByTeam(a);
            const groupIndexB = getGroupIndexByTeam(b);

            const positionA = sortedTeamsByGroup(groupIndexA, selectedTeams, groupsMatches, standings).findIndex(team => team.id === a.id);
            const positionB = sortedTeamsByGroup(groupIndexB, selectedTeams, groupsMatches, standings).findIndex(team => team.id === b.id);

            if (positionA !== positionB) {
                return positionA - positionB; // Сортировка по позиции в группе
            }

            const teamAStats = standings[groupIndexA][a.id];
            const teamBStats = standings[groupIndexB][b.id];

            if (teamAStats.Pts !== teamBStats.Pts) {
                return teamBStats.Pts - teamAStats.Pts; // Сортировка по очкам
            }
            if (teamBStats.GD !== teamAStats.GD) {
                return teamBStats.GD - teamAStats.GD; // Сортировка по разности мячей
            }
            if (teamBStats.GF !== teamAStats.GF) {
                return teamBStats.GF - teamAStats.GF; // Сортировка по забитым мячам
            }
            // Сортировка по дополнительным параметрам, если все прочие равны
            return a.position - b.position;
        });

        if (options[roundIndex + 1]) {
            const groups = distributeTeamsIntoGroups(advancing, options[roundIndex + 1].selectedGroups, false);
            options[roundIndex + 1].teams = advancing; // Обновляем команды для текущего раунда
            options[roundIndex + 1].groups = groups; // Обновляем команды для текущего раунда
            localStorage.setItem('simulatorOptions', JSON.stringify(options)); // Сохраняем обратно
        }
        localStorage.setItem('rightTeams', JSON.stringify(advancing));
    }, [selectedTeams, standings, groupsMatches, getSimulatorOptions]);



    const getGroupIndexByTeam = (team: Team): number => {
        return parseInt(Object.keys(standings).find(groupIndex =>
            groupsMatches[parseInt(groupIndex)].some(roundMatches =>
                roundMatches.some(match => match.home.id === team.id || match.away.id === team.id)
            )
        ) as string);
    };

    // Функция для симуляции матча с поддержкой дополнительного времени
    const handleSimulateMatch = useCallback((
        groupIndex: number,
        roundIndex: number,
        matchIndex: number,
        score: { homeScore: number, awayScore: number } = { homeScore: 0, awayScore: 0 },
        count: number = 0,
        extraTimeScore: { homeETScore: number, awayETScore: number } | undefined = undefined
    ) => {
        const groupMatches = groupsMatches[groupIndex];
        const {
            updatedMatches,
            updatedStandings
        } = simulateMatch(groupMatches, standings[groupIndex], roundIndex, matchIndex, score, count, extraTimeScore);
        const updatedGroupsMatches = [...groupsMatches];
        updatedGroupsMatches[groupIndex] = updatedMatches;
        setGroupsMatches(updatedGroupsMatches);
        setStandings({...standings, [groupIndex]: updatedStandings});
        ++count

        let extraTime = checkForExtraTime(updatedGroupsMatches, {...standings, [groupIndex]: updatedStandings}, groupIndex);

        if(extraTime && count === 1){
            handleSimulateMatch(
                groupIndex,
                roundIndex,
                matchIndex,
                {
                    homeScore: updatedMatches.length === 1 ? updatedMatches[0][0].homeGoals ?? 0 : updatedMatches[1][0].homeGoals ?? 0,
                    awayScore: updatedMatches.length === 1 ? updatedMatches[0][0].awayGoals ?? 0 : updatedMatches[1][0].awayGoals ?? 0
                },
                count
            )
        }

        if (extraTime && count === 2){
            handleSimulateMatch(
                groupIndex,
                roundIndex,
                matchIndex,
                updatedMatches[0][0].score,
                count,
                {
                    homeETScore: updatedMatches.length === 1 ? updatedMatches[0][0].homeGoals ?? 0 : updatedMatches[1][0].homeGoals ?? 0,
                    awayETScore: updatedMatches.length === 1 ? updatedMatches[0][0].awayGoals ?? 0 : updatedMatches[1][0].awayGoals ?? 0
                }
            )
        }
    }, [groupsMatches, standings]);

    const sortedTeamsByGroup = useCallback((groupIndex: number, teams: Team[], matches: Match[][][], teamStandings: { [key: number]: Standings }) => {
        return sortTeams(
            teams.filter(team => matches[groupIndex].some(match => match.some(m => m.home.id === team.id || m.away.id === team.id))),
            teamStandings[groupIndex]
        );
    }, []);

    return (
        <div className="bg-gray-100 p-2">
            <div className="mt-4 flex gap-2">
                {allMatchesCompleted &&
                    <div>
                        {roundIndex === getSimulatorOptions().length - 1
                            ? <Pages pages={[WINNERS_PAGE]} />
                            : <span
                                onClick={() => setRoundIndex(roundIndex + 1)}
                                className="text-sm bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                                Next
                              </span>}
                    </div>
                }
            </div>

            {!hideTables && (
                <div className="overflow-x-auto mt-2">
                    {Object.keys(standings).map((groupIndex) => (
                        <StandingsTable
                            key={groupIndex}
                            groupIndex={parseInt(groupIndex)}
                            standings={standings[parseInt(groupIndex)]}
                            sortedTeams={sortedTeamsByGroup(parseInt(groupIndex), selectedTeams, groupsMatches, standings)}
                        />
                    ))}
                </div>
            )}

            <MatchesComponent groupsMatches={groupsMatches} simulateMatch={handleSimulateMatch} />
        </div>
    );
};

export default Tournament;
