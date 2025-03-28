import { getLeagueStandings, getLeagueTeamManagers, getAllTimeLeagueStandings } from '$lib/utils/helper';

export async function load() {

    const standingsData = getLeagueStandings();
    const leagueTeamManagersData = getLeagueTeamManagers();
    const allTimeStandingsData = getAllTimeLeagueStandings();

    return {
        standingsData,
        leagueTeamManagersData,
        allTimeStandingsData
    };
}