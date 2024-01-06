import { useState, useEffect, useCallback } from "react";

import { SERVER_URL } from "../../data/static";

const Display = () => {
  const [currentTeam, setCurrentTeam] = useState("...");
  const [numRounds, setNumRounds] = useState(0);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      fetch(SERVER_URL + "/display/update", { method: "GET" })
        .then((r) => r.json())
        .then((r) => {
          setCurrentTeam(r.current_team);
          setNumRounds(r.num_rounds);
          setTeams(r.teams);
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
            <div className="PicksGrid"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Display;
