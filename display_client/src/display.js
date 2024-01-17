import { useState, useEffect, useCallback } from "react";

import { TEAM_MAPPINGS } from "./data/static";

const SERVER_URL = "http://192.168.1.189:5000";

const Display = () => {
  const [currentTeam, setCurrentTeam] = useState("");
  const [numRounds, setNumRounds] = useState(0);
  const [teams, setTeams] = useState([]);
  const [timePerPick, setTimePerPick] = useState(-1);
  const [picks, setPicks] = useState([[]]);

  const [timeOnClock, setTimeOnClock] = useState(-1);
  const [clockRunning, setClockRunning] = useState(true);

  useEffect(() => {console.log("time change:" + timePerPick); setTimeOnClock(timePerPick);}, [timePerPick]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      fetch(SERVER_URL + "/display/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            time: timeOnClock
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          setCurrentTeam(r.current_team);
          setNumRounds(r.num_rounds);
          setTeams(r.teams);
          setPicks(r.picks);
          setClockRunning(r.clock_running);

          if (r.timePerPick !== timePerPick) {
            setTimePerPick(r.time_per_pick);
          }
        })
        .catch(() => {});
    }, 250);
    return () => clearInterval(updateInterval);
  }, [timeOnClock]);


  // timer
  useEffect(() => {
    const timer = setInterval(() => {
        if (clockRunning && timeOnClock > 0) {
            setTimeOnClock((cur) => cur - 1);
        }
    }, 1000);

    return () => {
        clearInterval(timer)
    }
  }, [clockRunning, timeOnClock])

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
    return picks.map((round, ridx) => (
      <div className="Pick-row" key={"r" + ridx}>
        {round.map((pick, pidx) => (
          <div className="Pick" key={"r" + ridx + "p" + pidx}>
            {pick["show"] && (
              <div>
                <b>
                  {pick["position"]}
                  {pick["position_rank"]}
                </b>{" "}
                {pick["position"] !== "DST" ? pick["name"] : ""} -{" "}
                {TEAM_MAPPINGS[pick["team"]]}
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  }, [picks]);

  return (
    <div className="Container">
      <div className="Header">
        <div className="OffTitle" />
        <div className="OnTitle">{currentTeam} On the Clock</div>
        <div className="OffTitle">{timeOnClock}</div>
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
