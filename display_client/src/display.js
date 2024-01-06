import { useState, useEffect, useCallback } from "react";

import { TEAM_MAPPINGS } from "./data/static";

const SERVER_URL = "http://192.168.1.189:5000";

const Display = () => {
  const [currentTeam, setCurrentTeam] = useState("...");
  const [numRounds, setNumRounds] = useState(0);
  const [teams, setTeams] = useState([]);
  const [picks, setPicks] = useState([[]]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      fetch(SERVER_URL + "/display/update", { method: "GET" })
        .then((r) => r.json())
        .then((r) => {
          setCurrentTeam(r.current_team);
          setNumRounds(r.num_rounds);
          setTeams(r.teams);
          setPicks(r.picks);
        })
        .catch(() => {});
    }, 2000);
    return () => clearInterval(updateInterval);
  }, []);

  const buildRounds = useCallback(() => {
    let rounds = [];
    for (let i = 0; i < numRounds; i++) {
      rounds.push(
        <div
          className="Round"
          style={{ fontSize: Math.min(350 / numRounds, 25) + "px" }}
          key={"r" + (i + 1)}
        >
          Round {i + 1}
        </div>
      );
    }
    return rounds;
  }, [numRounds]);

  const buildTeams = useCallback(() => {
    return teams.map((team) => (
      <div className="Team" key={team}>
        {team}
      </div>
    ));
  }, [teams]);

  const buildPicks = useCallback(() => {
    return picks.map((round, ridx) =>
    <div className="Pick-row" key={"r" + ridx}>
        {round.map((pick, pidx) => (
        <div className="Pick" key={"r" + ridx + "p" + pidx}>
          {pick["show"] && <div><b>{pick["position"]}{pick["position_rank"]}</b> {pick["name"]} - {TEAM_MAPPINGS[pick["team"]]}</div>}
        </div>
      ))}
    </div>
      
    );
  }, [picks]);

  return (
    <div className="Container">
      <div className="Header">
        <div className="OffTitle" />
        <div className="OnTitle">{currentTeam} On the Clock</div>
        <div className="OffTitle" />
      </div>
      <div className="BoardContainer">
        <div className="Board">
          <div
            className="RoundColContainer"
            style={{ width: Math.min(150 / numRounds, 8) + "%" }}
          >
            <div className="Round-empty" />
            {buildRounds()}
          </div>
          <div className="TeamColContainer">
            <div className="Team-row">{buildTeams()}</div>
            <div className="PicksGrid">{buildPicks()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
