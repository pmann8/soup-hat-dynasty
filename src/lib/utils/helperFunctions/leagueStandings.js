import { leagueID } from '$lib/utils/leagueInfo';
import { getNflState } from "./nflState"
import { getLeagueData } from "./leagueData"
import { getLeagueRosters } from "./leagueRosters"
import { waitForAll } from './multiPromise';
import { get } from 'svelte/store';
import { standingsStore } from '$lib/stores';
import { round } from './universalFunctions';

export const getLeagueStandings = async () => {
    if (get(standingsStore).standingsInfo) {
        return get(standingsStore);
    }

    const [nflState, leagueData, rostersData] = await waitForAll(
        getNflState(),
        getLeagueData(),
        getLeagueRosters(),
    ).catch((err) => { console.error(err); });

    const yearData = leagueData.season;
    const regularSeasonLength = leagueData.settings.playoff_week_start - 1;
    const divisions = leagueData.settings.divisions && leagueData.settings.divisions > 1;
    const rosters = rostersData;

    // if the season hasn't started, standings can't be created
    if ((leagueData.status != "in_season" && leagueData.status != "post_season" && leagueData.status != "complete") || nflState.week < 1) {
        return null;
    }

    let standings = {};
    for (const rosterID in rosters) {
        const roster = rosters[rosterID];
        standings[rosterID] = {
            rosterID,
            wins: roster.settings.wins,
            losses: roster.settings.losses,
            ties: roster.settings.ties,
            fpts: round(roster.settings.fpts + (roster.settings.fpts_decimal / 100)),
            fptsAgainst: round(roster.settings.fpts_against + (roster.settings.fpts_against_decimal / 100)),
            maxFpts: round(roster.settings.ppts + (roster.settings.ppts_decimal / 100)),
            ptsDiff: round(round(roster.settings.fpts + (roster.settings.fpts_decimal / 100)) - round(roster.settings.fpts_against + (roster.settings.fpts_against_decimal / 100))),
            streak: roster.metadata?.streak || 0,
        }
    }

    if (nflState.season_type == 'regular' && nflState.week == '1') {
        for (const rosterID in rosters) {
            standings[rosterID].fpts = 0
            standings[rosterID].fptsAgainst = 0
        }
    }

    if (divisions) {
        let week = 0;
        if (nflState.season_type == 'regular') {
            // max the week out at end of regular season
            week = nflState.display_week > regularSeasonLength ? regularSeasonLength + 1 : nflState.display_week;
        } else if (nflState.season_type == 'post') {
            week = regularSeasonLength + 1;
        }

        // if at least one week hasn't been completed, then standings can't be created
        if (week < 2) {
            return null;
        }

        // pull in all matchup data for the season
        const matchupsPromises = [];
        for (let i = week - 1; i > 0; i--) {
            matchupsPromises.push(fetch(`https://api.sleeper.app/v1/league/${leagueID}/matchups/${i}`, { compress: true }))
        }
        const matchupsRes = await waitForAll(...matchupsPromises);

        // convert the json matchup responses
        const matchupsJsonPromises = [];
        for (const matchupRes of matchupsRes) {
            const data = matchupRes.json();
            matchupsJsonPromises.push(data)
            if (!matchupRes.ok) {
                throw new Error(data);
            }
        }
        const matchupsData = await waitForAll(...matchupsJsonPromises).catch((err) => { console.error(err); }).catch((err) => { console.error(err); });

        // process all the matchups
        for (const matchup of matchupsData) {
            standings = processStandings(matchup, standings, rosters);
        }
    }

    const response = {
        standingsInfo: standings,
        yearData,
    }

    standingsStore.update(() => response);

    return response;
}

const processStandings = (matchup, standingsData, rosters) => {
    const matchups = {};
    for (const match of matchup) {
        if (!matchups[match.matchup_id]) {
            matchups[match.matchup_id] = [];
        }
        const rosterID = match.roster_id;

        matchups[match.matchup_id].push({
            rosterID,
            division: rosters[rosterID].settings.division,
            points: match.points,
        })
    }

    for (const matchupKey in matchups) {
        const teamA = matchups[matchupKey][0];
        const teamB = matchups[matchupKey][1];

        const divisionMatchup = teamA.division && teamB.division && teamA.division == teamB.division;

        if (divisionMatchup) {
            if (teamA.points > teamB.points) {
                standingsData[teamA.rosterID].divisionWins++;
                standingsData[teamB.rosterID].divisionLosses++;
                continue;
            } else if (teamB.points > teamA.points) {
                standingsData[teamB.rosterID].divisionWins++;
                standingsData[teamA.rosterID].divisionLosses++;
                continue;
            } else {
                standingsData[teamA.rosterID].divisionTies++;
                standingsData[teamB.rosterID].divisionTies++;
            }
        }
    }
    return standingsData;
}

export const getAllTimeLeagueStandings = async () => {
    const [nflState, leagueData, rostersData] = await waitForAll(
        getNflState(),
        getLeagueData(),
        getLeagueRosters(),
    ).catch((err) => { console.error(err); });

    let allTimeStandings = {};

    let currentLeagueData = leagueData;
    while (currentLeagueData) {
        const rostersData = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueData.league_id}/rosters`, { compress: true })
            .then(res => res.json())
            .catch(err => { console.error(err); return null; });

        if (!rostersData) break;

        for (const team of rostersData) {
            if (!allTimeStandings[team.roster_id]) {
                allTimeStandings[team.roster_id] = {
                    rosterID: team.roster_id,
                    wins: 0,
                    losses: 0,
                    ties: 0,
                    fpts: 0,
                    fptsAgainst: 0,
                    maxFpts: 0,
                    ptsDiff: 0,
                };
            }
            allTimeStandings[team.roster_id].wins += team.settings.wins;
            allTimeStandings[team.roster_id].losses += team.settings.losses;
            allTimeStandings[team.roster_id].ties += team.settings.ties;
            allTimeStandings[team.roster_id].fpts += team.settings.fpts + (team.settings.fpts_decimal / 100);
            allTimeStandings[team.roster_id].fptsAgainst += team.settings.fpts_against + (team.settings.fpts_against_decimal / 100);
            allTimeStandings[team.roster_id].maxFpts += team.settings.ppts + (team.settings.ppts_decimal / 100);
            allTimeStandings[team.roster_id].ptsDiff += team.settings.fpts + (team.settings.fpts_decimal / 100) - team.settings.fpts_against + (team.settings.fpts_against_decimal / 100);
        }

        for (const record in allTimeStandings) {
            allTimeStandings[record].fpts = round(allTimeStandings[record].fpts);
            allTimeStandings[record].fptsAgainst = round(allTimeStandings[record].fptsAgainst);
            allTimeStandings[record].maxFpts = round(allTimeStandings[record].maxFpts);
            allTimeStandings[record].ptsDiff = round(allTimeStandings[record].ptsDiff);
        }

        if (!currentLeagueData.previous_league_id) break;
        currentLeagueData = await getLeagueData(currentLeagueData.previous_league_id).catch((err) => { console.error(err); return null; });
    }

    return allTimeStandings;
}
